package com.cloudnative.taskmanagement.auth.dto;

public record LoginRequest(
        String email,
        String password
) {}

