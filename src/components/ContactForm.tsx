'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { submitContact } from '@/lib/api';

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [name, setName]                   = useState('');
  const [company, setCompany]             = useState('');
  const [phone, setPhone]                 = useState('');
  const [email, setEmail]                 = useState('');
  const [machineInterest, setMachine]     = useState('');
  const [message, setMessage]             = useState('');

  useEffect(() => {
    const equipo = searchParams.get('equipo');
    if (equipo) setMachine(equipo);
  }, [searchParams]);
  const [loading, setLoading]             = useState(false);
  const [success, setSuccess]             = useState(false);
  const [error, setError]                 = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await submitContact({
        name, company, phone, email,
        machineInterest: machineInterest || undefined,
        message: message || undefined,
      });
      setSuccess(true);
    } catch {
      setError('Hubo un problema al enviar su solicitud. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">¡Solicitud enviada!</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Hemos recibido su consulta. Nos pondremos en contacto con usted a la brevedad.
        </p>
      </div>
    );
  }

  const inputClass = "w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors text-sm";
  const labelClass = "block text-xs font-semibold text-slate-700 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5 shadow-sm">
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-1">Solicitar cotización</h3>
        <p className="text-slate-500 text-sm">Complete el formulario y le contactaremos a la brevedad.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Nombre *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Juan Pérez" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Empresa *</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="Minera Los Pelambres" className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Teléfono *</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+56 9 12345678" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Correo electrónico *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="juan@empresa.cl" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Equipo de interés</label>
        <input type="text" value={machineInterest} onChange={(e) => setMachine(e.target.value)} placeholder="Ej: Termofusionadora PT 315, Soldadora WGW 300..." className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Mensaje</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Descripción del proyecto, fechas, cantidad de equipos, etc." className={`${inputClass} resize-none`} />
      </div>

      {error && (
        <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-base transition-all hover:shadow-xl hover:shadow-orange-500/20"
      >
        {loading ? 'Enviando...' : 'Enviar solicitud'}
      </button>

      <p className="text-slate-400 text-xs text-center">
        También puede contactarnos directamente por teléfono o WhatsApp.
      </p>
    </form>
  );
}
