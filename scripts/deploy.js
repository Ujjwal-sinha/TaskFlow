const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TaskEscrow = await ethers.getContractFactory("TaskEscrow");
  const taskEscrow = await TaskEscrow.deploy();

  console.log("TaskEscrow deployed to:", taskEscrow.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });