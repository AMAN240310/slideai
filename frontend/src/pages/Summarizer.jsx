import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Copy, FileDown, Sparkles } from "lucide-react";
import { summarizeText } from "../services/api";
import toast from "react-hot-toast";

export default function Summarizer() {
  const [text,    setText]    = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl,  setPdfUrl]  = useState(null);

  const handleSummarize = async (exportType = null) => {
    if (!text.trim() || text.length < 50)
      return toast.error("Please enter at least 50 characters");

    setLoading(true);
    setSummary("");
    setPdfUrl(null);
    try {
      const { data } = await summarizeText({ text, export_type: exportType });
      setSummary(data.summary);
      if (data.pdf_url) setPdfUrl(data.pdf_url);
      toast.success("Summary generated!");
    } catch (err) {
      toast.error("Summarization failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Brain className="text-brand" /> AI Summarizer
          </h1>
          <p className="text-gray-400 mb-8">
            Paste any long text — articles, reports, documents — and get a structured AI summary.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Your Text *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article, report, or any long-form text here…"
              rows={18}
              className="w-full bg-surface-card border border-surface-border rounded-xl
                         px-4 py-3 text-white placeholder-gray-600 focus:outline-none
                         focus:border-brand resize-none transition-colors text-sm"
            />
            <p className="text-xs text-gray-600">{text.length} / 50,000 characters</p>

            <div className="flex gap-3">
              <button
                onClick={() => handleSummarize(null)}
                disabled={loading}
                className="btn-primary flex-1 justify-center"
              >
                <Sparkles size={16} />
                {loading ? "Summarizing…" : "Summarize"}
              </button>
              <button
                onClick={() => handleSummarize("pdf")}
                disabled={loading}
                className="px-4 py-3 rounded-xl border border-surface-border text-gray-300
                           hover:border-gray-500 hover:text-white transition-colors
                           flex items-center gap-2 text-sm font-medium"
              >
                <FileDown size={15} /> PDF
              </button>
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">AI Summary</label>
              {summary && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-xs text-gray-400
                             hover:text-white transition-colors"
                >
                  <Copy size={12} /> Copy
                </button>
              )}
            </div>

            <div className="min-h-[420px] bg-surface-card border border-surface-border
                           rounded-xl p-4 text-sm text-gray-300 whitespace-pre-wrap
                           overflow-y-auto leading-relaxed">
              {loading && (
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-4 h-4 border-2 border-brand border-t-transparent
                                  rounded-full animate-spin" />
                  Generating summary…
                </div>
              )}
              {!loading && !summary && (
                <p className="text-gray-600 italic">
                  Your AI-generated summary will appear here…
                </p>
              )}
              {summary}
            </div>

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-4 justify-center w-full"
              >
                <FileDown size={16} /> Download Summary PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
