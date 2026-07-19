package com.aitasker.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ResolveDisputeRequest {
    @NotNull @PositiveOrZero
    private BigDecimal clientAmount;

    @NotNull @PositiveOrZero
    private BigDecimal expertAmount;

    private String resolutionNote;
}
