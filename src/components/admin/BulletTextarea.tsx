'use client';

import { useRef } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}

export default function BulletTextarea({ value, onChange, required, rows = 5, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function insertBullets() {
    const el = ref.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    if (selected) {
      const bulleted = selected
        .split('\n')
        .map((line) => (line.startsWith('• ') ? line : `• ${line}`))
        .join('\n');
      const next = value.slice(0, start) + bulleted + value.slice(end);
      onChange(next);
    } else {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const line = value.slice(lineStart, start);
      if (line.startsWith('• ')) return;
      const next = value.slice(0, lineStart) + '• ' + value.slice(lineStart);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
        el.focus();
      });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Enter') return;
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const lineStart = value.lastIndexOf('\n', pos - 1) + 1;
    const currentLine = value.slice(lineStart, pos);
    if (!currentLine.startsWith('• ')) return;
    e.preventDefault();
    const next = value.slice(0, pos) + '\n• ' + value.slice(el.selectionEnd);
    onChange(next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = pos + 3;
    });
  }

  return (
    <div>
      <div className="flex gap-2 mb-1.5">
        <button
          type="button"
          onClick={insertBullets}
          className="text-xs text-slate-500 hover:text-blue-600 border border-slate-300 hover:border-blue-400 rounded px-2 py-1 transition-colors bg-white"
          title="Agregar viñeta a la línea o selección"
        >
          • Viñeta
        </button>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors text-sm resize-none"
      />
    </div>
  );
}
