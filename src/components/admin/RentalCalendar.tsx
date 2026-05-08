'use client';

import { useState, useEffect } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { es } from 'react-day-picker/locale';
import type { Machine } from '@/types/machine';
import type { RentalPeriod, CreateRentalPayload } from '@/types/rental';
import { getRentalPeriods, createRentalPeriod, deleteRentalPeriod } from '@/lib/api';

function getToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? match[1] : '';
}

function buildBlockedDates(periods: RentalPeriod[]): Date[] {
  const dates: Date[] = [];
  for (const p of periods) {
    const cur = new Date(p.startDate + 'T12:00:00');
    const end = new Date(p.endDate + 'T12:00:00');
    while (cur <= end) {
      dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
  }
  return dates;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fmtDate(str: string): string {
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

const inputCls = 'w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors text-sm';
const labelCls = 'block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5';

export default function RentalCalendar({ machines }: { machines: Machine[] }) {
  const [machineId, setMachineId]   = useState(machines[0]?.id ?? '');
  const [periods, setPeriods]       = useState<RentalPeriod[]>([]);
  const [range, setRange]           = useState<DateRange | undefined>();
  const [company, setCompany]       = useState('');
  const [notes, setNotes]           = useState('');
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError]           = useState('');
  const [rangeError, setRangeError] = useState('');

  useEffect(() => {
    if (!machineId) return;
    getRentalPeriods(machineId).then(setPeriods);
  }, [machineId]);

  const blockedDates = buildBlockedDates(periods);
  const machineName  = machines.find((m) => m.id === machineId)?.name ?? '';

  async function handleSave() {
    if (!range?.from || !range?.to) { setError('Selecciona el rango de fechas en el calendario'); return; }
    if (!company.trim()) { setError('Ingresa el nombre de la empresa'); return; }
    setError('');
    setSaving(true);
    try {
      const payload: CreateRentalPayload = {
        machineId,
        companyName: company.trim(),
        startDate: toDateStr(range.from),
        endDate: toDateStr(range.to),
        notes: notes.trim() || undefined,
      };
      const created = await createRentalPeriod(payload, getToken());
      setPeriods((prev) => [...prev, created]);
      setRange(undefined);
      setCompany('');
      setNotes('');
    } catch {
      setError('Error al guardar el período. Intente nuevamente.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este período de arriendo?')) return;
    setDeletingId(id);
    try {
      await deleteRentalPeriod(id, getToken());
      setPeriods((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  }

  function handleRangeSelect(newRange: DateRange | undefined) {
    setRangeError('');
    if (!newRange?.from || !newRange?.to) { setRange(newRange); return; }
    const blockedSet = new Set(blockedDates.map((d) => d.toDateString()));
    const cur = new Date(newRange.from);
    while (cur <= newRange.to) {
      if (blockedSet.has(cur.toDateString())) {
        setRange(undefined);
        setRangeError('El rango incluye fechas ya arrendadas. Elige otro período.');
        return;
      }
      cur.setDate(cur.getDate() + 1);
    }
    setRange(newRange);
  }

  return (
    <div>
      {/* Machine selector */}
      <div className="mb-6">
        <label className={labelCls}>Equipo</label>
        <select
          value={machineId}
          onChange={(e) => { setMachineId(e.target.value); setRange(undefined); }}
          className={inputCls}
        >
          {machines.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Calendar */}
        <div className="rdp-light order-2 lg:order-1">
          <DayPicker
            locale={es}
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            showOutsideDays={false}
            disabled={blockedDates}
            modifiers={{ booked: blockedDates }}
            modifiersStyles={{
              booked: {
                color: '#ef4444',
                backgroundColor: 'rgba(239,68,68,0.12)',
                textDecoration: 'line-through',
                borderRadius: '50%',
                opacity: 1,
              },
            }}
          />
          {range?.from && (
            <p className="text-xs text-blue-600 font-medium mt-2">
              {fmtDate(toDateStr(range.from))}
              {range.to && range.to !== range.from ? ` → ${fmtDate(toDateStr(range.to))}` : ''}
            </p>
          )}
          {rangeError && (
            <p className="text-red-600 text-xs mt-2">{rangeError}</p>
          )}
        </div>

        {/* Form + list */}
        <div className="space-y-5 order-1 lg:order-2">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Bloquear período
            </p>

            <div>
              <label className={labelCls}>Empresa *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nombre de la empresa"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Notas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Observaciones opcionales..."
                className={`${inputCls} resize-none`}
              />
            </div>

            {range?.from ? (
              <p className="text-xs text-blue-600 font-medium">
                Fechas: {fmtDate(toDateStr(range.from))}
                {range.to && range.to !== range.from ? ` → ${fmtDate(toDateStr(range.to))}` : ' (selecciona fecha de término)'}
              </p>
            ) : (
              <p className="text-xs text-slate-400">Selecciona el rango de fechas en el calendario</p>
            )}

            {error && <p className="text-red-600 text-xs">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
            >
              {saving ? 'Guardando...' : 'Bloquear fechas'}
            </button>
          </div>

          {/* Existing periods */}
          {periods.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Períodos registrados — {machineName}
              </p>
              <div className="space-y-2">
                {periods.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 gap-4 shadow-sm">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{p.companyName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {fmtDate(p.startDate)} → {fmtDate(p.endDate)}
                      </p>
                      {p.notes && <p className="text-xs text-slate-400 mt-0.5 truncate">{p.notes}</p>}
                    </div>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="text-slate-400 hover:text-red-600 transition-colors text-xs shrink-0 disabled:opacity-40"
                    >
                      {deletingId === p.id ? '...' : 'Eliminar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {periods.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">
              No hay períodos registrados para este equipo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
