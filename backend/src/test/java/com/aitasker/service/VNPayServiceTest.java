package com.aitasker.service;

import com.aitasker.config.VNPayConfig;
import org.junit.jupiter.api.Test;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class VNPayServiceTest {

    private static final String TMN_CODE = "AUUXYEW5";
    private static final String SECRET_KEY = "PW39NHIM2SM43LOKS7BX22I0GDEXALXO";

    @Test
    void createPaymentUrl_usesConfiguredSecretForHmacSha512() throws Exception {
        VNPayConfig config = new VNPayConfig();
        config.setTmnCode(TMN_CODE);
        config.setSecretKey(SECRET_KEY);
        config.setPayUrl("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html");
        config.setReturnUrl("http://localhost:8080/api/payment/vnpay-return");
        config.setVersion("2.1.0");
        config.setCommand("pay");
        config.setOrderType("billpayment");

        VNPayService service = new VNPayService(config);
        String url = service.createPaymentUrl("TXN123", BigDecimal.valueOf(100000), "Test deposit", "127.0.0.1");

        assertTrue(url.startsWith(config.getPayUrl() + "?"));

        String queryString = url.substring(url.indexOf('?') + 1);
        Map<String, String> params = new TreeMap<>();
        String secureHash = null;
        for (String pair : queryString.split("&")) {
            String[] kv = pair.split("=", 2);
            String key = kv[0];
            String value = URLDecoder.decode(kv[1], StandardCharsets.UTF_8);
            if ("vnp_SecureHash".equals(key)) {
                secureHash = value;
            } else {
                params.put(key, value);
            }
        }

        assertEquals(TMN_CODE, params.get("vnp_TmnCode"));

        // Recompute the hash independently (VNPay spec: raw key, US_ASCII URL-encoded value)
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (hashData.length() > 0) hashData.append("&");
            hashData.append(entry.getKey())
                    .append("=")
                    .append(java.net.URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
        }

        Mac mac = Mac.getInstance("HmacSHA512");
        mac.init(new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
        byte[] hash = mac.doFinal(hashData.toString().getBytes(StandardCharsets.UTF_8));
        StringBuilder expectedHash = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) expectedHash.append('0');
            expectedHash.append(hex);
        }

        assertEquals(expectedHash.toString(), secureHash);
    }
}
