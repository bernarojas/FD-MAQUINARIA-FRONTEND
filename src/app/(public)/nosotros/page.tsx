import type { Metadata } from 'next';
import PageTracker from '@/components/PageTracker';

export const metadata: Metadata = {
  title: 'Nosotros | F&D Equipos',
  description: 'Empresa especializada en arriendo de máquinas de termofusión HDPE en Calama. Conoce quiénes somos, nuestra ubicación y cómo trabajamos.',
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen pt-24 pb-24">
      <PageTracker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-14 text-center">
          <span className="text-amber-500 text-sm font-semibold tracking-widest uppercase">Quiénes somos</span>
          <h1 className="mt-3 text-3xl md:text-4xl font-black text-slate-100">F&D Equipos SpA</h1>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Empresa con base en Calama especializada en el arriendo de equipos de termofusión para cañerías HDPE,
            orientada a proyectos mineros, sanitarios y de obras civiles en la Región de Antofagasta.
          </p>
        </div>

        {/* Tarjetas de valor */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: (
                <svg className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              ),
              title: 'Equipos certificados',
              description: 'Máquinas de termofusión de marcas reconocidas, en óptimo estado y mantenidas regularmente.',
            },
            {
              icon: (
                <svg className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Respuesta rápida',
              description: 'Atención ágil para proyectos con plazos ajustados. Coordinamos entrega y retiro según su cronograma.',
            },
            {
              icon: (
                <svg className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              ),
              title: 'Base en Calama',
              description: 'Ubicados en Antofagasta #3350, Calama. Servicio local con conocimiento del entorno minero del norte de Chile.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl px-6 py-7 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="text-slate-100 font-bold text-base mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mapa */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
            <svg className="h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <div>
              <p className="text-slate-100 font-semibold text-sm">Antofagasta #3350, Calama</p>
              <p className="text-slate-500 text-xs">Región de Antofagasta, Chile</p>
            </div>
            <a
              href="https://maps.google.com/?q=Antofagasta+3350+Calama+Chile"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-amber-500 hover:text-amber-400 text-xs font-semibold transition-colors shrink-0"
            >
              Abrir en Maps →
            </a>
          </div>
          <div className="w-full h-[420px]">
            <iframe
              title="Ubicación F&D Equipos"
              src="https://maps.google.com/maps?q=Antofagasta+3350+Calama+Chile&output=embed&z=16"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
