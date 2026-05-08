import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Blue gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }}
      />

      {/* Vertical accent line */}
      <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-transparent via-orange-400 to-transparent opacity-70" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-24 sm:pb-10">
        {/* Location badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-10">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-blue-100 text-sm font-medium tracking-wide">
            Calama · Región de Antofagasta · Chile
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
          Arriendo de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
            Máquinas de
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
            Termofusión
          </span>{' '}
          HDPE
        </h1>

        <p className="mt-8 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Especializados en arriendo de equipos de termofusión para cañerías HDPE,
          geomembranas y obras civiles en la industria minera del norte de Chile.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          {['PT 315 Tecnodue', 'Soldadora Cuña WGW 300', 'Geomembrana HDPE', 'Tuberías PP-R'].map((tag) => (
            <span
              key={tag}
              className="bg-white/10 border border-white/20 text-blue-100 px-3 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/equipos"
            className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-lg font-bold text-base transition-all hover:shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
          >
            Ver Equipos Disponibles
          </Link>
          <Link
            href="/contacto"
            className="border border-white/40 hover:border-white/80 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-bold text-base transition-all"
          >
            Contactar Ahora
          </Link>
        </div>

        {/* Quick stats */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-md mx-auto">
          {[
            { value: 'HDPE', label: 'Especialistas' },
            { value: '24/7', label: 'Disponibilidad' },
            { value: 'Calama', label: 'Cobertura Regional' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-orange-400">{stat.value}</div>
              <div className="text-xs text-blue-200 mt-1.5 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2.5">
          <div className="w-1 h-2.5 bg-orange-400 rounded-full" />
        </div>
      </div>
    </section>
  );
}
