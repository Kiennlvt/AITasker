package com.aitasker.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class UpdateUserRequest {
    private String fullName;
    private String bio;
    private String location;
    private Double hourlyRate;
    private List<String> skills;
    private String avatarUrl;
}
