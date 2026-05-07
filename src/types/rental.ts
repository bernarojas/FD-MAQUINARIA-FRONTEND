export interface RentalPeriod {
  id: string;
  machineId: string;
  companyName: string;
  startDate: string;
  endDate: string;
  notes?: string | null;
  createdAt: string;
}

export interface CreateRentalPayload {
  machineId: string;
  companyName: string;
  startDate: string;
  endDate: string;
  notes?: string;
}
