import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, FileText, Home } from "lucide-react";

const links = [
  { to: "/",          label: "Home",      icon: Home },
  { to: "/generate",  label: "Generate",  icon: Sparkles },
  { to: "/summarize", label: "Summarize", icon: FileText },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border
                 bg-surface/80 backdrop-blur-xl px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <span className="gradient-text">SlideAI</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                         transition-colors duration-200
                         ${pathname === to
                           ? "bg-brand/20 text-brand"
                           : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        <Link to="/generate" className="btn-primary text-sm py-2">
          <Sparkles size={15} />
          New Presentation
        </Link>
      </div>
    </motion.nav>
  );
}
