import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getMachine, getMachines, getRentalPeriods } from '@/lib/api';
import type { MachineStatus } from '@/types/machine';
import MachineGallery from '@/components/MachineGallery';
import PageTracker from '@/components/PageTracker';

const AvailabilityCalendar = dynamic(() => import('@/components/AvailabilityCalendar'), { ssr: false });

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const machine = await getMachine(params.id);
    return {
      title: machine.name,
      description: (machine.shortDescription || machine.technicalDescription).slice(0, 155),
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
    classes: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  Arrendada: {
    label: 'Actualmente Arrendada',
    classes: 'text-red-700 bg-red-50 border-red-200',
  },
  'Mantención': {
    label: 'En Mantención',
    classes: 'text-amber-700 bg-amber-50 border-amber-200',
  },
};

const cardStatusConfig: Record<MachineStatus, { label: string; classes: string; dot: string }> = {
  Disponible: { label: 'Disponible', classes: 'text-emerald-700 bg-white/90 border-emerald-200', dot: 'bg-emerald-500' },
  Arrendada:  { label: 'Arrendada',  classes: 'text-red-700 bg-white/90 border-red-200',        dot: 'bg-red-500' },
  'Mantención': { label: 'En Mantención', classes: 'text-amber-700 bg-white/90 border-amber-200', dot: 'bg-amber-500' },
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

  let related: Awaited<ReturnType<typeof getMachines>> = [];
  try {
    const all = await getMachines();
    related = all.filter((m) => m.id !== params.id).slice(0, 3);
  } catch {}

  const rentalPeriods = await getRentalPeriods(params.id).catch(() => []);

  return (
    <div className="min-h-screen pt-24 pb-24 bg-white">
      <PageTracker />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/equipos"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-10 text-sm font-medium"
        >
          ← Volver al catálogo
        </Link>

        <div className="grid lg:grid-cols-2 gap-14">
          {/* Images */}
          <MachineGallery images={machine.imageUrls ?? []} name={machine.name} />

          {/* Info */}
          <div>
            {machine.category && (
              <span className="text-blue-600 text-xs font-semibold tracking-widest uppercase">
                {machine.category}
              </span>
            )}
            <h1 className="mt-2 text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              {machine.name}
            </h1>

            <div className="mt-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${status.classes}`}>
                {status.label}
              </span>
            </div>

            {machine.shortDescription && (
              <p className="mt-5 text-slate-600 leading-relaxed text-base">
                {machine.shortDescription}
              </p>
            )}

            {machine.specs && machine.specs.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
                {machine.specs.map((spec, i) => (
                  <div key={i} className={`bg-white px-4 py-4 ${machine.specs.length % 2 !== 0 && i === machine.specs.length - 1 ? 'col-span-2' : ''}`}>
                    <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1">
                      {spec.label}
                    </p>
                    <p className="text-slate-900 font-black text-lg leading-none">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <a
                href={`https://wa.me/56977530275?text=${encodeURIComponent(`Hola, estoy interesado en arrendar el equipo: ${machine.name}. ¿Está disponible?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 rounded-xl font-bold text-base transition-all hover:shadow-2xl hover:shadow-green-500/20"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>

              {isAvailable && (
                <Link
                  href={`/contacto?equipo=${encodeURIComponent(machine.name)}`}
                  className="flex items-center justify-center gap-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-bold text-base transition-all hover:shadow-2xl hover:shadow-orange-500/20"
                >
                  Cotizar Arriendo
                </Link>
              )}
            </div>

            {/* Documents */}
            {machine.documents && machine.documents.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  {machine.documents.length === 1 ? 'Documento asociado al equipo' : 'Documentos asociados al equipo'}
                </h2>
                <div className="space-y-2">
                  {machine.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white border border-slate-200 hover:border-blue-300 rounded-xl px-4 py-3 transition-all group shadow-sm"
                    >
                      <div className="w-8 h-8 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        </svg>
                      </div>
                      <span className="text-slate-700 group-hover:text-blue-600 text-sm font-medium transition-colors flex-1">
                        {doc.title}
                      </span>
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Availability calendar */}
        <div className="mt-14">
          <AvailabilityCalendar periods={rentalPeriods} />
        </div>

        {/* Technical description */}
        <div className="mt-14 bg-slate-50 border border-slate-200 rounded-2xl p-8">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
            Descripción Técnica
          </h2>
          <div className="space-y-1.5">
            {machine.technicalDescription.split('\n').map((line, i) => {
              const isBullet = line.startsWith('• ');
              return isBullet ? (
                <div key={i} className="flex gap-2.5">
                  <span className="text-blue-600 text-sm leading-relaxed shrink-0">•</span>
                  <span className="text-slate-600 text-sm leading-relaxed">{line.slice(2)}</span>
                </div>
              ) : line.trim() === '' ? (
                <div key={i} className="h-2" />
              ) : (
                <p key={i} className="text-slate-600 text-sm leading-relaxed">{line}</p>
              );
            })}
          </div>
        </div>

        {/* Otros equipos */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
              Otros equipos disponibles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((m) => {
                const s = cardStatusConfig[m.status];
                const img = m.imageUrls?.[0];
                return (
                  <Link
                    key={m.id}
                    href={`/equipos/${m.id}`}
                    className="group bg-white border border-slate-200 hover:border-blue-300 rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:shadow-blue-500/10"
                  >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={m.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Sin imagen</div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${s.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${m.status === 'Disponible' ? 'animate-pulse' : ''}`} />
                          {s.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      {m.category && (
                        <span className="text-[10px] text-blue-600 font-bold tracking-widest uppercase">{m.category}</span>
                      )}
                      <h3 className="mt-1 text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                        {m.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
                        {m.shortDescription || m.technicalDescription}
                      </p>
                      <span className="mt-3 text-blue-600 text-xs font-semibold group-hover:text-blue-700 transition-colors">
                        Ver ficha →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
