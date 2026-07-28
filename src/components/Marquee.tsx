"use client";

import { motion } from "framer-motion";

export function Marquee() {
  return (
    <div className="w-full bg-black/20 overflow-hidden relative flex items-center h-8 border-t border-white/10">
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-primary to-transparent z-20 pointer-events-none"></div>
      
      <motion.div
        className="flex items-center gap-6 text-[10px] sm:text-xs uppercase font-black text-secondary tracking-widest whitespace-nowrap opacity-90 w-max"
        initial={{ x: "0%" }}
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
      >
        {/* Renderizziamo due volte il contenuto per l'effetto loop continuo */}
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-6">
            <span>🐺 FORZA ROMA</span>
            <span className="text-white">❤️💛</span>
            <span>LUPI DI AREZZO</span>
            <span className="text-white">❤️💛</span>
            <span>🐺 FORZA ROMA</span>
            <span className="text-white">❤️💛</span>
            <span>LUPI DI AREZZO</span>
            <span className="text-white">❤️💛</span>
            <span>🐺 SEMPRE AL TUO FIANCO</span>
            <span className="text-white">❤️💛</span>
            <span>LUPI DI AREZZO</span>
            <span className="text-white">❤️💛</span>
          </div>
        ))}
      </motion.div>

      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-primary to-transparent z-20 pointer-events-none"></div>
    </div>
  );
}
