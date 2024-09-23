// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Safe is Ownable {
    IERC20 public voodoo;

    uint256 public constant MIN_STAKE_AMOUNT = 50000 ether;
    uint256 public constant MAX_STAKE_AMOUNT = 200000 ether;
    uint256 public totalValueLocked;
    uint256 public totalSafesUsed = 0;
    uint256 public nextSafeNumber = 1;
    uint256 public constant SECONDS_IN_YEAR = 31536000;

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 unlockTime;
        uint256 duration;
        bool isStaked;
    }

    struct SafeData {
        uint safeNumber;
        address owner;
        uint256 totalStaked;
        uint256 numberOfStakes;
    }

    SafeData[] public safesData;

    // Address to Stake array to handle multiple stakes
    mapping(address => Stake[]) public stakes;
    mapping(address => uint) public userSafeNumber;
    mapping(uint => address) public safeNumberToAddress;

    constructor(address _token) Ownable(msg.sender) {
        voodoo = IERC20(_token);
    }

    function stake(uint256 _amount, uint _unlockTime) external {
        require(
            _unlockTime == 1 || _unlockTime == 5 || _unlockTime == 10,
            "Invalid lock period"
        );
        require(_amount >= MIN_STAKE_AMOUNT, "Amount too low");

        uint256 currentTotal = getTotalStaked(msg.sender);
        require(
            currentTotal + _amount <= MAX_STAKE_AMOUNT,
            "Exceeds maximum stake amount for the safe"
        );

        require(
            voodoo.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );

        uint256 unlockTime = block.timestamp + (_unlockTime * SECONDS_IN_YEAR);

        // Add or update stake
        stakes[msg.sender].push(
            Stake(_amount, block.timestamp, unlockTime, _unlockTime, true)
        );

        totalValueLocked += _amount;

        if (userSafeNumber[msg.sender] == 0) {
            userSafeNumber[msg.sender] = nextSafeNumber;
            safeNumberToAddress[nextSafeNumber] = msg.sender;
            safesData.push(SafeData(nextSafeNumber, msg.sender, _amount, 1));
            nextSafeNumber++;
            totalSafesUsed++;
        } else {
            uint safeIndex = userSafeNumber[msg.sender] - 1; // Adjusting index since array starts at 0
            safesData[safeIndex].totalStaked += _amount;
            safesData[safeIndex].numberOfStakes++;
        }
    }

    function getTotalStaked(address _user) public view returns (uint256) {
        uint256 total = 0;
        for (uint i = 0; i < stakes[_user].length; i++) {
            total += stakes[_user][i].amount;
        }
        return total;
    }

    function unstake(uint _stakeIndex) external {
        require(_stakeIndex < stakes[msg.sender].length, "Invalid stake index");
        Stake storage s = stakes[msg.sender][_stakeIndex];
        require(block.timestamp >= s.unlockTime, "Stake is still locked");
        require(s.isStaked, "Already unstaked");
        uint multiplier;
        if (s.duration == 1) {
            multiplier = 2;
        }
        if (s.duration == 5) {
            multiplier = 3;
        }
        if (s.duration == 10) {
            multiplier = 4;
        }
        uint256 reward = s.amount * multiplier;

        s.isStaked = false;
        totalValueLocked -= s.amount;

        require(
            voodoo.transfer(msg.sender, reward),
            "Failed to return stake and reward"
        );
    }

    function getStakesBySafeNumber(
        uint _safeNumber
    ) public view returns (Stake[] memory) {
        address userAddress = safeNumberToAddress[_safeNumber];
        require(userAddress != address(0), "Safe number does not exist");
        return stakes[userAddress];
    }

    function getSafeData() external view returns (SafeData[] memory) {
        return safesData;
    }
}
