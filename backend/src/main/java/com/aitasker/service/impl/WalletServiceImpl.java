package com.aitasker.service.impl;

import com.aitasker.dto.response.WalletResponse;
import com.aitasker.dto.response.WalletTransactionResponse;
import com.aitasker.entity.User;
import com.aitasker.entity.Wallet;
import com.aitasker.entity.WalletTransaction;
import com.aitasker.enums.PaymentMethod;
import com.aitasker.enums.TransactionStatus;
import com.aitasker.enums.TransactionType;
import com.aitasker.exception.AppException;
import com.aitasker.repository.UserRepository;
import com.aitasker.repository.WalletRepository;
import com.aitasker.repository.WalletTransactionRepository;
import com.aitasker.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final UserRepository userRepository; // used in getOrCreateWallet

    @Override
    public Wallet getOrCreateWallet(String userId) {
        return walletRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> AppException.notFound("User not found"));
            return walletRepository.save(Wallet.builder().user(user).balance(BigDecimal.ZERO).build());
        });
    }

    @Override
    public WalletResponse getWallet(String userId) {
        Wallet wallet = getOrCreateWallet(userId);
        long totalTransactions = transactionRepository.countByWalletId(wallet.getId());
        return toResponse(wallet, totalTransactions);
    }

    @Override
    public Page<WalletTransactionResponse> getTransactions(String userId, Pageable pageable) {
        Wallet wallet = getOrCreateWallet(userId);
        return transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId(), pageable)
                .map(this::toTransactionResponse);
    }

    @Override
    public WalletTransaction createPendingTransaction(Wallet wallet, BigDecimal amount, String txnRef) {
        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(TransactionType.DEPOSIT)
                .status(TransactionStatus.PENDING)
                .paymentMethod(PaymentMethod.VNPAY)
                .vnpTxnRef(txnRef)
                .description("Top up via VNPay")
                .build();
        return transactionRepository.save(transaction);
    }

    @Override
    public void completeTransaction(String txnRef, String vnpTransactionNo) {
        WalletTransaction transaction = transactionRepository.findByVnpTxnRef(txnRef)
                .orElseThrow(() -> AppException.notFound("Transaction not found: " + txnRef));
        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw AppException.conflict("Transaction already processed");
        }
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setVnpTransactionNo(vnpTransactionNo);
        transactionRepository.save(transaction);

        Wallet wallet = transaction.getWallet();
        wallet.setBalance(wallet.getBalance().add(transaction.getAmount()));
        walletRepository.save(wallet);
    }

    @Override
    public void failTransaction(String txnRef) {
        transactionRepository.findByVnpTxnRef(txnRef).ifPresent(transaction -> {
            if (transaction.getStatus() == TransactionStatus.PENDING) {
                transaction.setStatus(TransactionStatus.FAILED);
                transactionRepository.save(transaction);
            }
        });
    }

    @Override
    public WalletTransaction debitForEscrow(String userId, BigDecimal amount, String description) {
        Wallet wallet = getOrCreateWallet(userId);
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw AppException.badRequest("Insufficient wallet balance. Please deposit enough funds before creating a project.");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(TransactionType.ESCROW_LOCK)
                .status(TransactionStatus.SUCCESS)
                .paymentMethod(PaymentMethod.WALLET)
                .description(description)
                .build();
        return transactionRepository.save(transaction);
    }

    @Override
    public WalletTransaction creditFromEscrowRefund(String userId, BigDecimal amount, String description) {
        Wallet wallet = getOrCreateWallet(userId);
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(TransactionType.ESCROW_REFUND)
                .status(TransactionStatus.SUCCESS)
                .paymentMethod(PaymentMethod.WALLET)
                .description(description)
                .build();
        return transactionRepository.save(transaction);
    }

    @Override
    public WalletTransaction creditFromEscrowRelease(String userId, BigDecimal amount, String description) {
        Wallet wallet = getOrCreateWallet(userId);
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(TransactionType.ESCROW_RELEASE)
                .status(TransactionStatus.SUCCESS)
                .paymentMethod(PaymentMethod.WALLET)
                .description(description)
                .build();
        return transactionRepository.save(transaction);
    }

    private WalletResponse toResponse(Wallet wallet, long totalTransactions) {
        return WalletResponse.builder()
                .id(wallet.getId())
                .balance(wallet.getBalance())
                .totalTransactions(totalTransactions)
                .userId(wallet.getUser().getId())
                .userFullName(wallet.getUser().getFullName())
                .userEmail(wallet.getUser().getEmail())
                .build();
    }

    private WalletTransactionResponse toTransactionResponse(WalletTransaction t) {
        return WalletTransactionResponse.builder()
                .id(t.getId())
                .amount(t.getAmount())
                .type(t.getType().name())
                .status(t.getStatus().name())
                .paymentMethod(t.getPaymentMethod().name())
                .transactionCode(t.getTransactionCode())
                .vnpTxnRef(t.getVnpTxnRef())
                .vnpTransactionNo(t.getVnpTransactionNo())
                .description(t.getDescription())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
