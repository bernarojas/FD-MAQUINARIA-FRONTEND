import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMachine, getMachines } from '@/lib/api';
import type { MachineStatus } from '@/types/machine';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const machine = await getMachine(params.id);
    return {
      title: machine.name,
      description: machine.technicalDescription.slice(0, 155),
    };
  } catch {
    return { title: 'Equipo no encontrado' };
  }
}

export async function generateStaticParams() {
  try {
    const machines = await getMachines();
    return machines.map((m) => ({ id: m.id }));
  } catch {
    return [];
  }
}

const statusConfig: Record<MachineStatus, { label: string; classes: string }> = {
  Disponible: {
    label: 'Disponible para Arriendo',
    classes: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  },
  Arrendada: {
    label: 'Actualmente Arrendada',
    classes: 'text-red-400 bg-red-400/10 border-red-400/30',
  },
  'Mantención': {
    label: 'En Mantención',
    classes: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  },
};

export default async function MachinePage({ params }: Props) {
  let machine;
  try {
    machine = await getMachine(params.id);
  } catch {
    notFound();
  }

  const status = statusConfig[machine.status];
  const isAvailable = machine.status === 'Disponible';

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/#equipos"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-400 transition-colors mb-10 text-sm font-medium"
        >
          ← Volver al catálogo
        </Link>

        <div className="grid lg:grid-cols-2 gap-14">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative h-80 lg:h-[420px] rounded-xl overflow-hidden bg-slate-800">
              <Image
                src={machine.imageUrls?.[0] ?? '/placeholder-machine.jpg'}
                alt={machine.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {machine.imageUrls?.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {machine.imageUrls.slice(1, 4).map((url, i) => (
                  <div key={i} className="relative h-24 rounded-lg overflow-hidden bg-slate-800">
                    <Image
                      src={url}
                      alt={`${machine.name} imagen ${i + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {machine.category && (
              <span className="text-amber-500 text-xs font-semibold tracking-widest uppercase">
                {machine.category}
              </span>
            )}
            <h1 className="mt-2 text-3xl md:text-4xl font-black text-slate-100 leading-tight">
              {machine.name}
            </h1>

            <div className="mt-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${status.classes}`}>
                {status.label}
              </span>
            </div>

            <div className="mt-7 bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Descripción Técnica
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                {machine.technicalDescription}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {isAvailable && (
                <Link
                  href="/#contacto"
                  className="flex items-center justify-center w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-4 px-6 rounded-xl font-bold text-base transition-all hover:shadow-2xl hover:shadow-amber-500/20"
                >
                  Cotizar Arriendo
                </Link>
              )}
              <a
                href="tel:+56977530275"
                className="flex items-center justify-center w-full border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 py-4 px-6 rounded-xl font-semibold text-base transition-all"
              >
                Llamar: +56 9 77530275
              </a>
              <a
                href="mailto:fyd.equipo@gmail.com"
                className="flex items-center justify-center w-full border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 py-3 px-6 rounded-xl font-medium text-sm transition-all"
              >
                fyd.equipo@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
