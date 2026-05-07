import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import PageTracker from '@/components/PageTracker';

export const metadata: Metadata = {
  title: 'Arriendo Máquinas Termofusión HDPE en Calama | F&D Equipos',
  description:
    'F&D Equipos SpA arrienda máquinas de termofusión para cañerías HDPE en Calama. PT 315 Tecnodue y Soldadora Cuña WGW 300 para proyectos mineros y obras civiles en la Región de Antofagasta.',
};

export default function HomePage() {
  return (
    <>
      <PageTracker />
      <HeroSection />
      <StatsSection />
    </>
  );
}
