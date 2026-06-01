package com.aitasker.service;

import com.aitasker.dto.response.GeneratePrdResponse;
import com.aitasker.dto.response.SuggestExpertsResponse;

public interface AiService {

    GeneratePrdResponse generatePRD(String title, String category, String timelineAmount,
                                    String timelineUnit, String description, String selectedPackage);

    SuggestExpertsResponse suggestExperts(String title, String category, String description);
}
