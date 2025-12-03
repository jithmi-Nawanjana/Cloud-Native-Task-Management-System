package com.cloudnative.taskmanagement.task;

import static com.cloudnative.taskmanagement.task.TaskSpecifications.hasAssignee;
import static com.cloudnative.taskmanagement.task.TaskSpecifications.hasPriority;
import static com.cloudnative.taskmanagement.task.TaskSpecifications.hasStatus;

import com.cloudnative.taskmanagement.common.ResourceNotFoundException;
import com.cloudnative.taskmanagement.task.Task.Priority;
import com.cloudnative.taskmanagement.task.Task.Status;
import com.cloudnative.taskmanagement.task.dto.CreateTaskRequest;
import com.cloudnative.taskmanagement.task.dto.TaskFilter;
import com.cloudnative.taskmanagement.task.dto.UpdateTaskRequest;
import com.cloudnative.taskmanagement.user.User;
import com.cloudnative.taskmanagement.user.UserRepository;
import java.util.List;
import java.util.Objects;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Task createTask(CreateTaskRequest request) {
        Task task = new Task(
                Objects.requireNonNull(request.title(), "title is required"),
                request.description(),
                request.status(),
                request.priority(),
                resolveAssignee(request.assigneeId())
        );
        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Task getTask(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task %d not found".formatted(taskId)));
    }

    @Transactional(readOnly = true)
    public List<Task> listTasks() {
        return taskRepository.findAll();
    }

    @Transactional
    public Task updateTask(Long taskId, UpdateTaskRequest request) {
        Task task = getTask(taskId);

        if (request.title() != null) {
            task.setTitle(request.title());
        }
        if (request.description() != null) {
            task.setDescription(request.description());
        }
        if (request.status() != null) {
            task.setStatus(request.status());
        }
        if (request.priority() != null) {
            task.setPriority(request.priority());
        }
        if (request.assigneeId() != null) {
            task.setAssignee(resolveAssignee(request.assigneeId()));
        }

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task task = getTask(taskId);
        taskRepository.delete(task);
    }

    @Transactional
    public Task assignTask(Long taskId, Long userId) {
        Task task = getTask(taskId);
        User assignee = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User %d not found".formatted(userId)));
        task.setAssignee(assignee);
        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public List<Task> searchTasks(TaskFilter filter) {
        Specification<Task> spec = Specification.where(null);

        if (filter != null) {
            if (filter.statusOptional().isPresent()) {
                Status status = filter.statusOptional().get();
                spec = combine(spec, hasStatus(status));
            }
            if (filter.priorityOptional().isPresent()) {
                Priority priority = filter.priorityOptional().get();
                spec = combine(spec, hasPriority(priority));
            }
            if (filter.assigneeIdOptional().isPresent()) {
                Long assigneeId = filter.assigneeIdOptional().get();
                spec = combine(spec, hasAssignee(assigneeId));
            }
        }

        return spec == null ? taskRepository.findAll() : taskRepository.findAll(spec);
    }

    private User resolveAssignee(Long assigneeId) {
        if (assigneeId == null) {
            return null;
        }
        return userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User %d not found".formatted(assigneeId)));
    }

    private Specification<Task> combine(Specification<Task> base, Specification<Task> addition) {
        if (addition == null) {
            return base;
        }
        return base == null ? Specification.where(addition) : base.and(addition);
    }
}

