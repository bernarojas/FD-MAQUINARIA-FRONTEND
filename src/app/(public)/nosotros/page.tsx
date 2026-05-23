import type { Metadata } from 'next';
import PageTracker from '@/components/PageTracker';

export const metadata: Metadata = {
  title: 'Nosotros | F&D Equipos',
  description: 'Empresa especializada en arriendo de máquinas de termofusión HDPE en Calama. Conoce quiénes somos, nuestra ubicación y cómo trabajamos.',
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 bg-white">
      <PageTracker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-14 text-center">
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">Quiénes somos</span>
          <h1 className="mt-3 text-3xl md:text-4xl font-black text-slate-900">F&D Equipos SpA</h1>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Empresa con base en Calama especializada en el arriendo de equipos de termofusión para cañerías HDPE,
            orientada a proyectos mineros, sanitarios y de obras civiles en la Región de Antofagasta.
          </p>
        </div>

        {/* Tarjetas de valor */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: (
                <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              ),
              title: 'Equipos certificados',
              description: 'Máquinas de termofusión de marcas reconocidas, en óptimo estado y mantenidas regularmente.',
            },
            {
              icon: (
                <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Respuesta rápida',
              description: 'Atención ágil para proyectos con plazos ajustados. Coordinamos entrega y retiro según su cronograma.',
            },
            {
              icon: (
                <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="bg-white border border-slate-200 rounded-2xl px-6 py-7 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-base mb-1">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mapa */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <svg className="h-5 w-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <div>
              <p className="text-slate-900 font-semibold text-sm">Antofagasta #3350, Calama</p>
              <p className="text-slate-400 text-xs">Región de Antofagasta, Chile</p>
            </div>
            <a
              href="https://maps.google.com/?q=Antofagasta+3350+Calama+Chile"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors shrink-0"
            >
              Abrir en Maps →
            </a>
          </div>
          <div className="w-full h-64 sm:h-[420px]">
            <iframe
              title="Ubicación F&D Equipos"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d920.4470029326089!2d-68.9429292494807!3d-22.460919897060485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96ac09a545118067%3A0x8075c81d399b468!2sAntofagasta%203350%2C%201391274%20Calama%2C%20Antofagasta!5e0!3m2!1ses!2scl!4v1779553377440!5m2!1ses!2scl"
              width="100%"
              height="100%"
              style={{ border: 0 }}
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
