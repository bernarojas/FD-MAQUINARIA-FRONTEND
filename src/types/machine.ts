export type MachineStatus = 'Disponible' | 'Arrendada' | 'Mantención';

export interface MachineDocument {
  title: string;
  url: string;
}

export interface MachineSpec {
  label: string;
  value: string;
}

export interface Machine {
  id: string;
  name: string;
  shortDescription?: string;
  technicalDescription: string;
  status: MachineStatus;
  imageUrls: string[];
  category?: string;
  documents?: MachineDocument[];
  specs?: MachineSpec[];
  createdAt: string;
  updatedAt: string;
}
