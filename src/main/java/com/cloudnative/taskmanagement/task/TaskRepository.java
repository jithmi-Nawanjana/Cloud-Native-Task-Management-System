package com.cloudnative.taskmanagement.task;

import com.cloudnative.taskmanagement.task.Task.Priority;
import com.cloudnative.taskmanagement.task.Task.Status;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssigneeId(Long assigneeId);

    List<Task> findByStatus(Status status);

    List<Task> findByPriority(Priority priority);
}

