import { getMachines } from '@/lib/api';
import MachineCard from './MachineCard';

export default async function MachineGrid() {
  let machines = [];

  try {
    machines = await getMachines();
  } catch {
    // API no disponible aún
  }

  if (!machines.length) {
    return (
      <div className="text-center py-24 border border-dashed border-slate-700 rounded-xl">
        <p className="text-slate-500 text-lg font-medium">Catálogo en actualización.</p>
        <p className="text-slate-600 mt-2 text-sm">
          Contáctenos directamente para conocer disponibilidad de equipos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {machines.map((machine) => (
        <MachineCard key={machine.id} machine={machine} />
      ))}
    </div>
  );
}
