package com.aitasker.service.impl;

import com.aitasker.dto.request.DepositRequest;
import com.aitasker.dto.response.PaymentResponse;
import com.aitasker.entity.Wallet;
import com.aitasker.exception.AppException;
import com.aitasker.service.PaymentService;
import com.aitasker.service.VNPayService;
import com.aitasker.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final WalletService walletService;
    private final VNPayService vnPayService;

    @Override
    public PaymentResponse initiateDeposit(String userId, DepositRequest request, String ipAddress) {
        Wallet wallet = walletService.getOrCreateWallet(userId);

        String txnRef = buildTxnRef();
        walletService.createPendingTransaction(wallet, request.getAmount(), txnRef);

        String orderInfo = "Nap tien AITasker " + txnRef;
        String paymentUrl = vnPayService.createPaymentUrl(txnRef, request.getAmount(), orderInfo, ipAddress);

        return PaymentResponse.builder().paymentUrl(paymentUrl).build();
    }

    @Override
    public String handleVnpayReturn(Map<String, String> params) {
        if (!vnPayService.verifyCallback(params)) {
            throw AppException.badRequest("Invalid payment signature");
        }

        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");

        if ("00".equals(responseCode)) {
            walletService.completeTransaction(txnRef, transactionNo);
            return "success";
        }

        walletService.failTransaction(txnRef);
        return "failed";
    }

    private String buildTxnRef() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return timestamp + suffix;
    }
}
