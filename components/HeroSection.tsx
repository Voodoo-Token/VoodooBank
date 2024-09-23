import Image from 'next/image';
import Link from 'next/link';

const HeroSection: React.FC = () => {
    return (
        <div className="text-white py-16">
            <div className="container mx-auto px-6 md:px-12 flex flex-wrap items-center">
                <div className="w-full md:w-1/2 flex flex-col">
                    <h2 className="text-sm md:text-base font-semibold mb-2">
                        Earn rewards while Locking up
                    </h2>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    Store Your Voodoo Tokens in a Safe Deposit Box and Earn Interest Over Time
                    </h1>
                    <p className="text-sm md:text-base mb-8">
                        Our bank DApp is exclusively made for long-term holders. Store your Voodoo tokens in a safe deposit box and earn interest over time. The longer you lock them up, the higher the interest rate will be. Choose one of the 200 safe deposit boxes. Select a lock-up period of 1, 5, or 10 years, and return with more tokens when the waiting period is over!
                    </p>
                    <div className="space-y-2 animated-glow">
                        <p>1 year lock up reward (x2)</p>
                        <p>5 year lock up reward (x3)</p>
                        <p>10 year lock up reward (x4)</p>
                    </div>
                    {/* Lock Up Now Button */}
                    <Link href="/safe1">
                        <span className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Lock Up Now
                        </span>
                    </Link>
                </div>
                <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
                    <Image src="/l1.png" alt="Voodoo Tokens" width={500} height={300} />
                </div>
            </div>
            <style jsx>{`
        @keyframes glow {
          0%, 100% {
            text-shadow:
              0 0 4px #fff,
              0 0 6px #fff,
              0 0 8px silver,
              0 0 10px silver;
          }
          50% {
            text-shadow:
              0 0 2px #fff,
              0 0 4px #fff,
              0 0 6px silver,
              0 0 8px silver;
          }
        }
        .animated-glow p {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default HeroSection;
