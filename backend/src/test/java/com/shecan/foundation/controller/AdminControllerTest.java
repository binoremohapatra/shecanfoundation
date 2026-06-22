package com.shecan.foundation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shecan.foundation.config.AdminAuthFilter;
import com.shecan.foundation.dto.AdminStatusUpdateRequest;
import com.shecan.foundation.dto.StatsDto;
import com.shecan.foundation.entity.Submission;
import com.shecan.foundation.service.ContactService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@Import(AdminAuthFilter.class)
class AdminControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper mapper;
    @MockBean  ContactService contactService;

    private static final String VALID_KEY = "shecan-admin-2025";

    private Submission sampleSubmission() {
        return Submission.builder()
                .id(1L).fullName("Jane").email("jane@example.com")
                .helpType("Volunteer").message("A meaningful message about volunteering.")
                .status("NEW").createdAt(LocalDateTime.now()).build();
    }

    @Test
    void getSubmissions_withoutKey_returns401() throws Exception {
        mockMvc.perform(get("/api/admin/submissions"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getSubmissions_withWrongKey_returns401() throws Exception {
        mockMvc.perform(get("/api/admin/submissions")
                        .header("X-Admin-Key", "wrong-key"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getSubmissions_withValidKey_returns200() throws Exception {
        when(contactService.getAllSubmissions()).thenReturn(List.of(sampleSubmission()));

        mockMvc.perform(get("/api/admin/submissions")
                        .header("X-Admin-Key", VALID_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].fullName").value("Jane"));
    }

    @Test
    void patchStatus_returns200WithUpdatedStatus() throws Exception {
        Submission updated = sampleSubmission();
        updated.setStatus("REVIEWED");
        when(contactService.updateStatus(anyLong(), any())).thenReturn(updated);

        AdminStatusUpdateRequest req = new AdminStatusUpdateRequest();
        req.setStatus("REVIEWED");

        mockMvc.perform(patch("/api/admin/submissions/1/status")
                        .header("X-Admin-Key", VALID_KEY)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("REVIEWED"));
    }

    @Test
    void getStats_withValidKey_returnsStats() throws Exception {
        when(contactService.getStats()).thenReturn(
                StatsDto.builder().total(5).newCount(3).reviewedCount(1).contactedCount(1).build()
        );

        mockMvc.perform(get("/api/admin/stats")
                        .header("X-Admin-Key", VALID_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").value(5))
                .andExpect(jsonPath("$.data.newCount").value(3));
    }
}
