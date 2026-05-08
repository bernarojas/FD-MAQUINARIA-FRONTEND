export default function StatsSection() {
  const stats = [
    { value: 'HDPE', label: 'Especialistas en Termofusión' },
    { value: '315mm', label: 'Diámetro máximo de soldadura' },
    { value: 'Calama', label: 'Base de Operaciones' },
    { value: '24/7', label: 'Disponibilidad de Contacto' },
  ];

  return (
    <section id="nosotros" className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-blue-700">{stat.value}</div>
              <div className="mt-2 text-slate-500 text-xs font-medium leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-10 border-t border-slate-200 max-w-3xl mx-auto text-center">
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            F&D Equipos SpA surge del conocimiento adquirido como trabajadores en la gran minería
            del norte del país. Entendemos las necesidades del terreno y brindamos equipos
            confiables para que sus proyectos avancen sin interrupciones.
          </p>
        </div>
      </div>
    </section>
  );
}
