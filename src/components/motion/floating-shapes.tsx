"use client";

import { motion } from "framer-motion";
import { Parallax } from "./parallax";

const shapes = [
  {
    size: 64,
    top: "8%",
    left: "12%",
    bg: "bg-foreground/[0.04]",
    duration: 6,
    delay: 0,
    shape: "rounded-full",
  },
  {
    size: 40,
    top: "18%",
    right: "15%",
    bg: "bg-foreground/[0.03]",
    duration: 7,
    delay: 0.5,
    shape: "rounded-full",
  },
  {
    size: 28,
    top: "65%",
    left: "8%",
    bg: "bg-accent/[0.12]",
    duration: 5,
    delay: 1,
    shape: "rounded-lg rotate-45",
  },
  {
    size: 48,
    top: "72%",
    right: "10%",
    bg: "bg-foreground/[0.03]",
    duration: 8,
    delay: 0.3,
    shape: "rounded-full",
  },
  {
    size: 20,
    top: "35%",
    left: "5%",
    bg: "bg-accent/[0.08]",
    duration: 6,
    delay: 1.5,
    shape: "rounded-full",
  },
  {
    size: 36,
    top: "45%",
    right: "6%",
    bg: "bg-foreground/[0.03]",
    duration: 7,
    delay: 0.8,
    shape: "rounded-lg rotate-12",
  },
  {
    size: 16,
    top: "25%",
    left: "80%",
    bg: "bg-accent/[0.06]",
    duration: 5,
    delay: 2,
    shape: "rounded-full",
  },
  {
    size: 24,
    top: "55%",
    left: "25%",
    bg: "bg-foreground/[0.04]",
    duration: 6.5,
    delay: 0.7,
    shape: "rounded-full",
  },
];

interface FloatingShapesProps {
  count?: number;
}

export function FloatingShapes({ count }: FloatingShapesProps) {
  const visibleShapes = count ? shapes.slice(0, count) : shapes;

  return (
    <Parallax speed={0.5} className="absolute inset-0 overflow-hidden pointer-events-none">
      {visibleShapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute ${shape.bg} ${shape.shape}`}
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            right: shape.right,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}
    </Parallax>
  );
}
