import type { Metadata } from 'next';
import { Suspense } from 'react';
import ContactForm from '@/components/ContactForm';
import PageTracker from '@/components/PageTracker';

export const metadata: Metadata = {
  title: 'Contacto | F&D Equipos',
  description: 'Solicite cotización de arriendo de máquinas de termofusión en Calama. Contáctenos por teléfono, correo o complete el formulario.',
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50">
      <PageTracker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">Contacto</span>
          <h1 className="mt-3 text-3xl md:text-4xl font-black text-slate-900">¿Necesita un Equipo?</h1>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto leading-relaxed">
            Complete el formulario o contáctenos directamente. Le respondemos a la brevedad con disponibilidad y condiciones de arriendo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Formulario */}
          <Suspense fallback={<div className="bg-white border border-slate-200 rounded-2xl p-8 h-96 animate-pulse" />}>
            <ContactForm />
          </Suspense>

          {/* Datos de contacto */}
          <div className="space-y-4">
            {[
              {
                icon: (
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                ),
                title: 'Teléfono',
                value: '+56 9 77530275 · +56 9 68129593',
                href: 'tel:+56977530275',
                cta: 'Llamar ahora',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                ),
                title: 'WhatsApp',
                value: '+56 9 77530275',
                href: 'https://wa.me/56977530275?text=Hola%2C%20me%20gustar%C3%ADa%20cotizar%20un%20equipo.',
                cta: 'Enviar mensaje',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                ),
                title: 'Correo Electrónico',
                value: 'fyd.equipo@gmail.com',
                href: 'mailto:fyd.equipo@gmail.com',
                cta: 'Enviar correo',
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl px-6 py-5 transition-all shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-0.5">{item.title}</p>
                  <p className="text-slate-800 text-sm font-medium truncate">{item.value}</p>
                </div>
                <span className="text-blue-600 text-sm font-semibold group-hover:text-blue-700 transition-colors shrink-0">
                  {item.cta} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
