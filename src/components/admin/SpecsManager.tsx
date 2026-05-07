'use client';

export interface SpecEntry {
  label: string;
  value: string;
}

interface Props {
  specs: SpecEntry[];
  onChange: (specs: SpecEntry[]) => void;
}

export default function SpecsManager({ specs, onChange }: Props) {
  function add() {
    onChange([...specs, { label: '', value: '' }]);
  }

  function update(index: number, field: keyof SpecEntry, val: string) {
    onChange(specs.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  }

  function remove(index: number) {
    onChange(specs.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {specs.map((spec, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="text"
            value={spec.label}
            onChange={(e) => update(i, 'label', e.target.value)}
            placeholder="Ej: Peso"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
          />
          <input
            type="text"
            value={spec.value}
            onChange={(e) => update(i, 'value', e.target.value)}
            placeholder="Ej: 1.200 kg"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-amber-400 transition-colors"
      >
        <span className="w-5 h-5 rounded-full border border-slate-700 hover:border-amber-500 flex items-center justify-center text-xs transition-colors">+</span>
        Agregar especificación
      </button>
    </div>
  );
}
