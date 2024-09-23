import React, { useEffect, useState } from 'react';
import SafeViewSection from './SafeViewSection3';
import { getAllSafes } from '../helper/allSafes';

interface Safe {
    id: number;
    inUse: boolean;
    owner: string;
}

const Safes101to150: React.FC = () => {
    const [safes, setSafes] = useState<Safe[]>([]);

    useEffect(() => {
        const fetchSafes = async () => {
            const fetchedSafes = await getAllSafes(); // Assume this fetches all safes with their details

            // Process and filter for safes 101 to 150
            const safes101to150 = fetchedSafes
                .filter(safe => {
                    const safeNumber = parseInt(safe.safeNumber);
                    return safeNumber >= 101 && safeNumber <= 150;
                })
                .map(safe => ({
                    id: parseInt(safe.safeNumber),
                    inUse: safe.owner !== "0x0", // A safe is considered in use if the owner is not "0x0"
                    owner: safe.owner,
                }));

            // Ensure safes101to150 contains exactly 50 entries for safes 101 to 150
            for (let i = safes101to150.length + 101; i <= 150; i++) {
                safes101to150.push({ id: i, inUse: false, owner: "0x0" }); // Add missing safes as open
            }

            setSafes(safes101to150);
        };

        fetchSafes();
    }, []);

    const [selectedSafe, setSelectedSafe] = useState<number | null>(null);

    const handleSafeClick = (id: number) => setSelectedSafe(id);

    return (
        <div className="p-6">
            <SafeViewSection
                safes={safes}
                onClickSafe={handleSafeClick}
                title="Deposit Safes 101 to 150"
            />
        </div>
    );
};

export default Safes101to150;
