package com.aitasker.service.impl;

import com.aitasker.dto.response.ExpertSuggestionDto;
import com.aitasker.dto.response.GeneratePrdResponse;
import com.aitasker.dto.response.ProposalInsightsResponse;
import com.aitasker.dto.response.SuggestExpertsResponse;
import com.aitasker.entity.JobPost;
import com.aitasker.entity.Proposal;
import com.aitasker.entity.Review;
import com.aitasker.entity.User;
import com.aitasker.enums.ProposalStatus;
import com.aitasker.enums.UserRole;
import com.aitasker.exception.AppException;
import com.aitasker.repository.JobPostRepository;
import com.aitasker.repository.ProposalRepository;
import com.aitasker.repository.ReviewRepository;
import com.aitasker.repository.UserRepository;
import com.aitasker.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceImpl implements AiService {

    private final UserRepository userRepo;
    private final ProposalRepository proposalRepo;
    private final JobPostRepository jobRepo;
    private final ReviewRepository reviewRepo;

    @Value("${app.ai.anthropic-api-key:}")
    private String apiKey;

    private static final String CLAUDE_URL = "https://api.anthropic.com/v1/messages";
    private static final String MODEL = "claude-haiku-4-5-20251001";
    private static final List<String> AVATAR_COLORS = List.of(
            "bg-orange-100 text-orange-600",
            "bg-blue-100 text-blue-600",
            "bg-purple-100 text-purple-600",
            "bg-green-100 text-green-600",
            "bg-rose-100 text-rose-600",
            "bg-teal-100 text-teal-600"
    );
    private static final Map<String, String> UNIT_MAP = Map.of(
            "Tháng", "months", "Tuần", "weeks", "Ngày", "days"
    );

    // ─── generatePRD ─────────────────────────────────────────────────────────────

    @Override
    public GeneratePrdResponse generatePRD(String title, String category, String timelineAmount,
                                           String timelineUnit, String description, String selectedPackage) {
        String prd;
        if (apiKey != null && !apiKey.isBlank()) {
            String fromClaude = callClaude(buildPRDPrompt(title, category, timelineAmount, timelineUnit, description, selectedPackage));
            prd = fromClaude != null ? fromClaude : buildTemplatePRD(title, category, timelineAmount, timelineUnit, description, selectedPackage);
        } else {
            prd = buildTemplatePRD(title, category, timelineAmount, timelineUnit, description, selectedPackage);
        }
        return GeneratePrdResponse.builder().prd(prd).build();
    }

    // ─── suggestExperts ──────────────────────────────────────────────────────────

    @Override
    public SuggestExpertsResponse suggestExperts(String title, String category, String description) {
        List<User> experts = userRepo.findByRole(UserRole.EXPERT);
        Set<String> keywords = extractKeywords(title, category, description);

        List<ExpertSuggestionDto> ranked = experts.stream()
                .map(e -> toDto(e, computeMatch(e.getSkills(), keywords)))
                .sorted(Comparator.comparingInt(ExpertSuggestionDto::getMatch).reversed())
                .limit(3)
                .collect(Collectors.toList());

        // If no skill overlap found, return top experts with a default score
        if (ranked.isEmpty() || ranked.get(0).getMatch() == 0) {
            ranked = experts.stream()
                    .limit(3)
                    .map(e -> toDto(e, 70))
                    .collect(Collectors.toList());
        }

        return SuggestExpertsResponse.builder().experts(ranked).build();
    }

    // ─── analyzeProposals ────────────────────────────────────────────────────────

    @Override
    public ProposalInsightsResponse analyzeProposals(String clientId, String jobId) {
        JobPost job = jobRepo.findById(jobId)
                .orElseThrow(() -> AppException.notFound("Job not found"));
        if (!job.getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your job");

        List<Proposal> proposals = proposalRepo.findByJobIdOrderByCreatedAtDesc(jobId).stream()
                .filter(p -> p.getStatus() != ProposalStatus.WITHDRAWN)
                .toList();

        if (proposals.isEmpty()) {
            return ProposalInsightsResponse.builder()
                    .insight("No proposals yet. Once experts start applying, insights comparing their price, delivery time, and rating will appear here.")
                    .build();
        }

        String insight = null;
        if (apiKey != null && !apiKey.isBlank()) {
            insight = callClaude(buildProposalInsightPrompt(job, proposals));
        }
        if (insight == null) {
            insight = buildTemplateInsight(proposals);
        }

        return ProposalInsightsResponse.builder().insight(insight).build();
    }

    private String buildProposalInsightPrompt(JobPost job, List<Proposal> proposals) {
        StringBuilder candidates = new StringBuilder();
        for (Proposal p : proposals) {
            Double rating = averageRating(p.getExpert().getId());
            candidates.append("- %s: $%s bid, %s day delivery, rating %s%s%n".formatted(
                    p.getExpert().getFullName(),
                    p.getBidAmount(),
                    p.getDeliveryTime(),
                    rating != null ? "%.1f/5".formatted(rating) : "no reviews yet",
                    p.getCoverLetter() != null && !p.getCoverLetter().isBlank()
                            ? ", pitch: \"" + truncate(p.getCoverLetter(), 150) + "\"" : ""
            ));
        }

        String skills = job.getSkills() != null && !job.getSkills().isEmpty()
                ? String.join(", ", job.getSkills()) : "General";

        return """
                You are helping a client pick the best freelance proposal for their job.

                Job: %s (skills: %s)

                Candidates:
                %s

                Write a short, actionable comparison (3-4 sentences, no markdown headers, no bullet points) that helps the client decide. \
                Point out trade-offs (e.g. cheapest vs. fastest vs. highest-rated) and name a recommended pick with a brief reason. \
                Be direct and specific, referencing the candidates by name.
                """.formatted(job.getTitle(), skills, candidates);
    }

    private String buildTemplateInsight(List<Proposal> proposals) {
        Proposal cheapest = proposals.stream()
                .min(Comparator.comparing(p -> nz(p.getBidAmount()))).orElse(proposals.get(0));
        Proposal fastest = proposals.stream()
                .min(Comparator.comparing(p -> p.getDeliveryTime() != null ? p.getDeliveryTime() : Integer.MAX_VALUE))
                .orElse(proposals.get(0));
        Proposal topRated = proposals.stream()
                .max(Comparator.comparing(p -> nz(averageRating(p.getExpert().getId()))))
                .orElse(proposals.get(0));

        StringBuilder sb = new StringBuilder();
        sb.append("You have %d proposal%s to review. ".formatted(proposals.size(), proposals.size() == 1 ? "" : "s"));
        sb.append("%s offers the lowest bid at $%s. ".formatted(cheapest.getExpert().getFullName(), cheapest.getBidAmount()));
        if (!fastest.getId().equals(cheapest.getId())) {
            sb.append("%s can deliver fastest, in %s months. ".formatted(fastest.getExpert().getFullName(), fastest.getDeliveryTime()));
        }
        Double topRating = averageRating(topRated.getExpert().getId());
        if (topRating != null && !topRated.getId().equals(cheapest.getId())) {
            sb.append("%s has the highest rating at %.1f/5. ".formatted(topRated.getExpert().getFullName(), topRating));
        }
        sb.append("Weigh price against delivery speed and track record before deciding.");
        return sb.toString();
    }

    private Double averageRating(String expertId) {
        List<Review> reviews = reviewRepo.findByReceiverIdOrderByCreatedAtDesc(expertId);
        if (reviews.isEmpty()) return null;
        return reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
    }

    private double nz(Double d) {
        return d != null ? d : 0.0;
    }

    private String truncate(String s, int max) {
        return s.length() > max ? s.substring(0, max).trim() + "..." : s;
    }

    // ─── Claude API ──────────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private String callClaude(String prompt) {
        try {
            Map<String, Object> body = Map.of(
                    "model", MODEL,
                    "max_tokens", 1500,
                    "messages", List.of(Map.of("role", "user", "content", prompt))
            );

            Map<?, ?> response = RestClient.create()
                    .post()
                    .uri(CLAUDE_URL)
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response == null) return null;
            List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
            return (String) content.get(0).get("text");
        } catch (Exception e) {
            log.warn("Claude API call failed, falling back to template: {}", e.getMessage());
            return null;
        }
    }

    private String buildPRDPrompt(String title, String category, String timelineAmount,
                                   String timelineUnit, String description, String selectedPackage) {
        String safeUnit = UNIT_MAP.getOrDefault(timelineUnit, timelineUnit);
        String pkg = switch (selectedPackage != null ? selectedPackage : "") {
            case "basic"   -> "Basic ($500–$2,500)";
            case "premium" -> "Premium ($10,000+)";
            default        -> "Standard ($2,500–$10,000)";
        };
        return """
                You are a technical product manager. Generate a concise, professional PRD for an AI freelance job.

                Title: %s
                Category: %s
                Timeline: %s %s
                Budget: %s
                Description: %s

                Use these exact sections (markdown):
                # Project Overview: <title>
                ## Objective
                ## Technical Requirements
                ## Scope of Work
                ## Deliverables
                ## Candidate Expectations

                Be specific, technical, and professional. No filler text.
                """.formatted(title, category, timelineAmount, safeUnit, pkg, description);
    }

    private String buildTemplatePRD(String title, String category, String timelineAmount,
                                     String timelineUnit, String description, String selectedPackage) {
        String safeUnit = UNIT_MAP.getOrDefault(timelineUnit, timelineUnit);
        String pkg = switch (selectedPackage != null ? selectedPackage : "") {
            case "basic"   -> "Basic ($500–$2,500)";
            case "premium" -> "Premium ($10,000+)";
            default        -> "Standard ($2,500–$10,000)";
        };
        String timeline = (timelineAmount != null && !timelineAmount.isBlank())
                ? timelineAmount + " " + safeUnit : "To be determined";
        String safeTitle = (title != null && !title.isBlank()) ? title : "Untitled Project";
        String safeDesc  = (description != null && !description.isBlank()) ? description : "To be provided.";

        return """
                # Project Overview: %s

                ## Objective
                %s

                ## Technical Requirements
                - **Domain**: %s
                - **Timeline**: %s
                - **Budget Package**: %s

                ## Scope of Work
                1. Requirements analysis and solution architecture
                2. Core implementation and iterative development
                3. Testing, validation, and performance benchmarking
                4. Documentation, handoff, and deployment support

                ## Deliverables
                - Fully functional solution meeting all specified requirements
                - Technical documentation and source code
                - Post-delivery support (1 week)

                ## Candidate Expectations
                Experienced AI specialist with a proven track record in %s. Prior published work or portfolio projects in the relevant domain are strongly preferred.
                """.formatted(safeTitle, safeDesc, category, timeline, pkg, category);
    }

    // ─── Expert scoring ──────────────────────────────────────────────────────────

    private Set<String> extractKeywords(String title, String category, String description) {
        Set<String> kw = new HashSet<>();
        Stream.of(title, category, description)
                .filter(s -> s != null && !s.isBlank())
                .flatMap(s -> Arrays.stream(s.split("\\s+")))
                .map(String::toLowerCase)
                .filter(w -> w.length() > 2)
                .forEach(kw::add);
        return kw;
    }

    private int computeMatch(List<String> expertSkills, Set<String> keywords) {
        if (expertSkills == null || expertSkills.isEmpty() || keywords.isEmpty()) return 0;
        long matched = expertSkills.stream()
                .map(String::toLowerCase)
                .filter(skill -> keywords.stream().anyMatch(k -> k.contains(skill) || skill.contains(k)))
                .count();
        return (int) Math.min(99, 60 + matched * 10);
    }

    private ExpertSuggestionDto toDto(User expert, int match) {
        long completedJobs = proposalRepo.countByExpertIdAndStatus(expert.getId(), ProposalStatus.ACCEPTED);

        double rating = 4.0 + Math.min(0.9,
                (expert.getSkills() != null ? expert.getSkills().size() : 0) * 0.08 + completedJobs * 0.02);
        rating = Math.round(rating * 10.0) / 10.0;

        String safeName = (expert.getFullName() != null && !expert.getFullName().isBlank())
                ? expert.getFullName() : "Unknown User";

        String initials = Arrays.stream(safeName.split("\\s+"))
                .filter(w -> !w.isEmpty())
                .map(w -> String.valueOf(w.charAt(0)).toUpperCase())
                .limit(2)
                .collect(Collectors.joining());

        String title = "AI Specialist";
        if (expert.getBio() != null && !expert.getBio().isBlank()) {
            title = expert.getBio().split("[.!?]")[0].trim();
            if (title.length() > 45) title = title.substring(0, 45).trim() + "...";
        }

        String rate = expert.getHourlyRate() != null
                ? "$" + expert.getHourlyRate().intValue() + "/hr" : "Negotiable";

        String color = AVATAR_COLORS.get(Math.abs(expert.getId().hashCode()) % AVATAR_COLORS.size());

        return ExpertSuggestionDto.builder()
                .id(expert.getId())
                .name(safeName)
                .title(title)
                .skills(expert.getSkills() != null ? expert.getSkills() : List.of())
                .rating(rating)
                .jobs(completedJobs)
                .rate(rate)
                .initials(initials)
                .match(match)
                .color(color)
                .build();
    }
}
