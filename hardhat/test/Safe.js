const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Safe Contract", function () {
    let voodooToken, safe;
    let owner, user1, user2;

    // Utility function to forward time in Hardhat Network
    const increaseTime = async (seconds) => {
        await ethers.provider.send("evm_increaseTime", [seconds]);
        await ethers.provider.send("evm_mine");
    };

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy VoodooToken and Safe contracts
        const VoodooToken = await ethers.getContractFactory("Voodoo");
        voodooToken = await VoodooToken.deploy();

        const Safe = await ethers.getContractFactory("Safe");
        safe = await Safe.deploy(voodooToken.target);

        // Setup fundAmount in contract
        const fundAmount = ethers.parseEther("5000000");
        const safeAmount = ethers.parseEther("100000000");
        await voodooToken.transfer(user1.address, fundAmount);
        await voodooToken.transfer(safe.target, safeAmount);

    });

    describe("Staking", function () {
        it("Should allow users to stake tokens and reflect in contract state", async function () {
            const stakeAmount = ethers.parseEther("50000");

            await voodooToken.connect(user1).approve(safe.target, stakeAmount);

            // Stake tokens
            await safe.connect(user1).stake(stakeAmount, 1);

            // Verify the stake was successful
            const userSafeNumber = await safe.userSafeNumber(user1.address);
            expect(userSafeNumber).to.be.gt(0, "User should have a safe number assigned.");

            const safeData = await safe.safesData(Number(userSafeNumber) - 1);
            expect(safeData.totalStaked).to.equal(stakeAmount);
            expect(safeData.numberOfStakes).to.equal(1);
        });
    });

    describe("Unstaking", function () {
        it("Should allow users to unstake tokens after the lock period and reflect in contract state", async function () {
            const stakeAmount = ethers.parseEther("50000");
            await voodooToken.connect(user1).mint(user1.address, stakeAmount);

            await voodooToken.connect(user1).approve(safe.target, stakeAmount);
            await safe.connect(user1).stake(stakeAmount, 1);

            // Increase time beyond the lock period
            await increaseTime(31536000 + 1);

            // Unstake tokens
            await safe.connect(user1).unstake(0);

            // Verify the unstake was successful
            const userStakes = await safe.getStakesBySafeNumber(await safe.userSafeNumber(user1.address));
            expect(userStakes[0].isStaked).to.equal(false);

            // Check user balance to confirm return of stake plus reward
            const finalBalance = await voodooToken.balanceOf(user1.address);
            expect(finalBalance).to.be.gt(stakeAmount, "User should have more tokens after unstaking due to rewards.");
        });
    });

    describe("Invalid Stakes", function () {
        it("Should reject staking below the minimum amount", async function () {
            const tooSmallStake = ethers.parseEther("100"); // Assuming 100 is below the minimum stake amount
            await voodooToken.connect(user1).approve(safe.target, tooSmallStake);
            await expect(safe.connect(user1).stake(tooSmallStake, 1)).to.be.revertedWith("Amount too low");
        });

        it("Should reject staking above the maximum amount", async function () {
            const tooLargeStake = ethers.parseEther("300000"); // Assuming 300000 is above the maximum stake amount
            await voodooToken.connect(user1).approve(safe.target, tooLargeStake);
            await expect(safe.connect(user1).stake(tooLargeStake, 1)).to.be.revertedWith("Exceeds maximum stake amount for the safe");
        });

        it("Multiple stakes overflowing safe", async function () {
            const stake1 = ethers.parseEther("100000");
            await voodooToken.connect(user1).approve(safe.target, stake1);
            await safe.connect(user1).stake(stake1, 1)

            const stake2 = ethers.parseEther("50000");
            await voodooToken.connect(user1).approve(safe.target, stake2);
            await safe.connect(user1).stake(stake2, 10)


            const stake3 = ethers.parseEther("60000"); // Assuming 210000 is above the maximum stake amount
            await voodooToken.connect(user1).approve(safe.target, stake3);
            await expect(safe.connect(user1).stake(stake3, 5)).to.be.revertedWith("Exceeds maximum stake amount for the safe");
        });
    });

    describe("Early Unstaking", function () {
        it("Should prevent unstaking before the lock period expires", async function () {
            const stakeAmount = ethers.parseEther("50000");
            await voodooToken.connect(user1).approve(safe.target, stakeAmount);
            await safe.connect(user1).stake(stakeAmount, 1); // 1-year lock period

            // Attempt to unstake before time has passed
            await expect(safe.connect(user1).unstake(0)).to.be.revertedWith("Stake is still locked");
        });
    });


    describe("Reward Calculation", function () {
        it("Should correctly calculate rewards based on stake duration", async function () {
            const stakeAmount = ethers.parseEther("50000");
            await voodooToken.connect(user1).approve(safe.target, stakeAmount);

            // Stake with a known duration
            await safe.connect(user1).stake(stakeAmount, 1); // 1-year lock period
            await increaseTime(31536000 + 1); // Fast-forward time

            const initialBalance = await voodooToken.balanceOf(user1.address);
            await safe.connect(user1).unstake(0);
            const finalBalance = await voodooToken.balanceOf(user1.address);
            const expectedReward = stakeAmount * 2; // Adjust according to your contract logic
            expect(finalBalance - initialBalance).to.equal(expectedReward);
        });
    });

});
