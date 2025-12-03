// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @custom:security-contact security@kushalx.com
contract KaushalToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    // Initial Supply: 2 Billion Tokens
    // 1 Billion for Owner (Genesis Account)
    // 1 Billion for Public/Airdrop/Rewards
    uint256 public constant INITIAL_SUPPLY = 2_000_000_000 * 10**18;

    constructor(address initialOwner)
        ERC20("Kaushal Crypto", "KSHL")
        Ownable(initialOwner)
        ERC20Permit("Kaushal Crypto")
    {
        // Mint the total supply to the owner initially
        // The owner will then distribute the 1B public allocation as needed
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
