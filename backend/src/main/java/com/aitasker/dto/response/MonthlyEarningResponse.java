package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class MonthlyEarningResponse {
    private String name;
    private Double earnings;
}
