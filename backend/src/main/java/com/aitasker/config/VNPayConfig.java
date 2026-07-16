package com.aitasker.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@ConfigurationProperties(prefix = "vnpay")
@Data
public class VNPayConfig {
    private String tmnCode;
    private String secretKey;
    private String payUrl;
    private String returnUrl;
    private String version;
    private String command;
    private String orderType;

    @PostConstruct
    void logLoadedConfig() {
        log.info("VNPay config loaded: tmnCode={}, secretKey={}, payUrl={}",
                tmnCode, maskSecret(secretKey), payUrl);
    }

    private String maskSecret(String secret) {
        if (secret == null || secret.length() <= 4) {
            return "****";
        }
        return "*".repeat(secret.length() - 4) + secret.substring(secret.length() - 4);
    }
}
