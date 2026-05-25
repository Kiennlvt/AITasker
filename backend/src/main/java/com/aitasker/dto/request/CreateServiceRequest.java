package com.aitasker.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateServiceRequest {
    @NotBlank private String title;
    private String description;
    @NotNull @Min(1) private Double price;
    @NotNull @Min(1) private Integer deliveryDays;
    @NotBlank private String category;
    private List<String> tags;
    private String imageUrl;
}
