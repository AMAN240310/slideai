import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "Understanding your topic…",
  "Generating slide structure…",
  "Crafting compelling content…",
  "Fetching stunning images…",
  "Designing your presentation…",
  "Finalizing your file…",
];

export default function LoadingOverlay({ visible, step = 0 }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center
                     bg-surface/95 backdrop-blur-xl"
        >
          {/* Spinning rings */}
          <div className="relative w-32 h-32 mb-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: i === 0 ? "#6C63FF" : i === 1 ? "#00D4FF" : "#A5B4FC",
                  width: `${100 - i * 20}%`,
                  height: `${100 - i * 20}%`,
                  top: `${i * 10}%`,
                  left: `${i * 10}%`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5 - i * 0.3, repeat: Infinity, ease: "linear" }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center text-3xl">
              🎯
            </div>
          </div>

          <motion.p
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold text-white mb-2"
          >
            {STEPS[Math.min(step, STEPS.length - 1)]}
          </motion.p>

          <p className="text-gray-400 text-sm">This may take 15–30 seconds</p>

          {/* Progress dots */}
          <div className="flex gap-2 mt-8">
            {STEPS.map((_, i) => (
              <motion.div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-brand w-6" : "bg-gray-700 w-1.5"
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
