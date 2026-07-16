package com.aitasker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class WalletResponse {
    private String id;
    private BigDecimal balance;
    private long totalTransactions;
    private String userId;
    private String userFullName;
    private String userEmail;
}
