package com.aitasker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ExpertSuggestionDto {
    private String id;
    private String name;
    private String title;
    private List<String> skills;
    private double rating;
    private long jobs;
    private String rate;
    private String initials;
    private int match;
    private String color;
}
