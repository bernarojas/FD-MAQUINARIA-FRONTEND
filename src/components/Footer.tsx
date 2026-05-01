import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <span className="text-2xl font-black text-amber-500 tracking-tight">F&D Equipos</span>
            <p className="mt-1 text-slate-500 text-sm font-medium">Arriendo de Máquinas de Termofusión</p>
            <p className="text-slate-600 text-xs mt-1">Antofagasta #3350, Calama · Chile</p>
            <div className="mt-2 flex flex-col gap-0.5">
              <a href="tel:+56977530275" className="text-slate-600 hover:text-amber-500 text-xs transition-colors">
                +56 9 77530275
              </a>
              <a href="mailto:fyd.equipo@gmail.com" className="text-slate-600 hover:text-amber-500 text-xs transition-colors">
                fyd.equipo@gmail.com
              </a>
            </div>
          </div>

          <nav className="flex flex-wrap gap-6 text-sm">
            {[
              { href: '#equipos', label: 'Equipos' },
              { href: '#nosotros', label: 'Nosotros' },
              { href: '#contacto', label: 'Contacto' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-500 hover:text-amber-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/80">
          <p className="text-slate-700 text-xs text-center">
            © {year} F&D Equipos SpA · Arriendo de Máquinas de Termofusión · Calama, Chile
          </p>
        </div>
      </div>
    </footer>
  );
}
