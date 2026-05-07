'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Machine, MachineStatus } from '@/types/machine';

const statusConfig: Record<MachineStatus, { label: string; classes: string; dot: string }> = {
  Disponible: {
    label: 'Disponible',
    classes: 'text-emerald-400 bg-slate-950/80 border-emerald-500/50',
    dot: 'bg-emerald-400',
  },
  Arrendada: {
    label: 'Arrendada',
    classes: 'text-red-400 bg-slate-950/80 border-red-500/50',
    dot: 'bg-red-400',
  },
  'Mantención': {
    label: 'En Mantención',
    classes: 'text-amber-400 bg-slate-950/80 border-amber-500/50',
    dot: 'bg-amber-400',
  },
};

export default function MachineCard({ machine }: { machine: Machine }) {
  const router = useRouter();
  const status = statusConfig[machine.status];
  const imageUrl = machine.imageUrls?.[0] ?? '/placeholder-machine.jpg';
  const isAvailable = machine.status === 'Disponible';

  return (
    <article
      onClick={() => router.push(`/equipos/${machine.id}`)}
      className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col cursor-pointer h-full"
    >
        {/* Image */}
        <div className="relative h-80 overflow-hidden bg-slate-800 shrink-0">
          <Image
            src={imageUrl}
            alt={machine.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${status.classes}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${isAvailable ? 'animate-pulse' : ''}`} />
              {status.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {machine.category && (
            <span className="text-xs text-amber-500 font-semibold tracking-widest uppercase">
              {machine.category}
            </span>
          )}
          <h3 className="mt-1 text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
            {machine.name}
          </h3>
          <p className="mt-2 text-sm text-slate-400 line-clamp-3 leading-relaxed flex-1">
            {machine.shortDescription || machine.technicalDescription}
          </p>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-amber-500 group-hover:text-amber-400 transition-colors shrink-0">
              Ver ficha →
            </span>
            {isAvailable ? (
              <Link
                href={`/contacto?equipo=${encodeURIComponent(machine.name)}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm px-4 py-2 rounded font-semibold shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
              >
                Cotizar
              </Link>
            ) : (
              <span className="text-sm px-4 py-2 rounded font-semibold shrink-0 bg-slate-800 text-slate-600">
                No disponible
              </span>
            )}
          </div>
        </div>
    </article>
  );
}
