const THEMES = [
  { id: "dark",    label: "Dark AI",    colors: ["#0D1017", "#6C63FF", "#00D4FF"] },
  { id: "light",   label: "Clean",      colors: ["#FFFFFF", "#4F46E5", "#06B6D4"] },
  { id: "ocean",   label: "Ocean",      colors: ["#042A4A", "#00B4D8", "#90E0EF"] },
  { id: "forest",  label: "Forest",     colors: ["#082A14", "#2D6A4F", "#52B788"] },
  { id: "sunset",  label: "Sunset",     colors: ["#1A0533", "#FF6348", "#FFA500"] },
  { id: "minimal", label: "Minimal",    colors: ["#FAFAFA", "#222222", "#888888"] },
];

export default function ThemeSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
      <div className="grid grid-cols-3 gap-3">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`relative p-3 rounded-xl border-2 transition-all duration-200
                       ${value === t.id
                         ? "border-brand bg-brand/10"
                         : "border-surface-border hover:border-gray-500"}`}
          >
            <div className="flex gap-1 mb-2">
              {t.colors.map((c, i) => (
                <div
                  key={i}
                  className="h-4 rounded flex-1"
                  style={{ background: c }}
                />
              ))}
            </div>
            <p className="text-xs font-medium text-center text-gray-300">{t.label}</p>
            {value === t.id && (
              <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-brand rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
