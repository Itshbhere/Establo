"use client";

import { motion } from "framer-motion";

const numeric = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const currency = ["¥", "£", "€", "$"];
const suffixes = [" ", "K", "M", "B", "T"];
const delineators = [",", "."];

function rotateArray(arr, n) {
  return arr.slice(n).concat(arr.slice(0, n));
}

export function StatCard({
  title,
  value,
  live,
  prefix,
  suffix,
  delay = 0,
  inView,
}) {
  const bgColor = "bg-green-100/5";

  return (
    <div
      className={`rounded-2xl w-full h-full max-h-[230px] p-8 overflow-hidden ${bgColor}`}
      style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 0.5px, transparent 0)`,
        backgroundSize: "12px 12px",
        backgroundPosition: "-8.5px -8.5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      {/* Top: Title */}
      <div className="flex flex-row items-center gap-2 mb-4">
        {live && <LiveIcon />}
        <h3
          className={`font-semibold 
            text-[24px] leading-[32px] 
            xl:text-[24px] xl:leading-[32px]
            lg:text-[18px] lg:leading-[26px]
            md:text-[18px] md:leading-[20px]
            ${live ? "text-green-500" : "text-[#BABABA]"}
          `}
        >
          {title}
        </h3>
      </div>

      {/* Spacer */}
      <div style={{ marginTop: "90px" }} />

      {/* Bottom: Animated value */}
      <StringInterpolationWithMotion
        value={value}
        live={live}
        prefix={prefix}
        suffix={suffix}
        delay={delay}
        inView={inView}
      />
    </div>
  );
}

function StringInterpolationWithMotion({
  value,
  delay,
  inView,
  live,
  prefix,
  suffix,
}) {
  const chars = `${prefix ?? ""}${value}${suffix ?? ""}`.split("");
  const textColor = live ? "text-green-500" : "text-white";

  return (
    <motion.div
      className="relative flex w-full min-h-[52px] overflow-hidden md:min-h-[40px] sm:min-h-[32px]"
      initial="initial"
      animate={inView ? "animate" : "initial"}
      transition={{ staggerChildren: 0.025, delayChildren: delay }}
    >
      {chars.map((char, index) => {
        const charset = numeric.includes(char)
          ? numeric
          : delineators.includes(char)
          ? delineators
          : currency.includes(char)
          ? currency
          : suffixes;

        return (
          <NumberSprite
            key={index}
            char={char}
            charset={charset}
            textColor={textColor}
          />
        );
      })}
    </motion.div>
  );
}

function NumberSprite({ char, charset, textColor }) {
  const height = 60;
  const chars = rotateArray(charset, charset.indexOf(char));
  const idx = chars.indexOf(char);

  const containerVariants = {
    initial: {
      y: (idx + 3) * -height,
    },
    animate: {
      y: idx * -height,
      transition: {
        duration: 1,
        type: "spring",
      },
    },
  };

  return (
    <motion.div
      className="pointer-events-none flex flex-col"
      variants={containerVariants}
    >
      {chars.map((c, i) => {
        const charVariants = {
          initial: { opacity: 0.25 },
          animate: {
            opacity: idx === i ? 1 : 0,
            transition: {
              opacity: { duration: 0.5 },
              duration: 1,
              type: "spring",
            },
          },
        };

        return (
          <motion.div
            key={i}
            variants={charVariants}
            className={`font-medium ${textColor}
              text-[52px] leading-[52px]
              xl:text-[40px] xl:leading-[40px]
              lg:text-[32px] lg:leading-[32px]
              md:text-[28px] md:leading-[28px]
              sm:text-[22px] sm:leading-[22px]
            `}
          >
            {c}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function LiveIcon() {
  return (
    <div className="w-[6px] h-[6px] rounded-full bg-green-500 animate-pulse" />
  );
}
