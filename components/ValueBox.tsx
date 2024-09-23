import React from 'react';

interface ValueBoxProps {
  label: string;
  value: number | string; // Accepts both number and string to cater for "Billion" text
}

const ValueBox: React.FC<ValueBoxProps> = ({ label, value }) => {
  return (
    <div className="bg-white shadow-md rounded-lg px-6 py-4 text-center flex flex-col justify-between h-[150px] w-[250px]">
      <p className="text-2xl font-bold mb-1">{value}</p> {/* Reduced margin-bottom */}
      <p className="text-md text-gray-500 mt-1">{label}</p> {/* Reduced margin-top */}
    </div>
  );
};

export default ValueBox;
