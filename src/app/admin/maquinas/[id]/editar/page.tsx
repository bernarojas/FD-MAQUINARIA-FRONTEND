'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getMachine, updateMachine, uploadImages } from '@/lib/api';
import type { MachineStatus } from '@/types/machine';
import DocumentsManager, { type DocEntry } from '@/components/admin/DocumentsManager';
import BulletTextarea from '@/components/admin/BulletTextarea';
import SpecsManager, { type SpecEntry } from '@/components/admin/SpecsManager';

function getToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? match[1] : '';
}

const inputCls = 'w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors text-sm';
const labelCls = 'block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2';
const cardCls  = 'bg-white border border-slate-200 rounded-2xl p-6 shadow-sm';

export default function EditarMaquinaPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<MachineStatus>('Disponible');
  const [category, setCategory] = useState('');
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [specs, setSpecs] = useState<SpecEntry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getMachine(id)
      .then((m) => {
        setName(m.name);
        setShortDescription(m.shortDescription ?? '');
        setDescription(m.technicalDescription);
        setStatus(m.status);
        setCategory(m.category ?? '');
        setExistingUrls(m.imageUrls ?? []);
        setDocs(m.documents ?? []);
        setSpecs(m.specs ?? []);
      })
      .catch(() => setError('No se pudo cargar el equipo'))
      .finally(() => setFetching(false));
  }, [id]);

  function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setNewFiles((prev) => [...prev, ...selected]);
    setNewPreviews((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
  }

  function removeExisting(index: number) {
    setExistingUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNew(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = getToken();
      let imageUrls = [...existingUrls];
      if (newFiles.length > 0) {
        const uploaded = await uploadImages(newFiles, token);
        imageUrls = [...imageUrls, ...uploaded.urls];
      }
      const documents = docs.filter((d) => d.title && d.url).map(({ title, url }) => ({ title, url }));
      const filteredSpecs = specs.filter((s) => s.label && s.value);
      await updateMachine(id, { name, shortDescription: shortDescription || undefined, technicalDescription: description, status, category: category || undefined, imageUrls, documents, specs: filteredSpecs }, token);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-400">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-16">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm transition-colors mb-6">
          ← Volver al panel
        </Link>
        <h1 className="text-2xl font-black text-slate-900 mb-8">Editar Equipo</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`${cardCls} space-y-5`}>
            <div>
              <label className={labelCls}>Nombre del equipo *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Descripción corta</label>
              <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={inputCls} placeholder="Ej: Equipo de termofusión a tope para cañerías HDPE de 63 a 315 mm" />
            </div>

            <div>
              <label className={labelCls}>Descripción técnica *</label>
              <BulletTextarea value={description} onChange={setDescription} required rows={7} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Estado *</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as MachineStatus)} className={inputCls}>
                  <option value="Disponible">Disponible</option>
                  <option value="Arrendada">Arrendada</option>
                  <option value="Mantención">Mantención</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Categoría</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className={cardCls}>
            <label className={`${labelCls} mb-4`}>Imágenes actuales</label>
            {existingUrls.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {existingUrls.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="h-24 w-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeExisting(i)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm mb-4">Sin imágenes</p>
            )}

            <label className={`${labelCls} mb-2`}>Agregar nuevas imágenes</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-6 cursor-pointer transition-colors group">
              <span className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors">
                Seleccionar imágenes (JPG, PNG, WebP · máx. 10MB c/u)
              </span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFiles} className="hidden" />
            </label>
            {newPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {newPreviews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt="" className="h-24 w-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeNew(i)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specs */}
          <div className={cardCls}>
            <label className={labelCls}>Especificaciones técnicas</label>
            <p className="text-slate-400 text-xs mb-4">Datos clave que se muestran en la ficha del equipo (Peso, Potencia, Diámetro máximo…)</p>
            <SpecsManager specs={specs} onChange={setSpecs} />
          </div>

          {/* Documents */}
          <div className={cardCls}>
            <label className={`${labelCls} mb-4`}>Documentos (PDF)</label>
            <DocumentsManager docs={docs} onChange={setDocs} token={getToken()} />
          </div>

          {error && (
            <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
          )}

          <div className="flex gap-3">
            <Link href="/admin/dashboard" className="flex-1 text-center border border-slate-300 hover:border-slate-400 text-slate-600 py-3 rounded-lg font-semibold text-sm transition-colors bg-white">
              Cancelar
            </Link>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm transition-colors">
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
