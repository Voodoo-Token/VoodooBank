import React, { useEffect, useState } from 'react';
import SafeViewSection from './SafeViewSection4';
import { getAllSafes } from '../helper/allSafes';

interface Safe {
    id: number;
    inUse: boolean;
    owner: string; // Assuming you have the owner information in your data
}

const Safes151to200: React.FC = () => {
    const [safes, setSafes] = useState<Safe[]>([]);

    useEffect(() => {
        const fetchSafes = async () => {
            const fetchedSafes = await getAllSafes(); // Fetches all safes with their details

            // Process and filter for safes 151 to 200
            const safes151to200 = fetchedSafes
                .filter(safe => {
                    const safeNumber = parseInt(safe.safeNumber);
                    return safeNumber >= 151 && safeNumber <= 200;
                })
                .map(safe => ({
                    id: parseInt(safe.safeNumber),
                    inUse: safe.owner !== "0x0", // A safe is considered in use if the owner is not "0x0"
                    owner: safe.owner,
                }));

            // Ensure safes151to200 contains exactly 50 entries for safes 151 to 200
            for (let i = safes151to200.length + 151; i <= 200; i++) {
                safes151to200.push({ id: i, inUse: false, owner: "0x0" }); // Add missing safes as open
            }

            setSafes(safes151to200);
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
                title="Deposit Safes 151 to 200"
            />
        </div>
    );
};

export default Safes151to200;
