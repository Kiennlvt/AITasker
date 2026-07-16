package com.aitasker.service;

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
import com.aitasker.service.impl.WalletServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class WalletServiceImplTest {

    private WalletRepository walletRepository;
    private WalletTransactionRepository transactionRepository;
    private UserRepository userRepository;
    private WalletServiceImpl walletService;

    private Wallet wallet;

    @BeforeEach
    void setUp() {
        walletRepository = mock(WalletRepository.class);
        transactionRepository = mock(WalletTransactionRepository.class);
        userRepository = mock(UserRepository.class);
        walletService = new WalletServiceImpl(walletRepository, transactionRepository, userRepository);

        User user = User.builder().id("client-1").build();
        wallet = Wallet.builder().id("wallet-1").user(user).balance(BigDecimal.valueOf(1000)).build();
        when(walletRepository.findByUserId("client-1")).thenReturn(Optional.of(wallet));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transactionRepository.save(any(WalletTransaction.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void debitForEscrow_throwsExactMessage_whenBalanceInsufficient() {
        AppException ex = assertThrows(AppException.class,
                () -> walletService.debitForEscrow("client-1", BigDecimal.valueOf(5000), "Escrow lock"));

        assertEquals("Insufficient wallet balance. Please deposit enough funds before creating a project.",
                ex.getMessage());
        verify(walletRepository, never()).save(any());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void debitForEscrow_deductsBalanceAndRecordsTransaction_whenSufficient() {
        WalletTransaction tx = walletService.debitForEscrow("client-1", BigDecimal.valueOf(400), "Escrow lock");

        assertEquals(BigDecimal.valueOf(600), wallet.getBalance());
        assertEquals(TransactionType.ESCROW_LOCK, tx.getType());
        assertEquals(TransactionStatus.SUCCESS, tx.getStatus());
        assertEquals(PaymentMethod.WALLET, tx.getPaymentMethod());
        assertEquals(BigDecimal.valueOf(400), tx.getAmount());
    }

    @Test
    void creditFromEscrowRefund_increasesBalanceAndRecordsTransaction() {
        ArgumentCaptor<WalletTransaction> captor = ArgumentCaptor.forClass(WalletTransaction.class);

        walletService.creditFromEscrowRefund("client-1", BigDecimal.valueOf(300), "Escrow refund");

        assertEquals(BigDecimal.valueOf(1300), wallet.getBalance());
        verify(transactionRepository).save(captor.capture());
        assertEquals(TransactionType.ESCROW_REFUND, captor.getValue().getType());
        assertEquals(PaymentMethod.WALLET, captor.getValue().getPaymentMethod());
    }

    @Test
    void creditFromEscrowRelease_increasesBalanceAndRecordsTransaction() {
        ArgumentCaptor<WalletTransaction> captor = ArgumentCaptor.forClass(WalletTransaction.class);

        walletService.creditFromEscrowRelease("client-1", BigDecimal.valueOf(200), "Milestone payment release");

        assertEquals(BigDecimal.valueOf(1200), wallet.getBalance());
        verify(transactionRepository).save(captor.capture());
        assertEquals(TransactionType.ESCROW_RELEASE, captor.getValue().getType());
        assertEquals(PaymentMethod.WALLET, captor.getValue().getPaymentMethod());
        assertEquals(BigDecimal.valueOf(200), captor.getValue().getAmount());
    }
}
