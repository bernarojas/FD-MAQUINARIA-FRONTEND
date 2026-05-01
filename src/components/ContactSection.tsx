export default function ContactSection() {
  const contacts = [
    {
      icon: (
        <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      title: 'Correo Electrónico',
      value: 'fyd.equipo@gmail.com',
      href: 'mailto:fyd.equipo@gmail.com',
      cta: 'Enviar correo',
    },
    {
      icon: (
        <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      title: 'Dirección',
      value: 'Antofagasta #3350, Calama',
      href: 'https://maps.google.com/?q=Antofagasta+3350+Calama+Chile',
      cta: 'Ver en mapa',
    },
  ];

  return (
    <section id="contacto" className="py-24 bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-500 text-sm font-semibold tracking-widest uppercase">
            Contacto
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-100">
            ¿Necesita un Equipo?
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto leading-relaxed">
            Contáctenos directamente. Le respondemos a la brevedad con disponibilidad y
            condiciones de arriendo para su empresa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {contacts.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 rounded-xl p-7 text-center transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 mb-5 group-hover:bg-amber-500/20 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-100 mb-1">{item.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{item.value}</p>
              <span className="text-amber-500 text-sm font-semibold group-hover:text-amber-400 transition-colors">
                {item.cta} →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
