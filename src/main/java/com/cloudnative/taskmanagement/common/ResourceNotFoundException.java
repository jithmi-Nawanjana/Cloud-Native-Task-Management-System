package com.cloudnative.taskmanagement.common;

/**
 * Generic exception for domain entities that cannot be located.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

