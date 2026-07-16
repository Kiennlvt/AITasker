package com.aitasker.controller;

import com.aitasker.dto.request.DepositRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.PaymentResponse;
import com.aitasker.dto.response.WalletResponse;
import com.aitasker.dto.response.WalletTransactionResponse;
import com.aitasker.service.PaymentService;
import com.aitasker.service.WalletService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final PaymentService paymentService;

    @GetMapping
    public ApiResponse<WalletResponse> getWallet(@AuthenticationPrincipal UserDetails user) {
        return ApiResponse.ok(walletService.getWallet(user.getUsername()));
    }

    @GetMapping("/transactions")
    public ApiResponse<Page<WalletTransactionResponse>> getTransactions(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(walletService.getTransactions(user.getUsername(), PageRequest.of(page, size)));
    }

    @PostMapping("/deposit")
    public ApiResponse<PaymentResponse> deposit(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody @Valid DepositRequest request,
            HttpServletRequest httpRequest) {
        String ipAddress = resolveClientIp(httpRequest);
        return ApiResponse.ok(paymentService.initiateDeposit(user.getUsername(), request, ipAddress));
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
