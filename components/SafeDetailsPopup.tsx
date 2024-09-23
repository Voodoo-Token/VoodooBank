import React, { useEffect, useRef } from 'react';
import { BigNumber, ethers } from 'ethers';

interface StakeDetail {
    amount: BigNumber;
    startTime: BigNumber;
    unlockTime: BigNumber;
    duration: BigNumber;
    isStaked: boolean;
}

interface SafeDetailsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    details: StakeDetail[] | null;
}

const SafeDetailsPopup: React.FC<SafeDetailsPopupProps> = ({ isOpen, onClose, details }) => {
    const ref = useRef<HTMLDivElement>(null);

    // Close popup when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    // Helper function to format BigNumber values
    const formatBigNumber = (bn: BigNumber, decimals = 18) => ethers.utils.formatUnits(bn, decimals);

    const hasDetails = details && details.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 p-4">
            <div ref={ref} className="bg-white p-5 rounded-lg shadow-lg space-y-4 max-w-2xl w-full max-h-[90vh] overflow-auto">
                {hasDetails ? (
                    details.map((detail, index) => (
                        <div key={index} className="space-y-2 bg-gray-100 p-6 rounded-xl shadow-lg ">
                            <p><strong>Staked {index + 1}:</strong> {formatBigNumber(detail.amount)} ETH</p>
                            <p><strong>Start Time:</strong> {new Date(detail.startTime.toNumber() * 1000).toLocaleString()}</p>
                            <p><strong>Unlock Time:</strong> {new Date(detail.unlockTime.toNumber() * 1000).toLocaleString()}</p>
                            <p><strong>Duration:</strong> {detail.duration.toString()} blocks</p>
                            <p><strong>Is Staked:</strong> {detail.isStaked ? "Yes" : "No"}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <p className="text-lg font-medium">This safe is currently empty.</p>
                    </div>
                )}
                <div className="text-center mt-4">
                    <button onClick={onClose} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SafeDetailsPopup;
