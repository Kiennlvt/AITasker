package com.aitasker.security.oauth2;

import com.aitasker.entity.User;
import com.aitasker.enums.UserRole;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String rawEmail = (String) attributes.get("email");
        String facebookId = (String) attributes.get("id");
        String email = (rawEmail == null || rawEmail.isBlank())
                ? facebookId + "@facebook.com"
                : rawEmail;
        String name = (String) attributes.get("name");
        String avatarUrl = extractAvatar(registrationId, attributes);

        userRepository.findByEmail(email).orElseGet(() -> userRepository.save(
            User.builder()
                .email(email)
                .fullName(name != null ? name : email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .role(UserRole.CLIENT)
                .avatarUrl(avatarUrl)
                .build()
        ));

        return oAuth2User;
    }

    private String extractAvatar(String registrationId, Map<String, Object> attributes) {
        if ("google".equals(registrationId)) {
            return (String) attributes.get("picture");
        }
        if ("facebook".equals(registrationId)) {
            Object pic = attributes.get("picture");
            if (pic instanceof Map<?, ?> picMap) {
                Object data = picMap.get("data");
                if (data instanceof Map<?, ?> dataMap) {
                    return (String) dataMap.get("url");
                }
            }
        }
        return null;
    }
}
