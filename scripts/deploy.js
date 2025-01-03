const hre = require("hardhat");

async function main() {
  const ETCToken = await hre.ethers.getContractFactory("ETCToken");
  const etcToken = await ETCToken.deploy();

  await etcToken.deployed();

  console.log(`ETCToken deployed to: ${etcToken.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
