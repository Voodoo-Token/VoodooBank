import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

interface NavbarProps {
    logoSrc: string;
}

const NavbarMaintenance: React.FC<NavbarProps> = ({ logoSrc }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "100%" },
    };

    // Adjust transition speed and make it smoother
    const transition = {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.2 // Shorter duration for span faster transition
    };

    return (
        <nav className="bg-white px-4 py-2 flex items-center justify-between font-['Roboto'] relative shadow-md">
            <div className="flex items-center">
                <Image src={logoSrc} alt="Logo" width={150} height={150} priority />
            </div>


        </nav>
    );
};

export default NavbarMaintenance;
