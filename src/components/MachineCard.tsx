'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Machine, MachineStatus } from '@/types/machine';

const statusConfig: Record<MachineStatus, { label: string; classes: string; dot: string }> = {
  Disponible: {
    label: 'Disponible',
    classes: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Arrendada: {
    label: 'Arrendada',
    classes: 'text-red-700 bg-red-50 border-red-200',
    dot: 'bg-red-500',
  },
  'Mantención': {
    label: 'En Mantención',
    classes: 'text-amber-700 bg-amber-50 border-amber-200',
    dot: 'bg-amber-500',
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
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col cursor-pointer h-full"
    >
        {/* Image */}
        <div className="relative h-80 overflow-hidden bg-slate-100 shrink-0">
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
            <span className="text-xs text-blue-600 font-semibold tracking-widest uppercase">
              {machine.category}
            </span>
          )}
          <h3 className="mt-1 text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
            {machine.name}
          </h3>
          <p className="mt-2 text-sm text-slate-500 line-clamp-3 leading-relaxed flex-1">
            {machine.shortDescription || machine.technicalDescription}
          </p>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors shrink-0">
              Ver ficha →
            </span>
            {isAvailable ? (
              <Link
                href={`/contacto?equipo=${encodeURIComponent(machine.name)}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm px-4 py-2 rounded-lg font-semibold shrink-0 bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                Cotizar
              </Link>
            ) : (
              <span className="text-sm px-4 py-2 rounded-lg font-semibold shrink-0 bg-slate-100 text-slate-400">
                No disponible
              </span>
            )}
          </div>
        </div>
    </article>
  );
}
