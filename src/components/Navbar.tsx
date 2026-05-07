'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-black text-amber-500 tracking-tight">F&D Equipos</span>
            <span className="hidden sm:block text-xs text-slate-500 font-medium border-l border-slate-700 pl-3 uppercase tracking-wider">
              Termofusión HDPE
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/equipos', label: 'Equipos' },
              { href: '/nosotros', label: 'Nosotros' },
              { href: '/contacto', label: 'Contacto' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-amber-400 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-slate-400 hover:text-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-2">
          {[
            { href: '/', label: 'Inicio' },
            { href: '/equipos', label: 'Equipos' },
            { href: '/nosotros', label: 'Nosotros' },
            { href: '/contacto', label: 'Contacto' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-slate-300 hover:text-amber-400 py-2.5 text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
