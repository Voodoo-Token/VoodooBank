import React, { useEffect, useState } from 'react';
import SafeViewSection from './SafeViewSection2';
import { getAllSafes } from '../helper/allSafes';

interface Safe {
    id: number;
    inUse: boolean;
    owner: string; // Ensure the Safe interface includes owner
}

const Safes51to100: React.FC = () => {
    const [safes, setSafes] = useState<Safe[]>([]);

    useEffect(() => {
        const fetchSafes = async () => {
            const fetchedSafes = await getAllSafes(); // Fetch all safes, which now includes the owner

            // Transform and filter the fetched safes for IDs 51 to 100
            const safes51to100 = fetchedSafes
                .filter(safe => {
                    const safeNumber = parseInt(safe.safeNumber);
                    return safeNumber >= 51 && safeNumber <= 100;
                })
                .map(safe => ({
                    id: parseInt(safe.safeNumber),
                    inUse: safe.owner !== "0x0", // Safe is in use if owner is not "0x0"
                    owner: safe.owner,
                }));

            // Ensure safes51to100 contains 50 entries for safes 51 to 100
            for (let i = safes51to100.length + 51; i <= 100; i++) {
                safes51to100.push({ id: i, inUse: false, owner: "0x0" }); // Add missing safes as open
            }

            setSafes(safes51to100);
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
                title="Deposit Safes 51 to 100"
            />
        </div>
    );
};

export default Safes51to100;
