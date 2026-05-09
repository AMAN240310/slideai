import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import SlidePreview from "../components/SlidePreview";
import { getDownloadUrl } from "../services/api";
import toast from "react-hot-toast";

export default function Preview() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const result    = state?.result;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">No presentation data found.</p>
        <Link to="/generate" className="btn-primary">Create One</Link>
      </div>
    );
  }

  const handleDownload = () => {
    const url = getDownloadUrl(result.file_id);
    window.open(url, "_blank");
    toast.success(`Downloading ${result.file_type?.toUpperCase()}…`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex gap-3">
            <Link
              to="/generate"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border
                         border-surface-border text-gray-400 hover:text-white
                         hover:border-gray-500 transition-colors text-sm"
            >
              <RefreshCw size={14} /> New Presentation
            </Link>
            <button onClick={handleDownload} className="btn-primary">
              <Download size={16} />
              Download {result.file_type?.toUpperCase()}
            </button>
          </div>
        </motion.div>

        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-brand/20 to-teal-500/20 border border-brand/30
                     rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">
                Your presentation is ready! 🎉
              </h2>
              <p className="text-sm text-gray-400">
                {result.slides?.length} slides generated •{" "}
                {result.file_type?.toUpperCase()} format
              </p>
            </div>
          </div>
        </motion.div>

        {/* Slide preview grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-card border border-surface-border rounded-2xl p-6"
        >
          <SlidePreview slides={result.slides} title={result.title} />
        </motion.div>

        {/* Download CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <button onClick={handleDownload} className="btn-primary text-lg py-4 px-10 mx-auto">
            <Download size={20} />
            Download Your {result.file_type?.toUpperCase()}
          </button>
          <p className="text-xs text-gray-600 mt-3">
            File will expire in 10 minutes. Download now!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
