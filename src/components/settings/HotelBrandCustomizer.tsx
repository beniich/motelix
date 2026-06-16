import { useState } from 'react';
import { Palette, Check, RotateCcw } from 'lucide-react';
import { useHotelTheme } from '../../hooks/useHotelTheme';
import type { HotelBrand } from '../../hooks/useHotelTheme';

const PRESETS: Array<{ name: string; brand: HotelBrand }> = [
  { name: 'Sapphire (Default)', brand: { primary: '#00D4FF', secondary: '#B026FF', accent: '#FFD700' } },
  { name: 'Royal Gold', brand: { primary: '#D4AF37', secondary: '#B8941F', accent: '#FBF6E7' } },
  { name: 'Oceanic Blue', brand: { primary: '#0EA5E9', secondary: '#06B6D4', accent: '#A5F3FC' } },
  { name: 'Forest Luxury', brand: { primary: '#10B981', secondary: '#059669', accent: '#D1FAE5' } },
  { name: 'Sunset Riviera', brand: { primary: '#F59E0B', secondary: '#EF4444', accent: '#FED7AA' } },
  { name: 'Midnight Purple', brand: { primary: '#A855F7', secondary: '#6366F1', accent: '#E9D5FF' } },
];

export function HotelBrandCustomizer() {
  const { brand, updateBrand, resetBrand } = useHotelTheme();
  const [customColor, setCustomColor] = useState(brand.primary);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold dark:text-slate-100 text-slate-800 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" />
            Hotel Brand Colors
          </h3>
          <p className="text-xs dark:text-slate-500 text-slate-500 mt-1">
            Customize the accent colors for your hotel's command center.
          </p>
        </div>
        <button
          onClick={resetBrand}
          className="text-xs dark:text-slate-500 text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Presets grid */}
      <div>
        <p className="text-[10px] uppercase tracking-widest dark:text-slate-500 text-slate-400 mb-2 font-mono">Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => {
            const active = JSON.stringify(preset.brand) === JSON.stringify(brand);
            return (
              <button
                key={preset.name}
                onClick={() => updateBrand(preset.brand)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                  active
                    ? 'border-indigo-500 dark:bg-indigo-500/10 bg-indigo-50 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                    : 'dark:border-slate-800 border-slate-200 dark:bg-slate-900/40 bg-slate-50 dark:hover:border-slate-700 hover:border-slate-300'
                }`}
              >
                {/* Color swatches */}
                <div className="flex shrink-0">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-black/20 shadow-sm"
                    style={{ background: preset.brand.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border-2 border-black/20 shadow-sm -ml-2"
                    style={{ background: preset.brand.secondary }}
                  />
                </div>
                <span className="text-[10px] dark:text-slate-300 text-slate-700 flex-1 font-semibold uppercase tracking-wide truncate">
                  {preset.name}
                </span>
                {active && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom color picker */}
      <div>
        <p className="text-[10px] uppercase tracking-widest dark:text-slate-500 text-slate-400 mb-2 font-mono">Custom Primary</p>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              updateBrand({ primary: e.target.value });
            }}
            className="w-10 h-10 rounded-lg border dark:border-slate-700 border-slate-200 cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                updateBrand({ primary: e.target.value });
              }
            }}
            className="flex-1 px-3 py-2 rounded-xl dark:bg-slate-900 bg-slate-100 dark:border-slate-700 border-slate-200 border dark:text-slate-100 text-slate-800 text-sm font-mono focus:outline-none focus:border-indigo-500 uppercase"
          />
        </div>
      </div>

      {/* Live preview */}
      <div className="p-4 rounded-xl dark:bg-slate-900/60 bg-slate-50 dark:border-slate-800 border-slate-200 border">
        <p className="text-[10px] uppercase tracking-widest dark:text-slate-500 text-slate-400 mb-3 font-mono">Live Preview</p>
        <div className="flex gap-2">
          <div
            className="h-12 flex-1 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider shadow-sm"
            style={{ background: brand.primary, color: '#0A0E1A' }}
          >
            Primary
          </div>
          <div
            className="h-12 flex-1 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider shadow-sm"
            style={{ background: brand.secondary, color: '#FFFFFF' }}
          >
            Secondary
          </div>
          <div
            className="h-12 flex-1 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider shadow-sm"
            style={{ background: brand.accent, color: '#0A0E1A' }}
          >
            Accent
          </div>
        </div>
      </div>
    </div>
  );
}
