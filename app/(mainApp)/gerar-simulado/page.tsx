"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Roboto } from "next/font/google";
import ExamGenerator from "@/app/ui/mock-exam/ExamGenerator";
import { useRef } from "react";
import Image from "next/image";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export default function GerarSimulado() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects for different elements
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "90%"]);
  const yGradient = useTransform(scrollYProgress, [0, 1], ["0%", "70%"]);
  const yShapes = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <div
      style={{ transformStyle: "flat" }}
      ref={containerRef}
      className="relative overflow-hidden"
    >
      {/* Background Image with parallax - now with higher z-index */}
      <motion.div
        style={{ y: yBg }} // Apply parallax here
        className="absolute inset-0 h-[100%] overflow-hidden"
      >
        <Image
          src="/gradient.jpeg"
          alt=""
          fill
          className="object-cover scale-x-[-1]" // Tailwind flip
        />
      </motion.div>

      {/* Gradient Overlay with parallax - now below content but above bg */}
      <motion.div
        className="absolute inset-0 h-[130%]"
        style={{
          background: `
            linear-gradient(
              90deg,
              rgba(166, 48, 118, 0.8) 0%,
              rgba(109, 40, 217, 0) 100%
            )
          `,
          mixBlendMode: "color",
          maskImage: `
            linear-gradient(
              to right,
              rgba(0,0,0,1) 0%,
              rgba(0,0,0,0.3) 100%
            )
          `,
          maskComposite: "source-in",
          WebkitMaskComposite: "source-in",
          y: yGradient,
          zIndex: 1, // Middle layer
        }}
      />

      {/* Precise Geometric Shapes with parallax - top layer */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none h-[120%]"
        style={{
          y: yShapes,
          zIndex: 2, // Top decorative layer
        }}
      >
        {/* 1. Small Orange Triangle - Top Left */}
        <div className="absolute top-[250px] left-[10px] md:left-[30px] w-[15px] h-[15px]">
          <svg viewBox="0 0 24 24" style={{ transform: "rotate(50deg)" }}>
            <path
              d="M12 2 L21.5 19 L2.5 19 Z"
              fill="rgb(249, 196, 22)"
              stroke="rgb(249, 196, 22)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 2. Small Green Semicircle - Top Right */}
        <div
          className="absolute top-[50px] right-[20px] md:right-[140px] w-[24px] h-[24px]"
          style={{
            clipPath: "circle(50% at 50% 0)",
            backgroundColor: "rgb(75, 229, 211)",
            transform: "rotate(-50deg)",
          }}
        />

        {/* 3. Small Square - Below Semicircle */}
        <div
          className="rounded-[2px] absolute top-[250px] right-[10px] md:right-[70px] w-[11px] h-[11px]"
          style={{
            backgroundColor: "rgba(255, 45, 167, 0.7)",
            transform: "rotate(45deg)",
          }}
        />
      </motion.div>

      {/* Content Container - highest z-index */}
      <div className="relative z-10 px-5" style={{ zIndex: 3 }}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Animated Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-16 pb-12 px-4 max-w-4xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="lg:w-full">
              <motion.h1
                className={
                  "text-3xl md:text-4xl lg:w-full font-[700] text-gray-900" +
                  roboto.className
                }
              >
                Crie Simulados Personalizados para seus Estudos de Concursos
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:w-[50%]"
            >
              <p
                className={
                  "text-base lg:pt-[70px] lg:-ml-[100px] md:text-[16px] text-gray-600"
                }
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Gere simulados 100% personalizados que replicam fielmente o
                estilo e formato da banca examinadora escolhida. Escolha também
                o nível de dificuldade, o tempo de prova e o número de questões.
              </p>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Card */}
        <ExamGenerator />
      </div>
    </div>
  );
}
