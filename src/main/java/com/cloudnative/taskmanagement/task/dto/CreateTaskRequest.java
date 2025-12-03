package com.cloudnative.taskmanagement.task.dto;

import com.cloudnative.taskmanagement.task.Task.Priority;
import com.cloudnative.taskmanagement.task.Task.Status;

public record CreateTaskRequest(
        String title,
        String description,
        Status status,
        Priority priority,
        Long assigneeId
) {}

