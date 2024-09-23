import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

interface NavbarProps {
    logoSrc: string;
}

const Navbar: React.FC<NavbarProps> = ({ logoSrc }) => {
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


            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-50">
                    {isMenuOpen ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="hidden md:flex items-center space-x-4 md:space-x-6">
                <Link href="/"><span className={`text-black cursor-pointer hover:underline ${router.pathname === '/' && 'border-b-2 border-black'}`}>Home</span></Link>
                <Link href="/safe1"><span className={`text-black cursor-pointer hover:underline ${router.pathname === '/safe1' && 'border-b-2 border-black'}`}>Safes 1-50</span></Link>
                <Link href="/safe2"><span className={`text-black cursor-pointer hover:underline ${router.pathname === '/safe2' && 'border-b-2 border-black'}`}>Safes 51-100</span></Link>
                <Link href="/safe3"><span className={`text-black cursor-pointer hover:underline ${router.pathname === '/safe3' && 'border-b-2 border-black'}`}>Safes 101-150</span></Link>
                <Link href="/safe4"><span className={`text-black cursor-pointer hover:underline ${router.pathname === '/safe4' && 'border-b-2 border-black'}`}>Safes 151-200</span></Link>
                <ConnectButton />
            </div>


            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={variants}
                        transition={transition}
                        className="fixed inset-0 bg-white bg-opacity-90 p-5 z-40"
                        style={{ backdropFilter: 'blur(4px)' }}
                    >
                        {/* Close button */}
                        <div className="absolute top-5 right-5">
                            <button onClick={() => setIsMenuOpen(false)}>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <ul className="mt-12 space-y-4">
                            {/* Adjusted margin-top for menu items */}
                            <li><Link href="/"><span className={`text-black cursor-pointer hover:underline py-2 ${router.pathname === '/' && 'border-b-2 border-black'}`}>Home</span></Link></li>
                            <li><Link href="/safe1"><span className={`text-black cursor-pointer hover:underline py-2 ${router.pathname === '/safe1' && 'border-b-2 border-black'}`}>Safes 1-50</span></Link></li>
                            <li><Link href="/safe2"><span className={`text-black cursor-pointer hover:underline py-2 ${router.pathname === '/safe2' && 'border-b-2 border-black'}`}>Safes 51-100</span></Link></li>
                            <li><Link href="/safe3"><span className={`text-black cursor-pointer hover:underline py-2 ${router.pathname === '/safe3' && 'border-b-2 border-black'}`}>Safes 101-150</span></Link></li>
                            <li><Link href="/safe4"><span className={`text-black cursor-pointer hover:underline py-2 ${router.pathname === '/safe4' && 'border-b-2 border-black'}`}>Safes 151-200</span></Link></li>
                            <div className="pt-4">
                                <ConnectButton />
                            </div>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
