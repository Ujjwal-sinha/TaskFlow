// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TaskEscrow is ReentrancyGuard {

    // Enum to represent the status of a task
    enum TaskStatus {
        Created,
        Assigned,
        Completed,
        Paid,
        Cancelled
    }

    // Struct to define a Task
    struct Task {
        uint256 taskId;
        address poster;
        address freelancer;
        uint256 reward;
        TaskStatus status;
        uint256 createdAt;
        uint256 assignedAt;
        uint256 completedAt;
        string title;
        string description;
    }

    // State variables
    mapping(uint256 => Task) public tasks;
    uint256 private _nextTaskId;

    // Events
    event TaskPosted(uint256 indexed taskId, address indexed poster, uint256 reward, string title, string description);
    event TaskAssigned(uint256 indexed taskId, address indexed freelancer, uint256 timestamp);
    event TaskCompleted(uint256 indexed taskId, uint256 timestamp);
    event PaymentReleased(uint256 indexed taskId, address indexed freelancer, uint256 amount);
    event TaskCancelled(uint256 indexed taskId, address indexed poster, uint256 reward);

    /**
     * @dev Creates a new task and locks the reward without assigning a freelancer.
     * @param _title The title of the task.
     * @param _description The description of the task.
     * @return The taskId of the newly created task.
     */
    function postTask(string memory _title, string memory _description) public payable returns (uint256) {
        require(msg.value > 0, "Reward must be greater than zero");
        require(bytes(_title).length > 0, "Task title cannot be empty");
        require(bytes(_description).length > 0, "Task description cannot be empty");

        uint256 currentTaskId = _nextTaskId;
        _nextTaskId++;

        Task storage newTask = tasks[currentTaskId];
        newTask.taskId = currentTaskId;
        newTask.poster = msg.sender;
        newTask.freelancer = address(0);
        newTask.reward = msg.value;
        newTask.status = TaskStatus.Created;
        newTask.createdAt = block.timestamp;
        newTask.assignedAt = 0;
        newTask.completedAt = 0;
        newTask.title = _title;
        newTask.description = _description;

        emit TaskPosted(currentTaskId, msg.sender, msg.value, _title, _description);

        return currentTaskId;
    }

    /**
     * @dev Assigns a freelancer to an existing task.
     * @param _taskId The ID of the task to assign.
     * @param _freelancer The address of the freelancer to assign.
     */
    function assignTask(uint256 _taskId, address _freelancer) public {
        Task storage task = tasks[_taskId];

        require(task.taskId == _taskId, "Task does not exist");
        require(task.poster == msg.sender, "Only the task poster can assign it");
        require(task.status == TaskStatus.Created, "Task is not in Created status");
        require(_freelancer != address(0), "Freelancer address cannot be zero");
        require(_freelancer != msg.sender, "Freelancer cannot be the task poster");

        task.freelancer = _freelancer;
        task.status = TaskStatus.Assigned;
        task.assignedAt = block.timestamp;

        emit TaskAssigned(_taskId, _freelancer, block.timestamp);
    }

    /**
     * @dev Marks a task as completed and releases funds to the freelancer.
     * @param _taskId The ID of the task to be completed.
     */
    function completeTask(uint256 _taskId) public nonReentrant {
        Task storage task = tasks[_taskId];

        require(task.taskId == _taskId, "Task does not exist");
        require(task.poster == msg.sender, "Only the task poster can mark it as completed");
        require(task.status == TaskStatus.Assigned, "Task is not in Assigned status");
        require(task.freelancer != address(0), "No freelancer assigned to this task");

        task.status = TaskStatus.Completed;
        task.completedAt = block.timestamp;

        (bool success, ) = task.freelancer.call{value: task.reward}("");
        require(success, "Failed to transfer reward to freelancer");

        task.status = TaskStatus.Paid;

        emit TaskCompleted(_taskId, block.timestamp);
        emit PaymentReleased(_taskId, task.freelancer, task.reward);
    }

    /**
     * @dev Allows the task poster to cancel a task and refund the reward.
     * @param _taskId The ID of the task to be cancelled.
     */
    function cancelTask(uint256 _taskId) public nonReentrant {
        Task storage task = tasks[_taskId];

        require(task.taskId == _taskId, "Task does not exist");
        require(task.poster == msg.sender, "Only the task poster can cancel it");
        require(
            task.status == TaskStatus.Created || task.status == TaskStatus.Assigned, 
            "Task cannot be cancelled in current status"
        );

        task.status = TaskStatus.Cancelled;

        (bool success, ) = task.poster.call{value: task.reward}("");
        require(success, "Failed to refund reward to poster");

        emit TaskCancelled(_taskId, task.poster, task.reward);
    }

    /**
     * @dev Fetches the details of a specific task.
     * @param _taskId The ID of the task to fetch.
     */
    function getTask(uint256 _taskId) public view returns (
        uint256 taskId,
        address poster,
        address freelancer,
        uint256 reward,
        TaskStatus status,
        uint256 createdAt,
        uint256 assignedAt,
        uint256 completedAt,
        string memory title,
        string memory description
    ) {
        Task storage task = tasks[_taskId];
        require(task.taskId == _taskId, "Task does not exist");

        return (
            task.taskId,
            task.poster,
            task.freelancer,
            task.reward,
            task.status,
            task.createdAt,
            task.assignedAt,
            task.completedAt,
            task.title,
            task.description
        );
    }

    /**
     * @dev Gets the total number of tasks created.
     */
    function getTotalTasks() public view returns (uint256) {
        return _nextTaskId;
    }

    /**
     * @dev Helper function to check if a task exists.
     */
    function taskExists(uint256 _taskId) public view returns (bool) {
        return _taskId < _nextTaskId;
    }
}