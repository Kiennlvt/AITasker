package com.aitasker.service;

import com.aitasker.dto.response.DisputeResponse;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface DisputeService {
    DisputeResponse fileDispute(String userId, String milestoneId, String reason);
    DisputeResponse addEvidence(String userId, String disputeId, List<MultipartFile> files);
    DisputeResponse respondToDispute(String userId, String disputeId, String response);
    DisputeResponse getDispute(String userId, String disputeId);
    List<DisputeResponse> getDisputesForProject(String userId, String projectId);
    List<DisputeResponse> getAllDisputes(String status);
    DisputeResponse resolveDispute(String adminId, String disputeId, BigDecimal clientAmount,
                                    BigDecimal expertAmount, String resolutionNote);
}
