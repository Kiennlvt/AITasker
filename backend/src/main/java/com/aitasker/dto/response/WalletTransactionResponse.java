package com.aitasker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class WalletTransactionResponse {
    private String id;
    private BigDecimal amount;
    private String type;
    private String status;
    private String paymentMethod;
    private String transactionCode;
    private String vnpTxnRef;
    private String vnpTransactionNo;
    private String description;
    private LocalDateTime createdAt;
}
