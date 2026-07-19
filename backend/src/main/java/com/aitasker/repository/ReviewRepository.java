package com.aitasker.repository;

import com.aitasker.entity.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    boolean existsByGiverIdAndProjectId(String giverId, String projectId);
    java.util.List<Review> findByProjectId(String projectId);
    java.util.List<Review> findByReceiverIdOrderByCreatedAtDesc(String receiverId);

    @Query("SELECT r.receiver.id AS expertId, AVG(r.rating) AS avgRating, COUNT(r) AS reviewCount " +
            "FROM Review r WHERE r.receiver.role = com.aitasker.enums.UserRole.EXPERT " +
            "GROUP BY r.receiver.id ORDER BY AVG(r.rating) DESC, COUNT(r) DESC")
    java.util.List<ExpertRatingProjection> findTopRatedExperts(Pageable pageable);

    interface ExpertRatingProjection {
        String getExpertId();
        Double getAvgRating();
        Long getReviewCount();
    }
}
