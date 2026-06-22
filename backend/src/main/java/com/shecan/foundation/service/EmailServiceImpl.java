package com.shecan.foundation.service;

import com.shecan.foundation.entity.Submission;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");

    private final JavaMailSender mailSender;
    private final boolean devMode;
    private final String adminEmail;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            @Value("${app.mail.dev-mode:true}") boolean devMode,
            @Value("${app.admin.email:president@shecanfoundation.org}") String adminEmail) {
        this.mailSender = mailSender;
        this.devMode    = devMode;
        this.adminEmail = adminEmail;
    }

    // ── User confirmation email ───────────────────────────────────────────────

    @Override
    @Async
    public void sendConfirmationToUser(Submission submission) {
        String subject = "She Can Foundation — We received your story!";
        String html = buildUserConfirmationHtml(submission);
        send(submission.getEmail(), subject, html, "user-confirmation");
    }

    // ── Admin notification email ──────────────────────────────────────────────

    @Override
    @Async
    public void sendNotificationToAdmin(Submission submission) {
        String subject = String.format("New She Can Submission — %s from %s",
                submission.getHelpType(), submission.getFullName());
        String html = buildAdminNotificationHtml(submission);
        send(adminEmail, subject, html, "admin-notification");
    }

    // ── Send helper ───────────────────────────────────────────────────────────

    private void send(String to, String subject, String html, String type) {
        if (devMode) {
            log.info("=== DEV MODE EMAIL ({}) ===\nTo: {}\nSubject: {}\n---\n{}\n===",
                    type, to, subject, html.replaceAll("<[^>]+>", ""));
            return;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom("noreply@shecanfoundation.org", "She Can Foundation");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(msg);
            log.info("Email sent ({}) to {}", type, to);
        } catch (Exception e) {
            // Never roll back the form submission due to email failure
            log.error("Failed to send {} email to {}: {}", type, to, e.getMessage());
        }
    }

    // ── HTML Templates ────────────────────────────────────────────────────────

    private String buildUserConfirmationHtml(Submission s) {
        return """
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;font-family:'DM Sans',Arial,sans-serif;background:#FDF6F0;">
                  <div style="max-width:600px;margin:40px auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <div style="background:#E8452A;padding:40px 32px;text-align:center;">
                      <h1 style="color:#fff;font-family:Georgia,serif;font-size:28px;margin:0 0 8px;">
                        She <em>Can!</em> Foundation
                      </h1>
                      <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:0;letter-spacing:2px;text-transform:uppercase;">
                        Empowering Women · Changing the World
                      </p>
                    </div>
                    <!-- Body -->
                    <div style="background:#fff;padding:40px 32px;">
                      <h2 style="color:#0D1B2A;font-family:Georgia,serif;font-size:22px;margin:0 0 16px;">
                        Dear %s,
                      </h2>
                      <p style="color:#2C2C2C;font-size:16px;line-height:1.7;margin:0 0 16px;">
                        Thank you so much for reaching out to She Can Foundation. We've received your message
                        and a member of our team will be in touch with you within <strong>48 hours</strong>.
                      </p>
                      <p style="color:#2C2C2C;font-size:16px;line-height:1.7;margin:0 0 24px;">
                        Your interest in <strong>%s</strong> means the world to us.
                        Together, we can create lasting change for women across communities.
                      </p>
                      <div style="background:#FDF6F0;border-left:4px solid #E8452A;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:32px;">
                        <p style="margin:0;color:#E8452A;font-style:italic;font-size:17px;font-family:Georgia,serif;">
                          "Every woman deserves the chance to write her own story."
                        </p>
                      </div>
                      <p style="color:#2C2C2C;font-size:16px;line-height:1.7;margin:0 0 8px;">
                        With warmth and gratitude,
                      </p>
                      <p style="color:#E8452A;font-weight:bold;font-size:16px;margin:0;">
                        The She Can Foundation Team 🧡
                      </p>
                    </div>
                    <!-- Footer -->
                    <div style="background:#0D1B2A;padding:24px 32px;text-align:center;">
                      <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0 0 8px;">
                        president@shecanfoundation.org · +91-8283841830
                      </p>
                      <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">
                        © 2025 She Can Foundation · NGO Registered under Indian Society Act, 1860
                      </p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(s.getFullName(), s.getHelpType() != null ? s.getHelpType() : "getting involved");
    }

    private String buildAdminNotificationHtml(Submission s) {
        return """
                <!DOCTYPE html>
                <html>
                <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
                  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <div style="background:#0D1B2A;padding:24px;text-align:center;">
                      <h2 style="color:#E8452A;margin:0;font-size:20px;">New Submission Alert</h2>
                      <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;">She Can Foundation Admin</p>
                    </div>
                    <div style="padding:32px;">
                      <table style="width:100%%;border-collapse:collapse;">
                        <tr style="border-bottom:1px solid #eee;">
                          <td style="padding:12px 16px;font-weight:bold;color:#0D1B2A;width:140px;">Full Name</td>
                          <td style="padding:12px 16px;color:#2C2C2C;">%s</td>
                        </tr>
                        <tr style="border-bottom:1px solid #eee;background:#fafafa;">
                          <td style="padding:12px 16px;font-weight:bold;color:#0D1B2A;">Email</td>
                          <td style="padding:12px 16px;color:#2C2C2C;">%s</td>
                        </tr>
                        <tr style="border-bottom:1px solid #eee;">
                          <td style="padding:12px 16px;font-weight:bold;color:#0D1B2A;">Phone</td>
                          <td style="padding:12px 16px;color:#2C2C2C;">%s</td>
                        </tr>
                        <tr style="border-bottom:1px solid #eee;background:#fafafa;">
                          <td style="padding:12px 16px;font-weight:bold;color:#0D1B2A;">Help Type</td>
                          <td style="padding:12px 16px;"><span style="background:#E8452A;color:#fff;padding:3px 10px;border-radius:20px;font-size:13px;">%s</span></td>
                        </tr>
                        <tr style="border-bottom:1px solid #eee;">
                          <td style="padding:12px 16px;font-weight:bold;color:#0D1B2A;">Message</td>
                          <td style="padding:12px 16px;color:#2C2C2C;line-height:1.6;">%s</td>
                        </tr>
                        <tr style="background:#fafafa;">
                          <td style="padding:12px 16px;font-weight:bold;color:#0D1B2A;">Submitted At</td>
                          <td style="padding:12px 16px;color:#2C2C2C;">%s</td>
                        </tr>
                      </table>
                      <div style="margin-top:24px;text-align:center;">
                        <a href="http://localhost:5173/admin" style="background:#E8452A;color:#fff;padding:12px 32px;border-radius:40px;text-decoration:none;font-weight:bold;font-size:14px;">
                          View in Admin Panel →
                        </a>
                      </div>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(
                s.getFullName(),
                s.getEmail(),
                s.getPhone() != null ? s.getPhone() : "—",
                s.getHelpType() != null ? s.getHelpType() : "—",
                s.getMessage(),
                s.getCreatedAt() != null ? s.getCreatedAt().format(FMT) : "—"
        );
    }
}
