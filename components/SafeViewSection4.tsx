import React, { useState } from 'react';
import SafeBox from './SafeBox4';
import SafeForm from './SafeForm';

interface Safe {
    id: number;
    inUse: boolean;
}

interface SafeViewSectionProps {
    safes: Safe[];
    onClickSafe: (id: number) => void;
    title: string; // Add title prop
}

const SafeViewSection: React.FC<SafeViewSectionProps> = ({ safes, onClickSafe, title }) => {
    // State to manage which safe's form is open
    const [selectedSafe, setSelectedSafe] = useState<number | null>(null);

    // Adjusted to directly use onClickSafe prop
    const handleSafeClick = (id: number) => {
        onClickSafe(id); // Propagate the click handling as defined in the parent component, if needed
        setSelectedSafe(id); // Set the selected safe to open the form
    };

    return (
        <section className="py-12 px-4 lg:px-20">
            <div className="container mx-auto">
                <h2 className="text-3xl font-[Roboto] text-white font-bold text-center mb-8">
                    {title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {safes.map((safe) => (
                        <div key={safe.id} onClick={() => handleSafeClick(safe.id)} className="cursor-pointer">
                            <SafeBox inUse={safe.inUse} onClick={() => handleSafeClick(safe.id)} />
                        </div>
                    ))}
                </div>
            </div>
            {/* Display the form if any safe is selected */}
            {selectedSafe !== null && (
                <SafeForm safeId={selectedSafe} onClose={() => setSelectedSafe(null)} />
            )}
        </section>
    );
};

export default SafeViewSection;
