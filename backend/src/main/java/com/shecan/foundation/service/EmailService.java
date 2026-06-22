package com.shecan.foundation.service;

import com.shecan.foundation.entity.Submission;

public interface EmailService {
    void sendConfirmationToUser(Submission submission);
    void sendNotificationToAdmin(Submission submission);
}
