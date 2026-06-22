package com.shecan.foundation.controller;

import com.shecan.foundation.dto.AdminStatusUpdateRequest;
import com.shecan.foundation.dto.ApiResponse;
import com.shecan.foundation.dto.StatsDto;
import com.shecan.foundation.entity.Submission;
import com.shecan.foundation.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only endpoints — require X-Admin-Key header")
@SecurityRequirement(name = "AdminKeyAuth")
public class AdminController {

    private final ContactService contactService;

    @GetMapping("/submissions")
    @Operation(summary = "Get all submissions (newest first)")
    public ResponseEntity<ApiResponse<List<Submission>>> getAllSubmissions() {
        List<Submission> list = contactService.getAllSubmissions();
        return ResponseEntity.ok(
                ApiResponse.ok("Fetched " + list.size() + " submissions", list)
        );
    }

    @GetMapping("/submissions/{id}")
    @Operation(summary = "Get a single submission by ID")
    public ResponseEntity<ApiResponse<Submission>> getSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.ok("Submission found", contactService.getSubmissionById(id))
        );
    }

    @PatchMapping("/submissions/{id}/status")
    @Operation(summary = "Update submission status (NEW | REVIEWED | CONTACTED)")
    public ResponseEntity<ApiResponse<Submission>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdminStatusUpdateRequest req) {

        Submission updated = contactService.updateStatus(id, req.getStatus());
        return ResponseEntity.ok(
                ApiResponse.ok("Status updated to " + updated.getStatus(), updated)
        );
    }

    @GetMapping("/stats")
    @Operation(summary = "Get submission counts by status")
    public ResponseEntity<ApiResponse<StatsDto>> getStats() {
        return ResponseEntity.ok(
                ApiResponse.ok("Stats fetched", contactService.getStats())
        );
    }
}
