package com.aitasker.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyRevenueResponse {
    private String month;

    @JsonProperty("Spend")
    private double spend;

    @JsonProperty("Earnings")
    private double earnings;
}
