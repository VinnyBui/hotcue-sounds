"use client"
import {useState, useEffect } from "react";
import { motion } from "framer-motion"
import ProductCard from "@/components/ProductCard"

const products = [
  { image: "/images/soundpacks.png", title: "Lo-Fi Pack" },
  { image: "/images/soundpacks.png", title: "Samples" },
  { image: "/images/soundpacks.png", title: "Synths" },
  { image: "/images/soundpacks.png", title: "FX" },
  // { image: "/images/soundpacks.png", title: "MIDI Packs" },
]

export default function HeroSection() {
  return (
    <section className="h-[90vh] flex items-center justify-center overflow-x-hidden md:px-20">
      <div className="flex gap-25 flex-col md:flex-row">
      {products.map((p, i) => {
        const translateY = 50 - i * 10
        return (
          <motion.div
            key={i}
            className={
              i === 3
                ? "hidden lg:block"
                : "" //no extra classes for the 1st 3 cards
            }
            initial={{
              opacity: 0,
              transform: `perspective(1000px) rotateY(-30deg) translateY(${translateY}px)`,
            }}
            animate={{
              opacity: 1,
              transform: `perspective(1000px) rotateY(-30deg) translateY(${translateY}px)`,
              transition: { duration: 0.5, delay: i * 0.3, ease: "easeOut" },
            }}
            whileHover={{
              transform: `perspective(1000px) rotateY(-15deg) translateY(${translateY}px)`,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
          >
            <ProductCard image={p.image} title={p.title} />
          </motion.div>

        )
      })}
      </div>
    </section>
  )
}
