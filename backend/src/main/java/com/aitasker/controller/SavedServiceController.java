package com.aitasker.controller;

import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.ServiceResponse;
import com.aitasker.entity.SavedService;
import com.aitasker.entity.Service;
import com.aitasker.entity.User;
import com.aitasker.exception.AppException;
import com.aitasker.repository.SavedServiceRepository;
import com.aitasker.repository.ServiceRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-services")
@RequiredArgsConstructor
public class SavedServiceController {

    private final SavedServiceRepository savedServiceRepo;
    private final ServiceRepository serviceRepo;
    private final UserRepository userRepo;

    @GetMapping
    public ApiResponse<List<ServiceResponse>> getSavedServices(@AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.ok(
                savedServiceRepo.findByUserIdOrderBySavedAtDesc(userDetails.getUsername())
                        .stream()
                        .map(ss -> toResponse(ss.getService()))
                        .toList()
        );
    }

    @GetMapping("/{serviceId}/check")
    public ApiResponse<Map<String, Boolean>> checkSaved(@AuthenticationPrincipal UserDetails userDetails,
                                                        @PathVariable String serviceId) {
        boolean saved = savedServiceRepo.existsByUserIdAndServiceId(userDetails.getUsername(), serviceId);
        return ApiResponse.ok(Map.of("saved", saved));
    }

    @PostMapping("/{serviceId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Map<String, Boolean>> saveService(@AuthenticationPrincipal UserDetails userDetails,
                                                         @PathVariable String serviceId) {
        String userId = userDetails.getUsername();
        if (savedServiceRepo.existsByUserIdAndServiceId(userId, serviceId)) {
            return ApiResponse.ok(Map.of("saved", true));
        }
        User user = userRepo.findById(userId)
                .orElseThrow(() -> AppException.notFound("User not found"));
        Service service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> AppException.notFound("Service not found"));

        savedServiceRepo.save(SavedService.builder().user(user).service(service).build());
        return ApiResponse.ok(Map.of("saved", true));
    }

    @DeleteMapping("/{serviceId}")
    public ApiResponse<Map<String, Boolean>> unsaveService(@AuthenticationPrincipal UserDetails userDetails,
                                                           @PathVariable String serviceId) {
        String userId = userDetails.getUsername();
        savedServiceRepo.findByUserIdAndServiceId(userId, serviceId)
                .ifPresent(savedServiceRepo::delete);
        return ApiResponse.ok(Map.of("saved", false));
    }

    private ServiceResponse toResponse(Service s) {
        return ServiceResponse.builder()
                .id(s.getId())
                .expertId(s.getExpert().getId())
                .expertName(s.getExpert().getFullName())
                .expertAvatarUrl(s.getExpert().getAvatarUrl())
                .title(s.getTitle())
                .description(s.getDescription())
                .price(s.getPrice())
                .deliveryDays(s.getDeliveryDays())
                .category(s.getCategory())
                .tags(s.getTags())
                .imageUrl(s.getImageUrl())
                .isActive(s.isActive())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
