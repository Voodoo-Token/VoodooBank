import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import StakeDetailItem from './StakeDetailItem';
import { stake, getSafeDetails, unstake } from '../Interaction/init';
import getSigner from '../signer/getSigner';

interface StakeDetail {
  reward: number;
  unlockTime: number;
  amount: number;
}

interface Stake {
  amount: ethers.BigNumber;
  duration: number;
  unlockTime: ethers.BigNumber;
}

interface SafeFormProps {
  safeId: number;
  onClose: () => void;
}

const multiplierValues: Record<number, number> = {
  2: 1,
  3: 5,
  4: 10,
};

const SafeForm: React.FC<SafeFormProps> = ({ safeId, onClose }) => {
  const [amount, setAmount] = useState('');
  const [stakesDetails, setStakesDetails] = useState<StakeDetail[]>([]);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [selectedStakeIndex, setSelectedStakeIndex] = useState<number | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);


  // Fetching Safe Details
  const fetchSafeDetails = async () => {
    const signer = await getSigner();
    if (!signer) {
      console.error('Signer is not available');
      return;
    }
    const safeDetails: Stake[] = await getSafeDetails(safeId) || [];
    console.log(safeDetails);
    if (safeDetails.length > 0) {
      const mappedDetails: StakeDetail[] = safeDetails.map((stake: Stake) => {
        let rewardMultiplier;
        switch (Number(stake.duration)) {
          case 1:
            rewardMultiplier = 2;
            break;
          case 5:
            rewardMultiplier = 3;
            break;
          case 10:
            rewardMultiplier = 4;
            break;
          default:
            rewardMultiplier = 1;
        }

        const amountInEther = ethers.utils.formatEther(stake.amount);

        const reward = parseFloat(amountInEther) * rewardMultiplier;
        return {
          amount: parseFloat(amountInEther),
          reward: reward,
          unlockTime: stake.unlockTime.toNumber(),
        };
      });
      setStakesDetails(mappedDetails);
    } else {
      setStakesDetails([]);
    }
  };


  useEffect(() => {
    fetchSafeDetails();
  }, [safeId]);

  useEffect(() => {
  }, [stakesDetails]);


  const handleSelectStake = (index: number) => {
    setSelectedStakeIndex(index);
  };

  const handleMultiplierClick = (displayMultiplier: number) => {
    const valueToSet = multiplierValues[displayMultiplier];
    setMultiplier(valueToSet);
  };




  const handleUnstake = async () => {
    if (selectedStakeIndex !== null) {
      console.log("Unstaking for index", selectedStakeIndex);
      const signer = await getSigner();
        if (!signer) {
          console.error('Signer is not available');
          return;
        }
    
        await unstake(signer, selectedStakeIndex)
          .then(() => {
            console.log(`Unstake successful for index ${selectedStakeIndex}`);
            fetchSafeDetails();
          })
          .catch((error) => {
            console.error(`Failed to unstake for index ${selectedStakeIndex}:`, error);
          });
      setSelectedStakeIndex(null);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const signer = await getSigner();

    if (!signer) {
      console.error('Signer is not available');
      return;
    }
    await stake(signer, amount, multiplier)
    fetchSafeDetails()
    console.log('Form submitted for safe', safeId, 'with amount', amount, 'and multiplier', multiplier);
    onClose();
  };

   return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl max-h-[90vh] overflow-auto" ref={modalRef}>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Lock up Safe {safeId}</h2>
        
        {/* Responsive adjustments are made to ensure the modal and its content scale nicely */}
        <div>
          {stakesDetails.map((stake, index) => (
            <StakeDetailItem
              key={index}
              stake={stake}
              onSelectStake={() => setSelectedStakeIndex(index)}
              isSelected={selectedStakeIndex === index}
            />
          ))}
        </div>
  
        <div className="text-right">
          <button
            onClick={handleUnstake}
            disabled={selectedStakeIndex === null}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Unstake Selected
          </button>
        </div>
  
        <div className="mb-6">
          <label htmlFor="amount" className="block text-md font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="50000"
            max="200000"
            className="mt-1 p-3 w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>
  
        <div className="flex items-center justify-center mb-4">
          {Object.keys(multiplierValues).map((displayMultiplier) => (
            <button
              key={displayMultiplier}
              onClick={() => handleMultiplierClick(Number(displayMultiplier))}
              className={`py-2 px-6 mx-4 rounded-lg font-semibold ${multiplier === multiplierValues[Number(displayMultiplier)]
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              style={{ margin: '0 4px' }}
            >
              x{displayMultiplier}
            </button>
          ))}
        </div>
  
        <div className="flex items-center justify-between">
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Lock
          </button>
          <button
            onClick={onClose}
            className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafeForm;