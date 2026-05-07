'use client';

import { ChangeEvent } from 'react';
import { uploadPdf } from '@/lib/api';

export interface DocEntry {
  title: string;
  url: string;
  uploading?: boolean;
  file?: File;
}

const TITLE_SUGGESTIONS = [
  'Manual de usuario',
  'Ficha técnica',
  'Características',
  'Certificado',
  'Guía de operación',
  'Especificaciones eléctricas',
  'Garantía',
];

interface Props {
  docs: DocEntry[];
  onChange: (docs: DocEntry[]) => void;
  token: string;
}

function getToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? match[1] : '';
}

export default function DocumentsManager({ docs, onChange, token }: Props) {
  function addDoc() {
    onChange([...docs, { title: '', url: '' }]);
  }

  function removeDoc(index: number) {
    onChange(docs.filter((_, i) => i !== index));
  }

  function updateTitle(index: number, title: string) {
    onChange(docs.map((d, i) => (i === index ? { ...d, title } : d)));
  }

  async function handleFile(index: number, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange(docs.map((d, i) => (i === index ? { ...d, uploading: true, file } : d)));
    try {
      const { url } = await uploadPdf(file, token || getToken());
      onChange(docs.map((d, i) => (i === index ? { ...d, url, uploading: false, file } : d)));
    } catch {
      onChange(docs.map((d, i) => (i === index ? { ...d, uploading: false } : d)));
      alert('Error al subir el PDF');
    }
    e.target.value = '';
  }

  return (
    <div className="space-y-3">
      {docs.map((doc, i) => (
        <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Documento {i + 1}
            </span>
            <button
              type="button"
              onClick={() => removeDoc(i)}
              className="text-slate-600 hover:text-red-400 transition-colors text-sm"
            >
              Eliminar
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">Título</label>
            <input
              type="text"
              list={`titles-${i}`}
              value={doc.title}
              onChange={(e) => updateTitle(i, e.target.value)}
              placeholder="Ej: Manual de usuario"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
            />
            <datalist id={`titles-${i}`}>
              {TITLE_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          {/* File */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">Archivo PDF</label>
            {doc.url ? (
              <div className="flex items-center gap-3">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  {doc.file?.name ?? 'Ver PDF'}
                </a>
                <label className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
                  Cambiar
                  <input type="file" accept="application/pdf" onChange={(e) => handleFile(i, e)} className="hidden" />
                </label>
              </div>
            ) : (
              <label className={`flex items-center gap-2 border border-dashed rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${doc.uploading ? 'border-amber-500/50 text-amber-400' : 'border-slate-600 hover:border-amber-500/40 text-slate-500 hover:text-slate-400'}`}>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-sm">{doc.uploading ? 'Subiendo...' : 'Seleccionar PDF (máx. 20MB)'}</span>
                <input type="file" accept="application/pdf" onChange={(e) => handleFile(i, e)} className="hidden" disabled={doc.uploading} />
              </label>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addDoc}
        className="w-full border border-dashed border-slate-700 hover:border-amber-500/40 text-slate-500 hover:text-amber-400 py-3 rounded-xl text-sm font-medium transition-colors"
      >
        + Agregar documento
      </button>
    </div>
  );
}
