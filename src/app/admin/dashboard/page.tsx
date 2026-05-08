'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMachines, deleteMachine, getStats, getContacts, markContacted, deleteContact } from '@/lib/api';
import type { Machine, MachineStatus } from '@/types/machine';
import type { StatsSummary, ContactRequest } from '@/lib/api';

const RentalCalendar = dynamicImport(() => import('@/components/admin/RentalCalendar'), { ssr: false });

function getToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? match[1] : '';
}

const statusBadge: Record<MachineStatus, string> = {
  Disponible:   'text-emerald-700 bg-emerald-50 border-emerald-200',
  Arrendada:    'text-red-700 bg-red-50 border-red-200',
  'Mantención': 'text-amber-700 bg-amber-50 border-amber-200',
};

export default function DashboardPage() {
  const router = useRouter();
  const [machines, setMachines]         = useState<Machine[]>([]);
  const [stats, setStats]               = useState<StatsSummary | null>(null);
  const [contacts, setContacts]         = useState<ContactRequest[]>([]);
  const [loading, setLoading]           = useState(true);
  const [deleting, setDeleting]         = useState<string | null>(null);
  const [deletingContact, setDeletingContact] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    Promise.all([getMachines(), getStats(token), getContacts(token)])
      .then(([m, s, c]) => { setMachines(m); setStats(s); setContacts(c); })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(id);
    try {
      await deleteMachine(id, getToken());
      setMachines((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert('Error al eliminar el equipo');
    } finally {
      setDeleting(null);
    }
  }

  async function handleMarkContacted(id: string) {
    const updated = await markContacted(id, getToken()).catch(() => null);
    if (updated) setContacts((prev) => prev.map((c) => c.id === id ? updated : c));
  }

  async function handleDeleteContact(id: string) {
    if (!confirm('¿Eliminar esta solicitud?')) return;
    setDeletingContact(id);
    try {
      await deleteContact(id, getToken());
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Error al eliminar');
    } finally {
      setDeletingContact(null);
    }
  }


  const counts = {
    total:      machines.length,
    disponible: machines.filter((m) => m.status === 'Disponible').length,
    arrendada:  machines.filter((m) => m.status === 'Arrendada').length,
    mantencion: machines.filter((m) => m.status === 'Mantención').length,
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-16">
<main className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Stats equipos ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Total equipos</p>
            <p className="text-4xl font-black text-slate-900">{counts.total}</p>
            <p className="text-slate-400 text-xs mt-2">en catálogo</p>
          </div>
          <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Disponibles</p>
            <p className="text-4xl font-black text-emerald-600">{counts.disponible}</p>
            <p className="text-slate-400 text-xs mt-2">para arriendo</p>
          </div>
          <div className="bg-white border border-slate-200 border-l-4 border-l-red-500 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Arrendados</p>
            <p className="text-4xl font-black text-red-600">{counts.arrendada}</p>
            <p className="text-slate-400 text-xs mt-2">actualmente</p>
          </div>
          <div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">En mantención</p>
            <p className="text-4xl font-black text-amber-600">{counts.mantencion}</p>
            <p className="text-slate-400 text-xs mt-2">fuera de servicio</p>
          </div>
        </div>

        {/* ── Visitas ────────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-slate-900 mb-5">Visitas al sitio</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Hoy',         value: stats?.today     ?? '—', color: 'text-blue-700' },
              { label: 'Esta semana', value: stats?.thisWeek  ?? '—', color: 'text-blue-700' },
              { label: 'Este mes',    value: stats?.thisMonth ?? '—', color: 'text-slate-900' },
              { label: 'Total',       value: stats?.total     ?? '—', color: 'text-slate-900' },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">{s.label}</p>
                <p className={`text-3xl font-black ${s.color}`}>
                  {typeof s.value === 'number' ? s.value.toLocaleString('es-CL') : s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Equipos ────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Equipos</h2>
            <p className="text-slate-500 text-sm mt-0.5">{counts.total} equipo{counts.total !== 1 ? 's' : ''} registrado{counts.total !== 1 ? 's' : ''}</p>
          </div>
          <Link
            href="/admin/maquinas/nueva"
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Agregar equipo
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Cargando...</div>
        ) : machines.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-300 rounded-2xl text-slate-400 bg-white">
            No hay equipos registrados.{' '}
            <Link href="/admin/maquinas/nueva" className="text-blue-600 hover:underline">Agrega el primero</Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest w-12" />
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Equipo</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">Categoría</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Estado</th>
                  <th className="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {machines.map((machine) => {
                  const thumb = machine.imageUrls?.[0];
                  return (
                    <tr key={machine.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          {thumb ? (
                            <Image src={thumb} alt={machine.name} width={64} height={64} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{machine.name}</div>
                        <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                          {machine.shortDescription || machine.technicalDescription}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{machine.category ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[machine.status]}`}>
                          {machine.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <Link href={`/admin/maquinas/${machine.id}/editar`} className="text-slate-500 hover:text-blue-600 transition-colors font-medium">
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(machine.id, machine.name)}
                            disabled={deleting === machine.id}
                            className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40"
                          >
                            {deleting === machine.id ? '...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Solicitudes de contacto ───────────────────────────────────────── */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Solicitudes de contacto</h2>
              <p className="text-slate-500 text-sm mt-0.5">
                {contacts.filter((c) => !c.contacted).length} pendiente{contacts.filter((c) => !c.contacted).length !== 1 ? 's' : ''}
                {contacts.length > 0 && ` · ${contacts.length} en total`}
              </p>
            </div>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-300 rounded-2xl text-slate-400 text-sm bg-white">
              No hay solicitudes de contacto aún.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Contacto</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden lg:table-cell">Equipo interés</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">Fecha</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Estado</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contacts.map((c) => (
                    <tr key={c.id} className={`hover:bg-slate-50 transition-colors ${c.contacted ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{c.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{c.company}</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <a href={`tel:${c.phone}`} className="text-blue-600 hover:text-blue-700 text-xs transition-colors">{c.phone}</a>
                          <span className="text-slate-300">·</span>
                          <a href={`mailto:${c.email}`} className="text-blue-600 hover:text-blue-700 text-xs transition-colors truncate max-w-[160px]">{c.email}</a>
                        </div>
                        {c.message && (
                          <p className="text-slate-400 text-xs mt-1.5 line-clamp-1 italic">"{c.message}"</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm hidden lg:table-cell">
                        {c.machineInterest || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs hidden md:table-cell">
                        {new Date(c.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        {c.contacted ? (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border text-slate-500 bg-slate-100 border-slate-200">
                            Contactado
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border text-orange-700 bg-orange-50 border-orange-200">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          {!c.contacted && (
                            <button
                              onClick={() => handleMarkContacted(c.id)}
                              className="text-slate-500 hover:text-emerald-600 transition-colors font-medium text-xs"
                            >
                              Marcar contactado
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            disabled={deletingContact === c.id}
                            className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40 text-xs"
                          >
                            {deletingContact === c.id ? '...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Calendario de arriendos ───────────────────────────────────────── */}
        {machines.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">Calendario de arriendos</h2>
              <p className="text-slate-500 text-sm mt-0.5">Marca los períodos en que cada equipo está arrendado</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <RentalCalendar machines={machines} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
