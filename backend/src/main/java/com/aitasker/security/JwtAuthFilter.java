package com.aitasker.security;

import com.aitasker.repository.UserRepository;
import com.aitasker.service.ProjectService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final int ACTIVITY_UPDATE_THROTTLE_MINUTES = 5;

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        if (jwtUtil.validateToken(token)) {
            String userId = jwtUtil.extractUserId(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);

            recordActivity(userId);
        }

        filterChain.doFilter(request, response);
    }

    // Throttled so a burst of requests from one user doesn't hit the DB every time -
    // 5 minutes of granularity is more than enough for a 5-day/48-hour rule.
    // The cancellation-clearing step is delegated to ProjectService (a real Spring
    // proxy, unlike a self-invoked private method here) so its @Transactional
    // actually applies and lazy associations (project.job, project.client) stay
    // loadable while building the withdrawal notification.
    protected void recordActivity(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            LocalDateTime now = LocalDateTime.now();
            if (user.getLastActiveAt() != null
                    && user.getLastActiveAt().isAfter(now.minusMinutes(ACTIVITY_UPDATE_THROTTLE_MINUTES))) {
                return;
            }
            user.setLastActiveAt(now);
            userRepository.save(user);
            projectService.withdrawStaleCancellationRequestsForExpert(userId);
        });
    }
}
