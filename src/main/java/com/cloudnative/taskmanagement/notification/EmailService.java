package com.cloudnative.taskmanagement.notification;

import com.cloudnative.taskmanagement.task.Task;
import com.cloudnative.taskmanagement.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public EmailService(JavaMailSender mailSender, @Value("${app.mail.from}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendTaskAssignmentEmail(Task task, User assignee) {
        if (!canSendTo(assignee)) {
            return;
        }
        String subject = "Task assigned: " + task.getTitle();
        String body = """
                Hi %s,

                You have been assigned to task "%s".
                Status: %s
                Priority: %s

                Description:
                %s

                Please sign in to the Task Management app for more details.
                """.formatted(
                assignee.getName(),
                task.getTitle(),
                task.getStatus(),
                task.getPriority(),
                safeDescription(task.getDescription())
        );
        send(assignee.getEmail(), subject, body);
    }

    public void sendTaskStatusChangedEmail(Task task, Task.Status previousStatus) {
        User owner = task.getOwner();
        User assignee = task.getAssignee();

        if (!canSendTo(owner) && !canSendTo(assignee)) {
            return;
        }

        String subject = "Task status updated: " + task.getTitle();
        String body = """
                Task "%s" status changed from %s to %s.

                Priority: %s
                Assignee: %s

                Description:
                %s
                """.formatted(
                task.getTitle(),
                previousStatus,
                task.getStatus(),
                task.getPriority(),
                assignee != null ? assignee.getName() : "Unassigned",
                safeDescription(task.getDescription())
        );

        if (canSendTo(owner)) {
            send(owner.getEmail(), subject, body);
        }
        if (canSendTo(assignee) && !sameEmail(owner, assignee)) {
            send(assignee.getEmail(), subject, body);
        }
    }

    private void send(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (MailException ex) {
            log.warn("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }

    private boolean canSendTo(User user) {
        return user != null && StringUtils.hasText(user.getEmail());
    }

    private boolean sameEmail(User first, User second) {
        if (first == null || second == null) {
            return false;
        }
        return StringUtils.hasText(first.getEmail())
                && first.getEmail().equalsIgnoreCase(second.getEmail());
    }

    private String safeDescription(String description) {
        return StringUtils.hasText(description) ? description : "No description provided.";
    }
}

