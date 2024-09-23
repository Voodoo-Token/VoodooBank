import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Safes51to100 from '../components/Safes51to100';
import React, { useState, useEffect } from 'react';
import LoadingComponent from '../components/LoadingComponent';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Head> {/* Head content */} </Head>
      <Navbar logoSrc="/logo.png" />
      <div className="flex-grow transition-opacity duration-500" style={{ opacity: isLoading ? 0 : 1 }}>
        {isLoading ? <LoadingComponent /> : <Safes51to100 />}
      </div>
      <Footer className="mt-auto" />
    </div>
  );
};

export default Home;