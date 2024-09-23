// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Voodoo is ERC20 {
    constructor()
        ERC20("Voodoo", "VD")
    {
        mint(msg.sender, 100000000000 ether);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}