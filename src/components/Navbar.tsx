'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-black text-blue-700 tracking-tight">F&D Equipos</span>
            <span className="hidden sm:block text-xs text-slate-400 font-medium border-l border-slate-200 pl-3 uppercase tracking-wider">
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
                className="text-slate-600 hover:text-blue-700 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-slate-600 hover:text-slate-900 transition-colors"
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
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1">
          {[
            { href: '/', label: 'Inicio' },
            { href: '/equipos', label: 'Equipos' },
            { href: '/nosotros', label: 'Nosotros' },
            { href: '/contacto', label: 'Contacto' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-slate-700 hover:text-blue-700 hover:bg-blue-50 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
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
