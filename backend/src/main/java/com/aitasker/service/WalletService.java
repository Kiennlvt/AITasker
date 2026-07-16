package com.aitasker.service;

import com.aitasker.dto.response.WalletResponse;
import com.aitasker.dto.response.WalletTransactionResponse;
import com.aitasker.entity.Wallet;
import com.aitasker.entity.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface WalletService {
    Wallet getOrCreateWallet(String userId);
    WalletResponse getWallet(String userId);
    Page<WalletTransactionResponse> getTransactions(String userId, Pageable pageable);
    WalletTransaction createPendingTransaction(Wallet wallet, BigDecimal amount, String txnRef);
    void completeTransaction(String txnRef, String vnpTransactionNo);
    void failTransaction(String txnRef);

    /**
     * Debits the user's wallet to lock funds in escrow. Throws AppException.badRequest
     * with the standard insufficient-balance message if the balance is too low.
     */
    WalletTransaction debitForEscrow(String userId, BigDecimal amount, String description);

    /** Credits the user's wallet when an escrow amount is refunded. */
    WalletTransaction creditFromEscrowRefund(String userId, BigDecimal amount, String description);

    /** Credits the expert's wallet when a milestone payment is released from escrow. */
    WalletTransaction creditFromEscrowRelease(String userId, BigDecimal amount, String description);
}
