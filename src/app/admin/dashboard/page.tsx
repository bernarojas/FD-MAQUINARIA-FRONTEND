'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMachines, deleteMachine, getStats, getContacts, markContacted, deleteContact } from '@/lib/api';
import type { Machine, MachineStatus } from '@/types/machine';
import type { StatsSummary, ContactRequest } from '@/lib/api';

const RentalCalendar = dynamic(() => import('@/components/admin/RentalCalendar'), { ssr: false });

function getToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? match[1] : '';
}


const statusBadge: Record<MachineStatus, string> = {
  Disponible:   'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Arrendada:    'text-red-400 bg-red-400/10 border-red-400/30',
  'Mantención': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
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

  function handleLogout() {
    document.cookie = 'admin_token=; path=/; max-age=0';
    router.push('/admin/login');
  }

  const counts = {
    total:      machines.length,
    disponible: machines.filter((m) => m.status === 'Disponible').length,
    arrendada:  machines.filter((m) => m.status === 'Arrendada').length,
    mantencion: machines.filter((m) => m.status === 'Mantención').length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-amber-500">F&D</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-sm font-medium">Panel de administración</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-slate-500 hover:text-slate-300 text-sm transition-colors flex items-center gap-1.5">
              Ver sitio
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 text-sm transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Stats equipos ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Total equipos</p>
            <p className="text-4xl font-black text-slate-100">{counts.total}</p>
            <p className="text-slate-600 text-xs mt-2">en catálogo</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 border-l-2 border-l-emerald-500 rounded-2xl p-6">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Disponibles</p>
            <p className="text-4xl font-black text-emerald-400">{counts.disponible}</p>
            <p className="text-slate-600 text-xs mt-2">para arriendo</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 border-l-2 border-l-red-500 rounded-2xl p-6">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Arrendados</p>
            <p className="text-4xl font-black text-red-400">{counts.arrendada}</p>
            <p className="text-slate-600 text-xs mt-2">actualmente</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 border-l-2 border-l-amber-500 rounded-2xl p-6">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">En mantención</p>
            <p className="text-4xl font-black text-amber-400">{counts.mantencion}</p>
            <p className="text-slate-600 text-xs mt-2">fuera de servicio</p>
          </div>
        </div>

        {/* ── Visitas ────────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-slate-100 mb-5">Visitas al sitio</h2>

          {/* Cards resumen */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Hoy',        value: stats?.today     ?? '—', color: 'text-amber-400' },
              { label: 'Esta semana', value: stats?.thisWeek  ?? '—', color: 'text-amber-400' },
              { label: 'Este mes',   value: stats?.thisMonth ?? '—', color: 'text-slate-100' },
              { label: 'Total',      value: stats?.total     ?? '—', color: 'text-slate-100' },
            ].map((s) => (
              <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
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
            <h2 className="text-xl font-black text-slate-100">Equipos</h2>
            <p className="text-slate-500 text-sm mt-0.5">{counts.total} equipo{counts.total !== 1 ? 's' : ''} registrado{counts.total !== 1 ? 's' : ''}</p>
          </div>
          <Link
            href="/admin/maquinas/nueva"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Agregar equipo
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Cargando...</div>
        ) : machines.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl text-slate-500">
            No hay equipos registrados.{' '}
            <Link href="/admin/maquinas/nueva" className="text-amber-400 hover:underline">Agrega el primero</Link>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest w-12" />
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Equipo</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">Categoría</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Estado</th>
                  <th className="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {machines.map((machine) => {
                  const thumb = machine.imageUrls?.[0];
                  return (
                    <tr key={machine.id} className="hover:bg-slate-800/50 transition-colors">
                      {/* Thumbnail */}
                      <td className="px-4 py-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                          {thumb ? (
                            <Image src={thumb} alt={machine.name} width={64} height={64} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-100">{machine.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5 line-clamp-1">
                          {machine.shortDescription || machine.technicalDescription}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{machine.category ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[machine.status]}`}>
                          {machine.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <Link href={`/admin/maquinas/${machine.id}/editar`} className="text-slate-400 hover:text-amber-400 transition-colors font-medium">
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(machine.id, machine.name)}
                            disabled={deleting === machine.id}
                            className="text-slate-500 hover:text-red-400 transition-colors disabled:opacity-40"
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
              <h2 className="text-xl font-black text-slate-100">Solicitudes de contacto</h2>
              <p className="text-slate-500 text-sm mt-0.5">
                {contacts.filter((c) => !c.contacted).length} pendiente{contacts.filter((c) => !c.contacted).length !== 1 ? 's' : ''}
                {contacts.length > 0 && ` · ${contacts.length} en total`}
              </p>
            </div>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-600 text-sm">
              No hay solicitudes de contacto aún.
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Contacto</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden lg:table-cell">Equipo interés</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">Fecha</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Estado</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {contacts.map((c) => (
                    <tr key={c.id} className={`hover:bg-slate-800/50 transition-colors ${c.contacted ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-100">{c.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{c.company}</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <a href={`tel:${c.phone}`} className="text-amber-500 hover:text-amber-400 text-xs transition-colors">{c.phone}</a>
                          <span className="text-slate-700">·</span>
                          <a href={`mailto:${c.email}`} className="text-amber-500 hover:text-amber-400 text-xs transition-colors truncate max-w-[160px]">{c.email}</a>
                        </div>
                        {c.message && (
                          <p className="text-slate-600 text-xs mt-1.5 line-clamp-1 italic">"{c.message}"</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm hidden lg:table-cell">
                        {c.machineInterest || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs hidden md:table-cell">
                        {new Date(c.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        {c.contacted ? (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border text-slate-400 bg-slate-400/10 border-slate-400/30">
                            Contactado
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border text-amber-400 bg-amber-400/10 border-amber-400/30">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          {!c.contacted && (
                            <button
                              onClick={() => handleMarkContacted(c.id)}
                              className="text-slate-400 hover:text-emerald-400 transition-colors font-medium text-xs"
                            >
                              Marcar contactado
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            disabled={deletingContact === c.id}
                            className="text-slate-500 hover:text-red-400 transition-colors disabled:opacity-40 text-xs"
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
              <h2 className="text-xl font-black text-slate-100">Calendario de arriendos</h2>
              <p className="text-slate-500 text-sm mt-0.5">Marca los períodos en que cada equipo está arrendado</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <RentalCalendar machines={machines} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
