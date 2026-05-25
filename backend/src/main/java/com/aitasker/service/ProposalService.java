package com.aitasker.service;

import com.aitasker.dto.request.SubmitProposalRequest;
import com.aitasker.dto.response.ProposalResponse;

import java.util.List;

public interface ProposalService {
    ProposalResponse submitProposal(String expertId, SubmitProposalRequest request);
    List<ProposalResponse> getProposalsByJob(String clientId, String jobId);
    List<ProposalResponse> getMyProposals(String expertId);
    ProposalResponse acceptProposal(String clientId, String proposalId);
    ProposalResponse rejectProposal(String clientId, String proposalId);
    ProposalResponse withdrawProposal(String expertId, String proposalId);
    ProposalResponse getProposalById(String proposalId);
}
