"use client"

import { motion } from "framer-motion"

export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
        <img
          src="/kaushalx-logo.png"
          alt="KaushalX Logo"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col">
        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
          KUSHAL<span className="text-cyan-400">X</span>
        </span>
        <span className="text-[0.65rem] font-medium tracking-widest text-gray-400 uppercase">
          Skill Exchange Platform
        </span>
      </div>
    </motion.div>
  )
}

