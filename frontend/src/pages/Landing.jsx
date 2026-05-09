import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Zap, Download, Palette, Brain, Image } from "lucide-react";

const FEATURES = [
  { icon: Brain,    title: "AI-Powered",    desc: "Gemini AI generates professional slide content from a single prompt" },
  { icon: Palette,  title: "6 Themes",      desc: "Dark, Ocean, Forest, Sunset, Minimal & more beautiful themes" },
  { icon: Image,    title: "Auto Images",   desc: "Unsplash integration fetches perfect images for each slide" },
  { icon: Download, title: "PPT & PDF",     desc: "Export as editable PowerPoint or print-ready PDF instantly" },
  { icon: Zap,      title: "30-sec Build",  desc: "Full professional presentation generated in under 30 seconds" },
  { icon: Sparkles, title: "AI Summary",    desc: "Paste long text and get an instant structured summary or slides" },
];

const EXAMPLES = [
  "The Future of Quantum Computing",
  "Climate Change: Action Plan 2025",
  "Startup Pitch Deck for HealthTech",
  "Introduction to Machine Learning",
  "Sustainable Architecture Trends",
  "Digital Marketing Strategy 2025",
];

export default function Landing() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center max-w-5xl mx-auto">
        {/* Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-brand/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                           bg-brand/10 border border-brand/30 text-brand text-sm font-medium mb-6">
            <Sparkles size={14} /> Powered by Gemini AI + Unsplash
          </span>

          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Create stunning{" "}
            <span className="gradient-text">presentations</span>
            <br />with AI in seconds
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Type a topic. Choose a theme. Download a professional presentation.
            No design skills required — SlideAI does everything.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/generate" className="btn-primary text-base py-4 px-8">
              <Sparkles size={18} /> Start Generating — Free
            </Link>
            <Link to="/summarize"
                  className="px-8 py-4 rounded-xl border border-surface-border
                             text-gray-300 hover:text-white hover:border-gray-500
                             transition-colors font-semibold flex items-center gap-2">
              <Brain size={18} /> Try AI Summarizer
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Example prompts */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500 text-sm mb-4">Try these prompts →</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {EXAMPLES.map((ex) => (
              <Link
                key={ex}
                to={`/generate?prompt=${encodeURIComponent(ex)}`}
                className="px-4 py-2 rounded-full bg-surface-card border border-surface-border
                           text-sm text-gray-300 hover:border-brand/50 hover:text-white
                           transition-colors"
              >
                {ex}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-surface-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Everything you need
          </h2>
          <p className="text-gray-400 text-center mb-12">No subscriptions. No templates to fill. Just AI.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ y: -4 }}
                className="bg-surface border border-surface-border rounded-2xl p-6 card-glow"
              >
                <div className="w-11 h-11 bg-brand/15 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-brand" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to build your deck?</h2>
        <p className="text-gray-400 mb-8">Join thousands using SlideAI to save hours every week.</p>
        <Link to="/generate" className="btn-primary text-lg py-4 px-10 inline-flex">
          <Sparkles size={20} /> Generate My Presentation
        </Link>
      </section>
    </div>
  );
}
