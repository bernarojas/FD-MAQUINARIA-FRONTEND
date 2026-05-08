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

  const inputCls = 'flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors text-sm';

  return (
    <div className="space-y-3">
      {specs.map((spec, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="text"
            value={spec.label}
            onChange={(e) => update(i, 'label', e.target.value)}
            placeholder="Ej: Peso"
            className={inputCls}
          />
          <input
            type="text"
            value={spec.value}
            onChange={(e) => update(i, 'value', e.target.value)}
            placeholder="Ej: 1.200 kg"
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
      >
        <span className="w-5 h-5 rounded-full border border-slate-300 hover:border-blue-500 flex items-center justify-center text-xs transition-colors">+</span>
        Agregar especificación
      </button>
    </div>
  );
}
