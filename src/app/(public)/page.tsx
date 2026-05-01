import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import MachineGrid from '@/components/MachineGrid';
import ContactSection from '@/components/ContactSection';

export const metadata: Metadata = {
  title: 'Arriendo Máquinas Termofusión HDPE en Calama | F&D Equipos',
  description:
    'F&D Equipos SpA arrienda máquinas de termofusión para cañerías HDPE en Calama. PT 315 Tecnodue y Soldadora Cuña WGW 300 para proyectos mineros y obras civiles en la Región de Antofagasta.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />

      <section id="equipos" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <span className="text-amber-500 text-sm font-semibold tracking-widest uppercase">
              Catálogo de Equipos
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-100">
              Equipos Disponibles para Arriendo
            </h2>
            <p className="mt-4 text-slate-400 max-w-2xl leading-relaxed">
              Máquinas de termofusión de alta tecnología para cañerías HDPE, geomembranas
              y tuberías PP-R. Ideales para proyectos mineros y obras civiles en el norte de Chile.
            </p>
          </div>
          <MachineGrid />
        </div>
      </section>

      <ContactSection />
    </>
  );
}
