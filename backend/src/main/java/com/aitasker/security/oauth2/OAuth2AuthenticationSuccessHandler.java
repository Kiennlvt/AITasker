package com.aitasker.security.oauth2;

import com.aitasker.entity.User;
import com.aitasker.repository.UserRepository;
import com.aitasker.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found after OAuth2 login: " + email));

        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        String redirectUrl = frontendUrl + "/oauth2/callback?token=" + accessToken + "&refreshToken=" + refreshToken;
        response.sendRedirect(redirectUrl);
    }
}
