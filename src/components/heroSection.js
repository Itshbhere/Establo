"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { HeroImg, HeroTitleImg } from "../../public/Images/index.js";
import { herosection } from "@/data/data.json";
import CustomButton from "./CustomButton";

const HeroSection = () => {
  const {
    homeHeroText,
    subtitleText,
    withUsText,
    mainHeadingText,
    overlayText,
  } = herosection;

  const [currentText, setCurrentText] = useState(homeHeroText[0]);

  useEffect(() => {
    if (homeHeroText.length > 0) {
      const interval = setInterval(() => {
        setCurrentText((prevText) => {
          const currentIndex = homeHeroText.indexOf(prevText);
          const nextIndex = (currentIndex + 1) % homeHeroText.length;
          return homeHeroText[nextIndex];
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [homeHeroText]);

  return (
    <section className="text-center px-0 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center pt-20 pb-10">
          {/* Subtitle */}
          <p className="text-gray-300 text-lg mb-6">{subtitleText}</p>

          {/* Main Heading */}
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center md:text-left">
                {mainHeadingText}
              </h1>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--lightBlue)] border-2 border-dashed border-[var(--lightBlue)] rounded px-4 py-1 text-center">
                {currentText}
              </h1>
            </div>

            {/* Image + Dot + Text Row */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <div className="relative rounded-[60px] overflow-hidden w-[200px] md:w-auto">
                <Image
                  src={HeroTitleImg}
                  alt="Strength"
                  className="rounded-[60px] w-full h-auto"
                />
              </div>
              <div className="w-[26px] h-[26px] bg-[var(--lightBlue)] rounded-full" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center md:text-left">
                {withUsText}
              </h1>
            </div>
          </div>

          {/* Custom Button */}
          <CustomButton />

          {/* Background Image with Overlay */}
          <div className="relative w-full h-[500px] mt-12 overflow-hidden rounded-lg">
            <Image
              src={HeroImg}
              alt="Physiotherapy background"
              fill
              className="object-cover w-full h-full"
            />
            <p className="absolute bottom-2 left-2 text-white bg-black/40 p-4 text-base md:text-lg">
              {overlayText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
