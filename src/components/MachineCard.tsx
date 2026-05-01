import Image from 'next/image';
import Link from 'next/link';
import type { Machine, MachineStatus } from '@/types/machine';

const statusConfig: Record<MachineStatus, { label: string; classes: string; dot: string }> = {
  Disponible: {
    label: 'Disponible',
    classes: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
  Arrendada: {
    label: 'Arrendada',
    classes: 'text-red-400 bg-red-400/10 border-red-400/30',
    dot: 'bg-red-400',
  },
  'Mantención': {
    label: 'En Mantención',
    classes: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    dot: 'bg-amber-400',
  },
};

export default function MachineCard({ machine }: { machine: Machine }) {
  const status = statusConfig[machine.status];
  const imageUrl = machine.imageUrls?.[0] ?? '/placeholder-machine.jpg';
  const isAvailable = machine.status === 'Disponible';

  return (
    <article className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-800 shrink-0">
        <Image
          src={imageUrl}
          alt={machine.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />

        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.classes}`}>
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
          {machine.technicalDescription}
        </p>

        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <Link
            href={`/equipos/${machine.id}`}
            className="text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors shrink-0"
          >
            Ver ficha →
          </Link>
          <Link
            href={isAvailable ? '#contacto' : '#'}
            className={`text-sm px-4 py-2 rounded font-semibold transition-all shrink-0 ${
              isAvailable
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-600 pointer-events-none'
            }`}
          >
            {isAvailable ? 'Cotizar' : 'No disponible'}
          </Link>
        </div>
      </div>
    </article>
  );
}
