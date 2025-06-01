// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TaskEscrow is ReentrancyGuard {

    // Enum to represent the status of a task
    enum TaskStatus {
        Created,
        Completed,
        Paid,
        Cancelled
    }

    // Struct to define a Task
    struct Task {
        uint256 taskId;       // Unique identifier for the task
        address poster;       // Address of the task creator
        address freelancer;   // Address of the assigned freelancer
        uint256 reward;       // Amount of XDC tokens to be paid as reward
        TaskStatus status;    // Current status of the task
        uint256 createdAt;    // Timestamp when the task was created
        uint256 completedAt;  // Timestamp when the task was marked as completed
    }

    // Mapping to store tasks by their taskId
    mapping(uint256 => Task) public tasks;
    // Counter for generating unique task IDs
    uint256 private _nextTaskId;

    // Events to log important actions
    event TaskPosted(uint256 indexed taskId, address indexed poster, address indexed freelancer, uint256 reward);
    event TaskCompleted(uint256 indexed taskId, uint256 timestamp);
    event PaymentReleased(uint256 indexed taskId, address indexed freelancer, uint256 amount);
    event TaskCancelled(uint256 indexed taskId, address indexed poster, address indexed freelancer, uint256 reward);

    /**
     * @dev Constructor is not needed as there are no initial state variables to set.
     */

    /**
     * @dev Creates a new task and locks the reward.
     * @param _freelancer The address of the freelancer assigned to the task.
     * @return The taskId of the newly created task.
     */
    function postTask(address _freelancer) public payable returns (uint256) {
        // Ensure that a reward amount is sent with the transaction
        require(msg.value > 0, "Reward must be greater than zero");
        // Ensure that the freelancer address is not the zero address
        require(_freelancer != address(0), "Freelancer address cannot be zero");
        // Ensure the freelancer is not the poster themselves
        require(_freelancer != msg.sender, "Freelancer cannot be the task poster");

        // Increment task ID counter and assign to new task
        uint256 currentTaskId = _nextTaskId++;

        // Create a new Task struct and store it
        tasks[currentTaskId] = Task({
            taskId: currentTaskId,
            poster: msg.sender,
            freelancer: _freelancer,
            reward: msg.value,
            status: TaskStatus.Created,
            createdAt: block.timestamp,
            completedAt: 0 // Will be set when the task is completed
        });

        // Emit TaskPosted event
        emit TaskPosted(currentTaskId, msg.sender, _freelancer, msg.value);

        return currentTaskId;
    }

    /**
     * @dev Marks a task as completed and releases funds to the freelancer.
     *      Only the task poster can call this function.
     *      Uses ReentrancyGuard to prevent reentrant attacks.
     * @param _taskId The ID of the task to be completed.
     */
    function completeTask(uint256 _taskId) public nonReentrant {
        // Retrieve the task from storage
        Task storage task = tasks[_taskId];

        // Ensure the task exists
        require(task.taskId == _taskId, "Task does not exist");
        // Ensure only the poster can mark the task as completed
        require(task.poster == msg.sender, "Only the task poster can mark it as completed");
        // Ensure the task is in 'Created' status before completion
        require(task.status == TaskStatus.Created, "Task is not in 'Created' status");

        // Update task status and set completion timestamp
        task.status = TaskStatus.Completed;
        task.completedAt = block.timestamp;

        // Transfer the reward to the freelancer
        // Using call instead of transfer/send for better gas forwarding and error handling
        (bool success, ) = task.freelancer.call{value: task.reward}("");
        require(success, "Failed to transfer reward to freelancer");

        // Update task status to 'Paid' after successful transfer
        task.status = TaskStatus.Paid;

        // Emit TaskCompleted and PaymentReleased events
        emit TaskCompleted(_taskId, block.timestamp);
        emit PaymentReleased(_taskId, task.freelancer, task.reward);
    }

    /**
     * @dev Fetches the details of a specific task.
     * @param _taskId The ID of the task to fetch.
     * @return taskId The unique identifier for the task.
     * @return poster The address of the task creator.
     * @return freelancer The address of the assigned freelancer.
     * @return reward The amount of XDC tokens for the task.
     * @return status The current status of the task.
     * @return createdAt The timestamp when the task was created.
     * @return completedAt The timestamp when the task was marked as completed.
     */
    /**
     * @dev Allows the task poster to cancel a task and refund the reward.
     *      Only the task poster can call this function.
     *      Uses ReentrancyGuard to prevent reentrant attacks.
     * @param _taskId The ID of the task to be cancelled.
     */
    function cancelTask(uint256 _taskId) public nonReentrant {
        // Retrieve the task from storage
        Task storage task = tasks[_taskId];

        // Ensure the task exists
        require(task.taskId == _taskId, "Task does not exist");
        // Ensure only the poster can cancel the task
        require(task.poster == msg.sender, "Only the task poster can cancel it");
        // Ensure the task is in 'Created' status before cancellation
        require(task.status == TaskStatus.Created, "Task is not in 'Created' status");

        // Update task status
        task.status = TaskStatus.Cancelled;

        // Refund the reward to the poster
        (bool success, ) = task.poster.call{value: task.reward}("");
        require(success, "Failed to refund reward to poster");

        // Emit TaskCancelled event
        emit TaskCancelled(_taskId, task.poster, task.freelancer, task.reward);
    }

    /**
     * @dev Fetches the details of a specific task.
     * @param _taskId The ID of the task to fetch.
     * @return taskId The unique identifier for the task.
     * @return poster The address of the task creator.
     * @return freelancer The address of the assigned freelancer.
     * @return reward The amount of XDC tokens for the task.
     * @return status The current status of the task.
     * @return createdAt The timestamp when the task was created.
     * @return completedAt The timestamp when the task was marked as completed.
     */
    function getTask(uint256 _taskId) public view returns (
        uint256 taskId,
        address poster,
        address freelancer,
        uint256 reward,
        TaskStatus status,
        uint256 createdAt,
        uint256 completedAt
    ) {
        // Retrieve the task from storage
        Task storage task = tasks[_taskId];

        // Ensure the task exists
        require(task.taskId == _taskId, "Task does not exist");

        // Return all task details
        return (
            task.taskId,
            task.poster,
            task.freelancer,
            task.reward,
            task.status,
            task.createdAt,
            task.completedAt
        );
    }
}