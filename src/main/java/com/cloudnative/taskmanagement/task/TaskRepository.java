package com.cloudnative.taskmanagement.task;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findByStatus(Task.Status status);

    List<Task> findByPriority(Task.Priority priority);

    List<Task> findByAssignee_Id(Long assigneeId);
}

