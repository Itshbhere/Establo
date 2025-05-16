import React from "react";
import Image from "next/image";
import greenecosystem from "@/public/greenecosystem.jpg";

const DaoImpactCard: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row items-stretch rounded-2xl shadow-md w-full min-h-[300px]">
            {/* Left: Image */}
            <div className="w-full md:w-1/2">
                <Image
                    src={greenecosystem}
                    alt="Tree Planting"
                    width={600}
                    height={400}
                    className="rounded-2xl object-cover h-full w-full"
                />
            </div>

            {/* Right: Text */}
            <div className="w-full md:w-1/2 md:pl-10 flex ">
                <div className="flex flex-col justify-between h-full text-center md:text-left p-6">
                    {/* Heading at top */}
                    <h2 className="text-3xl font-bold text-white">
                        Green Ecosystem Donation
                    </h2>

                    {/* Paragraph and stat block at bottom */}
                    <div>
                        <p className="text-establo-offwhite mb-4 text-base md:text-lg">
                            For every stablecoin you use, we’ll donate to plant trees and support a greener future.
                            Your transactions make a real-world impact!
                        </p>
                        <div className="bg-gradient-to-br from-establo-purple-dark via-establo-purple to-establo-purple-light font-semibold px-5 py-3 rounded-lg shadow-sm text-lg inline-block">
                            1 EUSD  Coin = <span className="font-bold">1 Trees</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DaoImpactCard;
