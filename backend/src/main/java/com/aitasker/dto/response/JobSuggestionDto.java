package com.aitasker.dto.response;

import lombok.*;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class JobSuggestionDto {
    private String improvedDescription;
    private List<String> suggestedSkills;
    private BudgetRange budgetRange;
    private String estimatedTimeline;

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BudgetRange {
        private double min;
        private double max;
    }
}
