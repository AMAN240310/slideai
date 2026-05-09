import { motion } from "framer-motion";

const TYPE_COLORS = {
  title:      "bg-purple-500/20 text-purple-300 border-purple-500/30",
  content:    "bg-blue-500/20 text-blue-300 border-blue-500/30",
  agenda:     "bg-teal-500/20 text-teal-300 border-teal-500/30",
  statistic:  "bg-orange-500/20 text-orange-300 border-orange-500/30",
  comparison: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  conclusion: "bg-green-500/20 text-green-300 border-green-500/30",
};

export default function SlidePreview({ slides = [], title }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">
        📊 {title} —{" "}
        <span className="text-gray-400 font-normal">{slides.length} slides</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
        {slides.map((slide, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface-card border border-surface-border rounded-xl p-4
                       hover:border-brand/50 transition-colors card-glow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-mono">#{i + 1}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border
                              ${TYPE_COLORS[slide.type] || TYPE_COLORS.content}`}>
                {slide.type}
              </span>
            </div>
            <h4 className="font-semibold text-white text-sm mb-2 line-clamp-1">
              {slide.title}
            </h4>
            {slide.subtitle && (
              <p className="text-xs text-gray-400 mb-2 line-clamp-1">{slide.subtitle}</p>
            )}
            {slide.stat && (
              <p className="text-2xl font-bold text-brand">{slide.stat}</p>
            )}
            {slide.points && (
              <ul className="space-y-1">
                {slide.points.slice(0, 3).map((pt, j) => (
                  <li key={j} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-brand mt-0.5 flex-shrink-0">•</span>
                    <span className="line-clamp-1">{pt}</span>
                  </li>
                ))}
                {slide.points.length > 3 && (
                  <li className="text-xs text-gray-600">
                    +{slide.points.length - 3} more…
                  </li>
                )}
              </ul>
            )}
            {slide.image_keyword && (
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <span>🖼</span>
                <span>{slide.image_keyword}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
