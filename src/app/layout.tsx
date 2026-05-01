import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | F&D Equipos · Termofusión Calama',
    default: 'F&D Equipos | Arriendo Máquinas Termofusión Calama',
  },
  description:
    'F&D Equipos SpA arrienda máquinas de termofusión para cañerías HDPE en Calama. Termofusionadora PT 315 Tecnodue y Soldadora Cuña WGW 300 disponibles para la industria minera y obras civiles.',
  keywords: [
    'arriendo termofusionadora Calama',
    'máquinas termofusión HDPE Calama',
    'arriendo PT 315 Tecnodue',
    'soldadora geomembrana Calama',
    'termofusión cañerías HDPE minería',
    'arriendo equipos termofusión Antofagasta',
    'F&D Equipos Calama',
    'soldadura HDPE norte Chile',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: 'F&D Equipos SpA',
    title: 'F&D Equipos | Arriendo Máquinas Termofusión Calama',
    description:
      'Arriendo de máquinas de termofusión para cañerías HDPE en Calama. PT 315 Tecnodue y Soldadora Cuña WGW 300 para industria minera.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
