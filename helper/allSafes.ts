import { fetchAllSafeData } from '../Interaction/init';
import { BigNumber, ethers } from 'ethers';

// If you haven't already, define a type for the structure of your safes
type SafeData = [
  safeNumber: BigNumber,
  owner: string,
  totalStaked: BigNumber,
  numberOfStakes: BigNumber
];

export const getAllSafes = async () => {
    const data = await fetchAllSafeData();

    // Define the type for the formatted safe data
    type FormattedSafeData = {
        safeNumber: string;
        owner: string;
        totalStaked: string;
        numberOfStakes: string;
    };

    // Initially map over the data to format it
    let formattedData: FormattedSafeData[] = data.map((safe: SafeData) => ({
        safeNumber: safe[0].toString(),
        owner: safe[1],
        totalStaked: ethers.utils.formatUnits(safe[2].toString(), 18),
        numberOfStakes: safe[3].toString(),
    }));

    // Calculate how many placeholders are needed to reach 200 entries
    const placeholdersNeeded = 200 - formattedData.length;

    // Generate placeholders and append them to formattedData
    const placeholders = Array.from({ length: placeholdersNeeded }, (_, i) => ({
        safeNumber: (formattedData.length + i + 1).toString(), // Continue numbering from the last real entry
        owner: "0x0", // Example placeholder value
        totalStaked: "0", // Assuming 0 staked for placeholders
        numberOfStakes: "0", // Assuming 0 stakes for placeholders
    }));

    // Combine the real data with the placeholders
    formattedData = formattedData.concat(placeholders);

    return formattedData;
};
