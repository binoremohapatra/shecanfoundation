package com.shecan.foundation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;
}
