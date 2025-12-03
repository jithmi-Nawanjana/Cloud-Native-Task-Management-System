package com.cloudnative.taskmanagement.task.dto;

import com.cloudnative.taskmanagement.task.Task.Priority;
import com.cloudnative.taskmanagement.task.Task.Status;
import java.util.Optional;

public record TaskFilter(
        Status status,
        Priority priority,
        Long assigneeId
) {

    public Optional<Status> statusOptional() {
        return Optional.ofNullable(status);
    }

    public Optional<Priority> priorityOptional() {
        return Optional.ofNullable(priority);
    }

    public Optional<Long> assigneeIdOptional() {
        return Optional.ofNullable(assigneeId);
    }
}

