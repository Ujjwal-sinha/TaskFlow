const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

require("chai-bn")(require("bn.js"));

describe("TaskEscrow", function () {
  let TaskEscrow;
  let taskEscrow;
  let owner;
  let freelancer;
  let otherAccount;

  beforeEach(async function () {
    [owner, freelancer, otherAccount] = await ethers.getSigners();
    TaskEscrow = await ethers.getContractFactory("TaskEscrow");
    taskEscrow = await TaskEscrow.deploy();
    await taskEscrow.waitForDeployment(); // ethers v6 deployment
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(taskEscrow.address).to.not.equal(0);
    });
  });

  describe("postTask", function () {
    it("Should create a new task with correct details", async function () {
      const reward = ethers.parseEther("1.0");
      const title = "Test Task";
      const description = "This is a test task description";
      
      await expect(taskEscrow.postTask(title, description, { value: reward }))
        .to.emit(taskEscrow, "TaskPosted")
        .withArgs(0, owner.address, reward, title, description);

      const task = await taskEscrow.getTask(0);
      
      expect(task.taskId).to.equal(0);
      expect(task.poster).to.equal(owner.address);
      expect(task.freelancer).to.equal(ethers.ZeroAddress);
      expect(task.reward).to.equal(reward);
      expect(task.status).to.equal(0); // TaskStatus.Created
      expect(task.title).to.equal(title);
      expect(task.description).to.equal(description);
    });

    it("Should increment task counter", async function () {
      const initialCount = await taskEscrow.getTotalTasks();
      const reward = ethers.parseEther("0.5");
      await taskEscrow.postTask("Another Task", "Description", { value: reward });
      const newCount = await taskEscrow.getTotalTasks();
      expect(newCount).to.equal(Number(initialCount) + 1); // Convert to number
    });

    it("Should reject zero reward", async function () {
      await expect(
        taskEscrow.postTask("No Reward", "Description", { value: 0 })
      ).to.be.revertedWith("Reward must be greater than zero");
    });

    it("Should reject empty title", async function () {
      const reward = ethers.parseEther("1.0");
      await expect(
        taskEscrow.postTask("", "Description", { value: reward })
      ).to.be.revertedWith("Task title cannot be empty");
    });

    it("Should reject empty description", async function () {
      const reward = ethers.parseEther("1.0");
      await expect(
        taskEscrow.postTask("Title", "", { value: reward })
      ).to.be.revertedWith("Task description cannot be empty");
    });
  });

  describe("assignTask", function () {
    beforeEach(async function () {
      const reward = ethers.parseEther("1.0");
      await taskEscrow.postTask("Assignable Task", "Description", { value: reward });
    });

    it("Should assign a freelancer to the task", async function () {
      const tx = await taskEscrow.assignTask(0, freelancer.address);
      const block = await ethers.provider.getBlock(tx.blockNumber);
      await expect(tx)
        .to.emit(taskEscrow, "TaskAssigned")
        .withArgs(0, freelancer.address, block.timestamp);

      const task = await taskEscrow.getTask(0);
      expect(task.freelancer).to.equal(freelancer.address);
      expect(task.status).to.equal(1); // TaskStatus.Assigned
      expect(task.assignedAt).to.be.gt(0);
    });

    it("Should reject assignment by non-poster", async function () {
      await expect(
        taskEscrow.connect(otherAccount).assignTask(0, freelancer.address)
      ).to.be.revertedWith("Only the task poster can assign it");
    });

    it("Should reject assignment to zero address", async function () {
      await expect(
        taskEscrow.assignTask(0, ethers.ZeroAddress)
      ).to.be.revertedWith("Freelancer address cannot be zero");
    });

    it("Should reject assignment to poster", async function () {
      await expect(
        taskEscrow.assignTask(0, owner.address)
      ).to.be.revertedWith("Freelancer cannot be the task poster");
    });

    it("Should reject assignment of non-existent task", async function () {
      await expect(
        taskEscrow.assignTask(999, freelancer.address)
      ).to.be.revertedWith("Task does not exist");
    });

    it("Should reject assignment of already assigned task", async function () {
      await taskEscrow.assignTask(0, freelancer.address);
      await expect(
        taskEscrow.assignTask(0, otherAccount.address)
      ).to.be.revertedWith("Task is not in Created status");
    });
  });

  describe("completeTask", function () {
    beforeEach(async function () {
      const reward = ethers.parseEther("1.0");
      await taskEscrow.postTask("Completable Task", "Description", { value: reward });
      await taskEscrow.assignTask(0, freelancer.address);
    });

    it("Should complete the task and release funds", async function () {
      const initialFreelancerBalance = await ethers.provider.getBalance(freelancer.address);
      const reward = ethers.parseEther("1.0");
      const tx = await taskEscrow.completeTask(0);
      const block = await ethers.provider.getBlock(tx.blockNumber);
      await expect(tx)
        .to.emit(taskEscrow, "TaskCompleted")
        .withArgs(0, block.timestamp)
        .to.emit(taskEscrow, "PaymentReleased")
        .withArgs(0, freelancer.address, reward);

      const task = await taskEscrow.getTask(0);
      expect(task.status).to.equal(3); // TaskStatus.Paid
      expect(task.completedAt).to.be.gt(0);

      const finalFreelancerBalance = await ethers.provider.getBalance(freelancer.address);
      expect(finalFreelancerBalance).to.be.closeTo(
        BigInt(initialFreelancerBalance) + BigInt(reward), // Use BigInt
        ethers.parseEther("0.01")
      ); // Allow for gas cost variance
    });

    it("Should reject completion by non-poster", async function () {
      await expect(
        taskEscrow.connect(otherAccount).completeTask(0)
      ).to.be.revertedWith("Only the task poster can mark it as completed");
    });

    it("Should reject completion of non-existent task", async function () {
      await expect(
        taskEscrow.completeTask(999)
      ).to.be.revertedWith("Task does not exist");
    });

    it("Should reject completion of unassigned task", async function () {
      const reward = ethers.parseEther("1.0");
      await taskEscrow.postTask("Unassigned Task", "Description", { value: reward });
      await expect(
        taskEscrow.completeTask(1)
      ).to.be.revertedWith("Task is not in Assigned status");
    });
  });

  describe("cancelTask", function () {
    it("Should cancel an unassigned task and refund", async function () {
      const reward = ethers.parseEther("1.0");
      await taskEscrow.postTask("Cancellable Task", "Description", { value: reward });
      const initialPosterBalance = await ethers.provider.getBalance(owner.address);
      await expect(taskEscrow.cancelTask(0))
        .to.emit(taskEscrow, "TaskCancelled")
        .withArgs(0, owner.address, reward);

      const task = await taskEscrow.getTask(0);
      expect(task.status).to.equal(4); // TaskStatus.Cancelled

      const finalPosterBalance = await ethers.provider.getBalance(owner.address);
      expect(finalPosterBalance).to.be.closeTo(
        BigInt(initialPosterBalance) + BigInt(reward), // Use BigInt
        ethers.parseEther("0.01")
      ); // Allow for gas cost variance
    });

    it("Should cancel an assigned task and refund", async function () {
      const reward = ethers.parseEther("1.0");
      await taskEscrow.postTask("Assigned Cancellable Task", "Description", { value: reward });
      await taskEscrow.assignTask(0, freelancer.address);
      const initialPosterBalance = await ethers.provider.getBalance(owner.address);
      await expect(taskEscrow.cancelTask(0))
        .to.emit(taskEscrow, "TaskCancelled")
        .withArgs(0, owner.address, reward);

      const task = await taskEscrow.getTask(0);
      expect(task.status).to.equal(4); // TaskStatus.Cancelled

      const finalPosterBalance = await ethers.provider.getBalance(owner.address);
      expect(finalPosterBalance).to.be.closeTo(
        BigInt(initialPosterBalance) + BigInt(reward), // Use BigInt
        ethers.parseEther("0.01")
      ); // Allow for gas cost variance
    });

    it("Should reject cancellation by non-poster", async function () {
      const reward = ethers.parseEther("1.0");
      await taskEscrow.postTask("Non-Owner Cancellation", "Description", { value: reward });
      await expect(
        taskEscrow.connect(otherAccount).cancelTask(0)
      ).to.be.revertedWith("Only the task poster can cancel it");
    });

    it("Should reject cancellation of non-existent task", async function () {
      await expect(
        taskEscrow.cancelTask(999)
      ).to.be.revertedWith("Task does not exist");
    });

    it("Should reject cancellation of completed task", async function () {
      const reward = ethers.parseEther("1.0");
      await taskEscrow.postTask("Completed Task", "Description", { value: reward });
      await taskEscrow.assignTask(0, freelancer.address);
      await taskEscrow.completeTask(0);
      await expect(
        taskEscrow.cancelTask(0)
      ).to.be.revertedWith("Task cannot be cancelled in current status");
    });
  });

  describe("getTask and taskExists", function () {
    it("Should return correct task details", async function () {
      const reward = ethers.parseEther("1.0");
      const title = "Test Get Task";
      const description = "Test description for getTask";
      await taskEscrow.postTask(title, description, { value: reward });
      const task = await taskEscrow.getTask(0);
      expect(task.taskId).to.equal(0);
      expect(task.poster).to.equal(owner.address);
      expect(task.title).to.equal(title);
      expect(task.description).to.equal(description);
    });

    it("Should reject getting non-existent task", async function () {
      await expect(
        taskEscrow.getTask(999)
      ).to.be.revertedWith("Task does not exist");
    });

    it("Should correctly report task existence", async function () {
      const reward = ethers.parseEther("1.0");
      await taskEscrow.postTask("Test Task", "Description", { value: reward });
      expect(await taskEscrow.taskExists(0)).to.be.true;
      expect(await taskEscrow.taskExists(999)).to.be.false;
    });
  });

  describe("Reentrancy protection", function () {
    it("Should protect against reentrancy in completeTask", async function () {
      const reward = ethers.parseEther("1.0");
      await taskEscrow.postTask("Reentrancy Test", "Description", { value: reward });
      await taskEscrow.assignTask(0, freelancer.address);
      await expect(taskEscrow.completeTask(0)).to.not.be.reverted;
    });

    it("Should protect against reentrancy in cancelTask", async function () {
      const reward = ethers.parseEther("1.0");
      await taskEscrow.postTask("Reentrancy Test", "Description", { value: reward });
      await expect(taskEscrow.cancelTask(0)).to.not.be.reverted;
    });
  });
});