"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const numeric = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const currency = ["¥", "£", "€", "$"];
const suffixes = [" ", "K", "M", "B", "T"];
const delineators = [",", "."];

function rotateArray(arr, n) {
  return arr.slice(n).concat(arr.slice(0, n));
}

export default function StatCard({
  title,
  value,
  live = false,
  prefix = "",
  suffix = "",
  delay = 0,
  inView = true,
}) {
  return (
    <div className="flex flex-col h-full min-h-[120px]">
      <div className="flex bg-blue items-center gap-2">
        {live && (
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        )}
        <h3
          className={`text-xl font-medium ${
            live ? "text-green-500" : "text-gray-300"
          }`}
        >
          {title}
        </h3>
      </div>
      <div className="flex bg-pink overflow-hidden min-h-[52px] sm:min-h-[40px] md:min-h-[32px]">
        <AnimatedText
          value={`${prefix}${value}${suffix}`}
          live={live}
          delay={delay}
          inView={inView}
        />
      </div>
    </div>
  );
}

function AnimatedText({ value, delay, inView, live }) {
  const chars = value.split("");
  const color = live ? "text-green-500" : "text-white";

  return (
    <motion.div
      className="flex"
      initial="initial"
      animate={inView ? "animate" : "initial"}
      transition={{ staggerChildren: 0.025, delayChildren: delay }}
    >
      {chars.map((char, i) => {
        const charset = numeric.includes(char)
          ? numeric
          : delineators.includes(char)
          ? delineators
          : currency.includes(char)
          ? currency
          : suffixes;

        return (
          <CharSprite key={i} char={char} charset={charset} color={color} />
        );
      })}
    </motion.div>
  );
}

function CharSprite({ char, charset, color }) {
  const height = 60;
  const chars = rotateArray(charset, charset.indexOf(char));
  const idx = chars.indexOf(char);

  const variants = {
    initial: { y: (idx + 3) * -height },
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
      className="flex flex-col items-center pointer-events-none"
      variants={variants}
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
            className={`font-semibold text-[52px] leading-[52px] sm:text-[40px] sm:leading-[40px] md:text-[32px] md:leading-[32px] text-center ${color}`}
            style={{ fontFamily: "Basel" }}
          >
            {c}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
