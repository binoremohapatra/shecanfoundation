package com.shecan.foundation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shecan.foundation.dto.ContactRequest;
import com.shecan.foundation.entity.Submission;
import com.shecan.foundation.service.ContactService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContactController.class)
class ContactControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper mapper;
    @MockBean  ContactService contactService;

    private ContactRequest validRequest() {
        ContactRequest req = new ContactRequest();
        req.setFullName("Jane Doe");
        req.setEmail("jane@example.com");
        req.setPhone("08012345678");
        req.setHelpType("Volunteer");
        req.setMessage("I am passionate about empowering women and want to volunteer my time and skills.");
        return req;
    }

    @Test
    void submitValidForm_returns200() throws Exception {
        Submission saved = Submission.builder()
                .id(1L).fullName("Jane Doe").email("jane@example.com")
                .helpType("Volunteer").message("I am passionate about empowering women...")
                .status("NEW").createdAt(LocalDateTime.now()).build();

        when(contactService.submit(any())).thenReturn(saved);

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(validRequest())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Jane Doe"))
                .andExpect(jsonPath("$.data.status").value("NEW"));
    }

    @Test
    void submitMissingName_returns422() throws Exception {
        ContactRequest req = validRequest();
        req.setFullName("");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.fullName").exists());
    }

    @Test
    void submitInvalidEmail_returns422() throws Exception {
        ContactRequest req = validRequest();
        req.setEmail("not-an-email");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.email").exists());
    }

    @Test
    void submitShortMessage_returns422() throws Exception {
        ContactRequest req = validRequest();
        req.setMessage("Too short");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.data.message").exists());
    }
}
