import React from 'react';
import Image from 'next/image';
import NavbarMaintenance from './NavbarMaintenance';
import Footer from './Footer';
import Link from 'next/link';

const MaintenancePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      <NavbarMaintenance logoSrc="/logo.png" />
      <div className="flex-grow flex items-center justify-center p-10">
        <div className="flex flex-wrap justify-center items-center container mx-auto">
          <div className="w-full md:w-1/2 flex justify-center p-5">
            <Image src="/l1.png" alt="Voodoo Tokens" width={500} height={300} className="opacity-50" />
          </div>
          <div className="w-full md:w-1/2 text-center p-5">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Bank Closed</h1>
            <p>The DApp will be available during the following times (EST):</p>
            <ul className="list-disc list-inside mt-4 text-left">
              <li>Mon 9.00 AM - 5.00 PM</li>
              <li>Tue 9.00 AM - 5.00 PM</li>
              <li>Wed 9.00 AM - 5.00 PM</li>
              <li>Thu 9.00 AM - 5.00 PM</li>
              <li>Fri 9.00 AM - 5.00 PM</li>
              <li>Sat 9.00 AM - 5.00 PM</li>
              <li>Sun Closed</li>
            </ul>
            <div className="mt-6">
              <Link href="https://www.voodootoken.com/" passHref
                 className="bg-pink-500 text-white font-bold py-2 px-4 rounded hover:bg-pink-700">
                  Visit Main Site
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
};

export default MaintenancePage;
