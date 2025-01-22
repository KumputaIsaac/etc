const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ETCToken", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy the contract before each test
    Token = await ethers.getContractFactory("ETCToken");
    [owner, addr1, addr2] = await ethers.getSigners(); // Get test accounts
    token = await Token.deploy(); // Deploy ETCToken contract
  });

  it("Should deploy with correct initial supply", async function () {
    const totalSupply = await token.totalSupply();
    expect(totalSupply).to.equal(ethers.parseEther("10000"));
  });

  it("Should assign total supply to the owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(await token.totalSupply());
  });

  it("Should mint tokens correctly by the owner", async function () {
    await token.mint(addr1.address, ethers.parseEther("100"));
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseEther("100"));
  });

  it("Should fail if a non-owner tries to mint", async function () {
    await expect(
      token.connect(addr1).mint(addr1.address, ethers.parseEther("100"))
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should burn tokens correctly", async function () {
    await token.connect(owner).burn(ethers.parseEther("100"));
    const ownerBalance = await token.balanceOf(owner.address);
    const totalSupply = await token.totalSupply();
    expect(ownerBalance).to.equal(totalSupply);
  });

  it("Should blacklist an address", async function () {
    await token.blacklistAddress(addr1.address);
    expect(await token.isBlacklisted(addr1.address)).to.be.true;
  });

  it("Should prevent blacklisted addresses from transferring tokens", async function () {
    await token.blacklistAddress(addr1.address);
    await expect(
      token.connect(addr1).transfer(addr2.address, ethers.parseEther("50"))
    ).to.be.revertedWith("Sender is blacklisted");
  });

  it("Should deduct a fee and transfer it to the feeRecipient", async function () {
    await token.setFeeRecipient(addr2.address);
    await token.setFeePercentage(2); // Set 2% fee
    await token.transfer(addr1.address, ethers.parseEther("100"));

    const feeRecipientBalance = await token.balanceOf(addr2.address);
    expect(feeRecipientBalance).to.equal(ethers.parseEther("2"));

    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseEther("98"));
  });

  it("Should allow the owner to pause and unpause transfers", async function () {
    await token.pause();
    await expect(
      token.transfer(addr1.address, ethers.parseEther("50"))
    ).to.be.revertedWith("Token transfers are paused");

    await token.unpause();
    await token.transfer(addr1.address, ethers.parseEther("50"));
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseEther("50"));
  });
});
