import { ethers } from 'ethers';
import ERC20 from "./ERC20.json" assert { type: 'json' };
import Safe from "./Safe.json" assert { type: 'json' };

// let provider = new ethers.JsonRpcProvider("https://rpc.pulsechain.com"); // MAINNET
let provider = new ethers.providers.JsonRpcProvider("https://polygon-testnet.public.blastapi.io"); // TESTNET

// TestNet Addresses
const VDOTokenAddress = "0x5ABB9c83E367B5B103c0c37e99ABDa518B34BdAE";
const SafeAddress = "0xff618bC00C955c74b4e998A9730505fc573698e0";


async function checkAndApprove(signer, amountInWei) {
    const voodoo = new ethers.Contract(VDOTokenAddress, ERC20.abi, signer);
    let address = await signer.getAddress();
    // console.log("ADDRESS ===== ", address)
    // console.log("amountInWei ===== ", amountInWei)

    const currentAllowance = await voodoo.allowance(address, SafeAddress);
    // Check if the current allowance is less than the amount intended to bet
    console.log("Allowance", currentAllowance)
    if (currentAllowance.lt(amountInWei)) {
        try {
            const tx = await voodoo.approve(SafeAddress, amountInWei);
            await tx.wait();
            console.log(`Approval transaction hash: ${tx.hash}`);
        } catch (error) {
            console.error("Approval failed:", error);
        }
    } else {
        console.log("Sufficient allowance exists. No need for new approval.");
    }
}

export async function balanceOf(signer) {
    const voodoo = new ethers.Contract(VDOTokenAddress, ERC20.abi, signer);
    const address = await signer.getAddress();
    const balanceWei = await voodoo.balanceOf(address);
    const balanceEther = ethers.formatEther(balanceWei);
    return balanceEther;
}


export async function stake(signer, amount, duration) {
    console.log(duration)
    const amountInWei = ethers.utils.parseEther(amount)
    await checkAndApprove(signer, amountInWei);
    const safe = new ethers.Contract(SafeAddress, Safe.abi, signer);
    try {
        const txResponse = await safe.stake(amountInWei, duration);
        const txReceipt = await txResponse.wait(); // Wait for the transaction to be mined
        console.log(txReceipt)
    } catch (error) {
        console.error("Stake failed:", error);
    }
}

export async function unstake(signer, stakeIndex) {
    const safe = new ethers.Contract(SafeAddress, Safe.abi, signer);
    try {
        const txResponse = await safe.unstake(stakeIndex);
        const txReceipt = await txResponse.wait(); // Wait for the transaction to be mined
        console.log(txReceipt)
    } catch (error) {
        console.error("unStake failed:", error);
    }
}

export async function getTotalValueLocked() {
    const safe = new ethers.Contract(SafeAddress, Safe.abi, provider);
    try {
        const totalValueLockedWei = await safe.totalValueLocked();
        const totalValueLockedEther = ethers.utils.formatEther(totalValueLockedWei);
        // console.log(`Total Value Locked: ${totalValueLockedEther} ETH`);
        return totalValueLockedEther;
    } catch (error) {
        console.error("Failed to get total value locked:", error);
    }
}

export async function getSafeDetails(safeNumber) {
    const safe = new ethers.Contract(SafeAddress, Safe.abi, provider);
    try {
        const safeData = await safe.getStakesBySafeNumber(safeNumber);
        // console.log(`Safe #${safeNumber} Details:`, safeData);
        return safeData;
    } catch (error) {
        console.error(`Failed to get details for Safe #${safeNumber}:`, error);
    }
}

export async function fetchAllSafeData() {
    const safe = new ethers.Contract(SafeAddress, Safe.abi, provider);
    try {
        const safesData = await safe.getSafeData();
        // console.log("All Safes Data:", safesData);
        return safesData;
    } catch (error) {
        console.error("Failed to fetch all safes data:", error);
    }
}
