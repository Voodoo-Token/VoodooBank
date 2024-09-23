import React, { useEffect, useState } from 'react';
import SafeBox from './SafeBox1';
import ValueBox from './ValueBox';
import { getAllSafes } from '../helper/allSafes';
import SafeDetailsPopup from './SafeDetailsPopup';
import { ethers } from 'ethers';
import { getTotalValueLocked, getSafeDetails } from '../Interaction/init';

interface FormattedSafeData {
    safeNumber: string;
    owner: string;
    totalStaked: string;
    numberOfStakes: string;
}

interface StakeDetail {
    amount: ethers.BigNumber;
    startTime: ethers.BigNumber;
    unlockTime: ethers.BigNumber;
    duration: ethers.BigNumber;
    isStaked: boolean;
}

const SafesSection: React.FC = () => {
    const [safesData, setSafesData] = useState<FormattedSafeData[]>([]);
    const [TVL, setTVL] = useState<number | null>(null);
    const [selectedSafeDetails, setSelectedSafeDetails] = useState<StakeDetail[] | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const fetchSafes = async () => {
            const safes = await getAllSafes();
            safes.sort((a, b) => parseFloat(b.totalStaked) - parseFloat(a.totalStaked));
            const tvl = await getTotalValueLocked();
            const tvlNumber = tvl ? parseFloat(tvl) : null;
            setSafesData(safes);
            setTVL(tvlNumber);
        };
        fetchSafes();
    }, []);

    const handleSafeClick = async (safeNumber: string) => {
        try {
            const rawDetails = await getSafeDetails(safeNumber);
            const formattedDetails = rawDetails.map((detail: any) => ({
                amount: detail.amount,
                startTime: detail.startTime,
                unlockTime: detail.unlockTime,
                duration: detail.duration,
                isStaked: detail.isStaked,
            }));
            setSelectedSafeDetails(formattedDetails);
        } catch (error) {
            console.error(`Failed to get details for Safe #${safeNumber}:`, error);
            // Here you can set selectedSafeDetails to a special value indicating the error
            setSelectedSafeDetails([]);
        }
        setIsPopupOpen(true);
    };

    const valueBoxData = [
        { label: 'Safes in use', value: safesData.filter(safe => parseFloat(safe.totalStaked) > 0).length.toString() },
        { label: 'Safes used in the past', value: '1,692' },
        { label: 'Total Volume Locked', value: TVL?.toFixed(2) ?? 'N/A' },
        { label: 'Total Payout', value: `More than ${TVL ? (TVL * 3).toFixed(2) : '0'}` },
    ]

    return (
        <section className="py-12 px-4 lg:px-20">
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-center gap-12 mb-12">
                    {valueBoxData.map((data, index) => (
                        <ValueBox key={index} label={data.value} value={data.label} />
                    ))}
                </div>

                <h2 className="text-3xl font-[Roboto] font-bold text-white text-center mb-8">
                    Most Valuable Safes in Use
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-y-10 gap-x-4">
                    {safesData.slice(0, 6).map((safe, index) => (
                        <SafeBox
                            key={index}
                            inUse={parseFloat(safe.totalStaked) > 0}
                            totalStaked={safe.totalStaked}
                            onClick={() => handleSafeClick(safe.safeNumber)} // Correctly passing safeNumber
                        />
                    ))
                    }

                </div>
                <SafeDetailsPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} details={selectedSafeDetails} />

            </div>
        </section>
    );
};

export default SafesSection;
