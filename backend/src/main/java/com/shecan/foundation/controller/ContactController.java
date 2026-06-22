package com.shecan.foundation.controller;

import com.shecan.foundation.dto.ApiResponse;
import com.shecan.foundation.dto.ContactRequest;
import com.shecan.foundation.entity.Submission;
import com.shecan.foundation.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Public contact & volunteer form submission")
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    @Operation(summary = "Submit contact / volunteer form",
               description = "Saves the form entry and sends confirmation emails.")
    public ResponseEntity<ApiResponse<Submission>> submit(
            @Valid @RequestBody ContactRequest request) {

        Submission saved = contactService.submit(request);
        return ResponseEntity.ok(
                ApiResponse.ok("Thank you! We've received your message and will be in touch within 48 hours.", saved)
        );
    }
}
