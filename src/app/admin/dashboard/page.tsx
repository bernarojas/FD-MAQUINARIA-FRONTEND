'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMachines, deleteMachine } from '@/lib/api';
import type { Machine, MachineStatus } from '@/types/machine';

function getToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? match[1] : '';
}

const statusBadge: Record<MachineStatus, string> = {
  Disponible: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Arrendada: 'text-red-400 bg-red-400/10 border-red-400/30',
  'Mantención': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
};

export default function DashboardPage() {
  const router = useRouter();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    getMachines()
      .then(setMachines)
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

  function handleLogout() {
    document.cookie = 'admin_token=; path=/; max-age=0';
    router.push('/admin/login');
  }

  const counts = {
    total: machines.length,
    disponible: machines.filter((m) => m.status === 'Disponible').length,
    arrendada: machines.filter((m) => m.status === 'Arrendada').length,
    mantencion: machines.filter((m) => m.status === 'Mantención').length,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-lg font-black text-amber-500">F&D Admin</span>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Ver sitio →
            </Link>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 text-sm transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total equipos', value: counts.total, color: 'text-slate-100' },
            { label: 'Disponibles', value: counts.disponible, color: 'text-emerald-400' },
            { label: 'Arrendados', value: counts.arrendada, color: 'text-red-400' },
            { label: 'En mantención', value: counts.mantencion, color: 'text-amber-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-500 text-xs uppercase tracking-widest">{stat.label}</p>
              <p className={`mt-1 text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-100">Equipos</h1>
          <Link
            href="/admin/maquinas/nueva"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors"
          >
            + Agregar equipo
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Cargando...</div>
        ) : machines.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No hay equipos registrados.{' '}
            <Link href="/admin/maquinas/nueva" className="text-amber-400 hover:underline">
              Agrega el primero
            </Link>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Equipo
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">
                    Categoría
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Estado
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {machines.map((machine) => (
                  <tr key={machine.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{machine.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5 line-clamp-1">
                        {machine.technicalDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 hidden md:table-cell">
                      {machine.category ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[machine.status]}`}>
                        {machine.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/maquinas/${machine.id}/editar`}
                          className="text-slate-400 hover:text-amber-400 transition-colors font-medium"
                        >
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
