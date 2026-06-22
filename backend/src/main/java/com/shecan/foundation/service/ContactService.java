package com.shecan.foundation.service;

import com.shecan.foundation.dto.ContactRequest;
import com.shecan.foundation.dto.StatsDto;
import com.shecan.foundation.entity.Submission;

import java.util.List;

public interface ContactService {
    Submission submit(ContactRequest request);
    List<Submission> getAllSubmissions();
    Submission getSubmissionById(Long id);
    Submission updateStatus(Long id, String status);
    StatsDto getStats();
}
