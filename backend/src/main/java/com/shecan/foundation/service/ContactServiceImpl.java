package com.shecan.foundation.service;

import com.shecan.foundation.dto.ContactRequest;
import com.shecan.foundation.dto.StatsDto;
import com.shecan.foundation.entity.Submission;
import com.shecan.foundation.exception.SubmissionNotFoundException;
import com.shecan.foundation.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactServiceImpl.class);

    private final SubmissionRepository repo;
    private final EmailService emailService;

    @Override
    @Transactional
    public Submission submit(ContactRequest req) {
        Submission submission = Submission.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .helpType(req.getHelpType())
                .message(req.getMessage())
                .status("NEW")
                .build();

        submission = repo.save(submission);
        log.info("New submission #{} saved — {} <{}>", submission.getId(),
                submission.getFullName(), submission.getEmail());

        // Fire-and-forget async emails (failures never roll back the transaction)
        emailService.sendConfirmationToUser(submission);
        emailService.sendNotificationToAdmin(submission);

        return submission;
    }

    @Override
    public List<Submission> getAllSubmissions() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Submission getSubmissionById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new SubmissionNotFoundException(id));
    }

    @Override
    @Transactional
    public Submission updateStatus(Long id, String status) {
        Submission sub = getSubmissionById(id);
        sub.setStatus(status.toUpperCase());
        return repo.save(sub);
    }

    @Override
    public StatsDto getStats() {
        return StatsDto.builder()
                .total(repo.count())
                .newCount(repo.countNew())
                .reviewedCount(repo.countReviewed())
                .contactedCount(repo.countContacted())
                .build();
    }
}
