import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import { generatePresentation } from "../services/api";
import ThemeSelector from "../components/ThemeSelector";
import LoadingOverlay from "../components/LoadingOverlay";
import toast from "react-hot-toast";

const SLIDE_COUNTS = [3, 5, 7, 8, 10, 12, 15, 20];

export default function Generator() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();

  const [prompt,     setPrompt]     = useState(params.get("prompt") || "");
  const [slideCount, setSlideCount] = useState(8);
  const [theme,      setTheme]      = useState("dark");
  const [fileType,   setFileType]   = useState("pptx");
  const [loading,    setLoading]    = useState(false);
  const [loadStep,   setLoadStep]   = useState(0);

  // Simulate step progression during load
  useEffect(() => {
    if (!loading) { setLoadStep(0); return; }
    const interval = setInterval(() =>
      setLoadStep((s) => Math.min(s + 1, 5)), 5000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return toast.error("Please enter a topic or prompt");

    setLoading(true);
    try {
      const { data } = await generatePresentation({
        prompt, slide_count: slideCount, theme, file_type: fileType,
      });
      navigate("/preview", { state: { result: data } });
    } catch (err) {
      const msg = err.response?.data?.detail || "Generation failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} step={loadStep} />

      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2">
              What's your presentation about?
            </h1>
            <p className="text-gray-400 mb-10">
              Be specific for better results. E.g., "Startup pitch for a food-delivery app targeting Gen Z"
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Topic / Prompt *
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. The Future of Artificial Intelligence in Healthcare"
                rows={4}
                className="w-full bg-surface-card border border-surface-border rounded-xl
                           px-4 py-3 text-white placeholder-gray-600 focus:outline-none
                           focus:border-brand resize-none transition-colors"
                required
              />
              <p className="text-xs text-gray-600 mt-1">{prompt.length}/2000 characters</p>
            </div>

            {/* Slide count */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Number of Slides
              </label>
              <div className="flex gap-2 flex-wrap">
                {SLIDE_COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSlideCount(n)}
                    className={`w-14 h-14 rounded-xl font-semibold text-sm transition-all
                               ${slideCount === n
                                 ? "bg-brand text-white shadow-lg shadow-brand/30"
                                 : "bg-surface-card border border-surface-border text-gray-400 hover:border-gray-500"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* File type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Export Format
              </label>
              <div className="flex gap-3">
                {[
                  { id: "pptx", label: "PowerPoint (.pptx)", emoji: "📊" },
                  { id: "pdf",  label: "PDF (.pdf)",         emoji: "📄" },
                ].map(({ id, label, emoji }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFileType(id)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium
                               transition-all flex items-center gap-2
                               ${fileType === id
                                 ? "border-brand bg-brand/10 text-white"
                                 : "border-surface-border text-gray-400 hover:border-gray-500"}`}
                  >
                    <span>{emoji}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <ThemeSelector value={theme} onChange={setTheme} />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="btn-primary w-full justify-center text-base py-4"
            >
              <Sparkles size={18} />
              Generate Presentation
              <ChevronRight size={16} className="ml-auto" />
            </button>
          </motion.form>
        </div>
      </div>
    </>
  );
}
