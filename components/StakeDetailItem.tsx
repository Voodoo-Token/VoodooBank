import React from 'react';

// Define interface for stake details
interface StakeDetail {
  amount: number;
  reward: number;
  unlockTime: number;
}

// Define interface for the component props
interface StakeDetailItemProps {
  stake: StakeDetail;
  onSelectStake: () => void;
  isSelected: boolean;
}

// StakeDetailItem component definition
const StakeDetailItem: React.FC<StakeDetailItemProps> = ({
  stake,
  onSelectStake,
  isSelected,
}) => {
  // Convert unlock time to human-readable format
  const formattedUnlockTime = new Date(stake.unlockTime * 1000).toLocaleString();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-gray-100 p-6 rounded-xl shadow-lg w-full mx-auto my-8">
      {/* Stake Information within a Scrollable Container */}
      <div className="flex-1 overflow-auto pr-4 max-w-full">
        <p className="font-semibold text-sm">Staked: <span className="font-normal text-sm">{stake.amount}</span></p>
        <p className="font-semibold text-sm">Reward: <span className="font-normal text-sm">{stake.reward}</span></p>
        <p className="font-semibold text-sm">Unlock Time: <span className="font-normal text-sm">{formattedUnlockTime}</span></p>
      </div>

      {/* Selection Radio Button */}
      <div className="mt-4 md:mt-0">
        <input
          type="radio"
          name="stakeSelection"
          onChange={onSelectStake}
          checked={isSelected}
          className="accent-red-500 h-5 w-5"
        />
      </div>
    </div>
  );
};

export default StakeDetailItem;
