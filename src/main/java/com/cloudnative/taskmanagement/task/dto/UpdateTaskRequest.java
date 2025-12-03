package com.cloudnative.taskmanagement.task.dto;

import com.cloudnative.taskmanagement.task.Task.Priority;
import com.cloudnative.taskmanagement.task.Task.Status;

public record UpdateTaskRequest(
        String title,
        String description,
        Status status,
        Priority priority,
        Long assigneeId
) {}

