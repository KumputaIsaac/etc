const hre = require("hardhat");

async function main() {
  // Retrieve the deployer's wallet
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  // Fetch and log the deployer's balance
  const provider = hre.ethers.provider;
  const balance = await provider.getBalance(deployer.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} ETH`);

  // Dzeploy the contract

  const ETCToken = await hre.ethers.getContractFactory("ETCToken");

  const etcToken = await ETCToken.deploy({
    gasLimit: 10_000_000, // Adjust as necessary
  });

  console.log("3");
  await etcToken.waitForDeployment(); // Updated method to wait for deployment

  console.log("ETCToken deployed to:", etcToken.target);

  // ETCToken deployed to: 0xe66ddF651ef940C5fFAf274403002ae95B648605
}

// Run the deployment script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
