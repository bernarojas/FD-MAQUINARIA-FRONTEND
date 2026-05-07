import type { Metadata } from 'next';
import Link from 'next/link';
import { getMachines } from '@/lib/api';
import MachineCard from '@/components/MachineCard';
import PageTracker from '@/components/PageTracker';

export const metadata: Metadata = {
  title: 'Catálogo de Equipos | F&D Equipos',
  description:
    'Catálogo completo de máquinas de termofusión disponibles para arriendo en Calama. PT 315 Tecnodue, Soldadora Cuña WGW 300 y más.',
};

export default async function EquiposPage() {
  let machines = [];
  try {
    machines = await getMachines();
  } catch {}

  const disponibles = machines.filter((m) => m.status === 'Disponible').length;

  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <PageTracker />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-400 transition-colors text-sm font-medium mb-6"
          >
            ← Volver al inicio
          </Link>
          <span className="block text-amber-500 text-sm font-semibold tracking-widest uppercase">
            Catálogo de Equipos
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-black text-slate-100">
            Equipos Disponibles para Arriendo
          </h1>
          <p className="mt-4 text-slate-400 max-w-2xl leading-relaxed">
            Máquinas de termofusión de alta tecnología para cañerías HDPE, geomembranas
            y tuberías PP-R. Ideales para proyectos mineros y obras civiles en el norte de Chile.
          </p>
          {machines.length > 0 && (
            <p className="mt-3 text-slate-500 text-sm">
              {machines.length} equipo{machines.length !== 1 ? 's' : ''} en catálogo
              {disponibles > 0 && (
                <span className="ml-2 text-emerald-400">· {disponibles} disponible{disponibles !== 1 ? 's' : ''}</span>
              )}
            </p>
          )}
        </div>

        {/* Grid */}
        {machines.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-700 rounded-xl">
            <p className="text-slate-500 text-lg font-medium">Catálogo en actualización.</p>
            <p className="text-slate-600 mt-2 text-sm">
              Contáctenos directamente para conocer disponibilidad de equipos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
