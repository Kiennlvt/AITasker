package com.aitasker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryStatResponse {
    private String name;
    private long value;
}
