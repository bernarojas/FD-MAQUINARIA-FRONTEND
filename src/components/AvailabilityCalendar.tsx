'use client';

import { DayPicker } from 'react-day-picker';
import { es } from 'react-day-picker/locale';
import type { RentalPeriod } from '@/types/rental';

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

export default function AvailabilityCalendar({ periods }: { periods: RentalPeriod[] }) {
  const blocked = buildBlockedDates(periods);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm rdp-light">
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
        Disponibilidad
      </h2>

      <DayPicker
        locale={es}
        numberOfMonths={2}
        pagedNavigation
        showOutsideDays={false}
        modifiers={{ booked: blocked }}
        modifiersStyles={{
          booked: {
            color: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.12)',
            textDecoration: 'line-through',
            borderRadius: '50%',
          },
        }}
      />

      <div className="mt-3 flex items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-200" />
          Arrendado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-200" />
          Disponible
        </span>
      </div>
    </div>
  );
}
