package com.aitasker.repository;

import com.aitasker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    boolean existsByNameIgnoreCase(String name);
    List<Category> findAllByOrderByNameAsc();
    List<Category> findByIsActiveTrueOrderByNameAsc();
}
