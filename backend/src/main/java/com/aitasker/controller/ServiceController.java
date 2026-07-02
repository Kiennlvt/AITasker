package com.aitasker.controller;

import com.aitasker.dto.request.CreateServiceRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.ServiceResponse;
import com.aitasker.entity.Service;
import com.aitasker.entity.User;
import com.aitasker.exception.AppException;
import com.aitasker.repository.ServiceRepository;
import com.aitasker.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceRepository serviceRepo;
    private final UserRepository userRepo;

    @GetMapping
    public ApiResponse<Page<ServiceResponse>> getServices(Pageable pageable) {
        return ApiResponse.ok(serviceRepo.findByIsActiveTrue(pageable).map(this::toResponse));
    }

    @GetMapping("/{id}")
    public ApiResponse<ServiceResponse> getService(@PathVariable String id) {
        Service svc = serviceRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Service not found"));
        return ApiResponse.ok(toResponse(svc));
    }

    @GetMapping("/expert/{expertId}")
    public ApiResponse<List<ServiceResponse>> getServicesByExpert(@PathVariable String expertId) {
        return ApiResponse.ok(serviceRepo.findByExpertIdOrderByCreatedAtDesc(expertId)
                .stream().filter(s -> s.isActive()).map(this::toResponse).toList());
    }

    @GetMapping("/my-services")
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<List<ServiceResponse>> getMyServices(@AuthenticationPrincipal UserDetails user) {
        return ApiResponse.ok(serviceRepo.findByExpertIdOrderByCreatedAtDesc(user.getUsername())
                .stream().map(this::toResponse).toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<ServiceResponse> createService(@AuthenticationPrincipal UserDetails user,
                                                       @Valid @RequestBody CreateServiceRequest request) {
        User expert = userRepo.findById(user.getUsername())
                .orElseThrow(() -> AppException.notFound("User not found"));

        Service svc = Service.builder()
                .expert(expert)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .deliveryDays(request.getDeliveryDays())
                .category(request.getCategory())
                .tags(request.getTags())
                .imageUrl(request.getImageUrl())
                .build();

        return ApiResponse.ok(toResponse(serviceRepo.save(svc)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<ServiceResponse> updateService(@AuthenticationPrincipal UserDetails user,
                                                       @PathVariable String id,
                                                       @Valid @RequestBody CreateServiceRequest request) {
        Service svc = serviceRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Service not found"));
        if (!svc.getExpert().getId().equals(user.getUsername()))
            throw AppException.forbidden("Not your service");
        svc.setTitle(request.getTitle());
        svc.setDescription(request.getDescription());
        svc.setPrice(request.getPrice());
        svc.setDeliveryDays(request.getDeliveryDays());
        svc.setCategory(request.getCategory());
        svc.setTags(request.getTags());
        svc.setImageUrl(request.getImageUrl());
        return ApiResponse.ok(toResponse(serviceRepo.save(svc)));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<ServiceResponse> toggleService(@AuthenticationPrincipal UserDetails user,
                                                       @PathVariable String id) {
        Service svc = serviceRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Service not found"));
        if (!svc.getExpert().getId().equals(user.getUsername()))
            throw AppException.forbidden("Not your service");
        svc.setActive(!svc.isActive());
        return ApiResponse.ok(toResponse(serviceRepo.save(svc)));
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
