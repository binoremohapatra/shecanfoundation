package com.shecan.foundation.repository;

import com.shecan.foundation.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findAllByOrderByCreatedAtDesc();

    List<Submission> findByStatusOrderByCreatedAtDesc(String status);

    long countByStatus(String status);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.status = 'NEW'")
    long countNew();

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.status = 'REVIEWED'")
    long countReviewed();

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.status = 'CONTACTED'")
    long countContacted();
}
