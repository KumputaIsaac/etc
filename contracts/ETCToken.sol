// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract ETCToken is ERC20, Ownable, Pausable {
    mapping(address => bool) private _blacklist;

    // Fee-related variables
    address public feeRecipient;
    uint256 public feePercentage = 1; // Fee percentage (1% by default)

    // Events for transparency
    event BlacklistUpdated(address indexed account, bool isBlacklisted);
    event FeeRecipientUpdated(address indexed newRecipient);
    event FeePercentageUpdated(uint256 newPercentage);

    constructor() ERC20("ETC Token", "ETC") {
        // Mint 1 million tokens to the contract deployer's address
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    // Function to mint new tokens, only the owner can call this function
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Function to burn tokens from the caller's address
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    // Pause token transfers
    function pause() public onlyOwner {
        _pause();
    }

    // Unpause token transfers
    function unpause() public onlyOwner {
        _unpause();
    }

    // Add an address to the blacklist
    function blacklistAddress(address account) public onlyOwner {
        _blacklist[account] = true;
        emit BlacklistUpdated(account, true);
    }

    // Remove an address from the blacklist
    function unblacklistAddress(address account) public onlyOwner {
        _blacklist[account] = false;
        emit BlacklistUpdated(account, false);
    }

    // Check if an address is blacklisted
    function isBlacklisted(address account) public view returns (bool) {
        return _blacklist[account];
    }

    // Update the fee recipient address
    function setFeeRecipient(address newRecipient) public onlyOwner {
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }

    // Update the fee percentage
    function setFeePercentage(uint256 newPercentage) public onlyOwner {
        require(newPercentage <= 100, "Fee percentage cannot exceed 100%");
        feePercentage = newPercentage;
        emit FeePercentageUpdated(newPercentage);
    }

    // Override _transfer to include fee deduction and blacklist checks
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(!_blacklist[from], "Sender is blacklisted");
        require(!_blacklist[to], "Recipient is blacklisted");

        uint256 fee = 0;
        if (feeRecipient != address(0) && feePercentage > 0) {
            fee = (amount * feePercentage) / 100;
            super._transfer(from, feeRecipient, fee); // Transfer fee to feeRecipient
        }

        uint256 amountAfterFee = amount - fee;
        super._transfer(from, to, amountAfterFee); // Transfer remaining amount
    }

    // Hook to enforce paused state
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "Token transfers are paused");
    }
}
