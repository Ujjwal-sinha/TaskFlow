// 1. Import required libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

// 2. Define test suite
describe("TaskEscrow Contract", function () {
  // 3. Declare contract and signer variables
  let TaskEscrow;
  let taskEscrow;
  let poster, freelancer, other;

  // 4. Set reward amount as a BigInt
  const REWARD_AMOUNT = ethers.parseEther("1.0");

  // 5. Define TaskStatus as BigInts for comparison
  const TaskStatus = {
    Created: 0n,
    Completed: 1n,
    Paid: 2n,
    Cancelled: 3n,
  };

  // 6. Before each test, deploy contract and get signers
  beforeEach(async function () {
    [poster, freelancer, other] = await ethers.getSigners();
    TaskEscrow = await ethers.getContractFactory("TaskEscrow");
    taskEscrow = await TaskEscrow.deploy();
    await taskEscrow.waitForDeployment();
  });

  // 7. Test 'postTask' function
  describe("postTask", function () {
    it("should create a task with valid parameters", async function () {
      const tx = await taskEscrow
        .connect(poster)
        .postTask(freelancer.address, { value: REWARD_AMOUNT });
      const task = await taskEscrow.getTask(0);
      expect(task.taskId).to.equal(0n);
      expect(task.poster).to.equal(poster.address);
      expect(task.freelancer).to.equal(freelancer.address);
      expect(task.reward).to.equal(REWARD_AMOUNT);
      expect(task.status).to.equal(TaskStatus.Created);
      expect(task.createdAt).to.be.a('bigint').and.to.be.gt(0n);
      expect(task.completedAt).to.equal(0n);
      await expect(tx)
        .to.emit(taskEscrow, "TaskPosted")
        .withArgs(0n, poster.address, freelancer.address, REWARD_AMOUNT);
    });

    it("should revert if reward is zero", async function () {
      await expect(
        taskEscrow.connect(poster).postTask(freelancer.address, { value: 0 })
      ).to.be.revertedWith("Reward must be greater than zero");
    });

    it("should revert if freelancer address is zero", async function () {
      await expect(
        taskEscrow.connect(poster).postTask(ethers.ZeroAddress, {
          value: REWARD_AMOUNT,
        })
      ).to.be.revertedWith("Freelancer address cannot be zero");
    });

    it("should revert if freelancer is the poster", async function () {
      await expect(
        taskEscrow.connect(poster).postTask(poster.address, {
          value: REWARD_AMOUNT,
        })
      ).to.be.revertedWith("Freelancer cannot be the task poster");
    });
  });

  // 8. Test 'completeTask' function
  describe("completeTask", function () {
    beforeEach(async function () {
      await taskEscrow
        .connect(poster)
        .postTask(freelancer.address, { value: REWARD_AMOUNT });
    });

    it("should complete a task and release payment", async function () {
      const freelancerInitialBalance = await ethers.provider.getBalance(
        freelancer.address
      );
      const tx = await taskEscrow.connect(poster).completeTask(0);
      const task = await taskEscrow.getTask(0);
      expect(task.status).to.equal(TaskStatus.Paid);
      expect(task.completedAt).to.be.a('bigint').and.to.be.gt(0n);
      const freelancerFinalBalance = await ethers.provider.getBalance(
        freelancer.address
      );
      expect(freelancerFinalBalance).to.be.closeTo(
        freelancerInitialBalance + REWARD_AMOUNT,
        ethers.parseEther("0.01")
      );
      await expect(tx)
        .to.emit(taskEscrow, "TaskCompleted")
        .withArgs(0n, task.completedAt);
      await expect(tx)
        .to.emit(taskEscrow, "PaymentReleased")
        .withArgs(0n, freelancer.address, REWARD_AMOUNT);
    });

    it("should revert if task does not exist", async function () {
      await expect(
        taskEscrow.connect(poster).completeTask(999)
      ).to.be.revertedWith("Task does not exist");
    });

    it("should revert if called by non-poster", async function () {
      await expect(
        taskEscrow.connect(other).completeTask(0)
      ).to.be.revertedWith("Only the task poster can mark it as completed");
    });

    it("should revert if task is not in Created status", async function () {
      await taskEscrow.connect(poster).completeTask(0);
      await expect(
        taskEscrow.connect(poster).completeTask(0)
      ).to.be.revertedWith("Task is not in 'Created' status");
    });
  });

  // 9. Test 'cancelTask' function
  describe("cancelTask", function () {
    beforeEach(async function () {
      await taskEscrow
        .connect(poster)
        .postTask(freelancer.address, { value: REWARD_AMOUNT });
    });

    it("should cancel a task and refund the poster", async function () {
      const posterInitialBalance = await ethers.provider.getBalance(poster.address);
      const tx = await taskEscrow.connect(poster).cancelTask(0);
      const task = await taskEscrow.getTask(0);
      expect(task.status).to.equal(TaskStatus.Cancelled);
      const posterFinalBalance = await ethers.provider.getBalance(poster.address);
      expect(posterFinalBalance).to.be.closeTo(
        posterInitialBalance + REWARD_AMOUNT,
        ethers.parseEther("0.01")
      );
      await expect(tx)
        .to.emit(taskEscrow, "TaskCancelled")
        .withArgs(0n, poster.address, freelancer.address, REWARD_AMOUNT);
    });

    it("should revert if task does not exist", async function () {
      await expect(
        taskEscrow.connect(poster).cancelTask(999)
      ).to.be.revertedWith("Task does not exist");
    });

    it("should revert if called by non-poster", async function () {
      await expect(
        taskEscrow.connect(other).cancelTask(0)
      ).to.be.revertedWith("Only the task poster can cancel it");
    });

    it("should revert if task is not in Created status", async function () {
      await taskEscrow.connect(poster).completeTask(0);
      await expect(
        taskEscrow.connect(poster).cancelTask(0)
      ).to.be.revertedWith("Task is not in 'Created' status");
    });
  });

  // 10. Test 'getTask' function
  describe("getTask", function () {
    beforeEach(async function () {
      await taskEscrow
        .connect(poster)
        .postTask(freelancer.address, { value: REWARD_AMOUNT });
    });

    it("should fetch task details correctly", async function () {
      const task = await taskEscrow.getTask(0);
      expect(task.taskId).to.equal(0n);
      expect(task.poster).to.equal(poster.address);
      expect(task.freelancer).to.equal(freelancer.address);
      expect(task.reward).to.equal(REWARD_AMOUNT);
      expect(task.status).to.equal(TaskStatus.Created);
      expect(task.createdAt).to.be.a('bigint').and.to.be.gt(0n);
      expect(task.completedAt).to.equal(0n);
    });

    it("should revert if task does not exist", async function () {
      await expect(taskEscrow.getTask(999)).to.be.revertedWith(
        "Task does not exist"
      );
    });
  });
});
