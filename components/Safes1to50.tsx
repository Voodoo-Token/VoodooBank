import React, { useEffect, useState } from 'react';
import SafeViewSection from './SafeViewSection1';
import { getAllSafes } from '../helper/allSafes';

interface Safe {
    id: number;
    inUse: boolean;
    owner: string;
}

const Safes1to50: React.FC = () => {
    const [safes, setSafes] = useState<Safe[]>([]);

    useEffect(() => {
        const fetchSafes = async () => {
            const fetchedSafes = await getAllSafes(); // Fetches detailed information for all safes

            // Filter and process for safes 1 to 50
            const safes1to50 = fetchedSafes
                .filter(safe => {
                    const safeNumber = parseInt(safe.safeNumber);
                    return safeNumber >= 0 && safeNumber <= 50;
                })
                .map(safe => ({
                    id: parseInt(safe.safeNumber),
                    inUse: safe.owner !== "0x0", // Determine inUse based on the owner not being "0x0"
                    owner: safe.owner,
                }));

            // If less than 50 safes are fetched, fill in the remaining safes as open
            for (let i = safes1to50.length + 1; i <= 51; i++) {
                safes1to50.push({ id: i, inUse: false, owner: "0x0" });
            }

            setSafes(safes1to50);
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
                title="Deposit Safes 1 to 50"
            />
        </div>
    );
};

export default Safes1to50;
