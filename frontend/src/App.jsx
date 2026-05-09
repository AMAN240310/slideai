import { Routes, Route } from "react-router-dom";
import Navbar     from "./components/Navbar";
import Landing    from "./pages/Landing";
import Generator  from "./pages/Generator";
import Preview    from "./pages/Preview";
import Summarizer from "./pages/Summarizer";

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-white font-sans">
      <Navbar />
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/generate"  element={<Generator />} />
        <Route path="/preview"   element={<Preview />} />
        <Route path="/summarize" element={<Summarizer />} />
      </Routes>
    </div>
  );
}
