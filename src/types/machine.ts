export type MachineStatus = 'Disponible' | 'Arrendada' | 'Mantención';

export interface Machine {
  id: string;
  name: string;
  technicalDescription: string;
  status: MachineStatus;
  imageUrls: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
}
