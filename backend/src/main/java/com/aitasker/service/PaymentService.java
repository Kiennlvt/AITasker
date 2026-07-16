package com.aitasker.service;

import com.aitasker.dto.request.DepositRequest;
import com.aitasker.dto.response.PaymentResponse;

import java.util.Map;

public interface PaymentService {
    PaymentResponse initiateDeposit(String userId, DepositRequest request, String ipAddress);
    String handleVnpayReturn(Map<String, String> params);
}
