import type { Machine, MachineStatus, MachineSpec } from '@/types/machine';
import type { RentalPeriod, CreateRentalPayload } from '@/types/rental';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ── Public ──────────────────────────────────────────────────────────────────

export async function getMachines(status?: string): Promise<Machine[]> {
  const url = status ? `${API_URL}/machines?status=${status}` : `${API_URL}/machines`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar equipos');
  return res.json();
}

export async function getMachine(id: string): Promise<Machine> {
  const res = await fetch(`${API_URL}/machines/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Equipo no encontrado');
  return res.json();
}

// ── Admin ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<{ access_token: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Credenciales incorrectas');
  return res.json();
}

export interface MachinePayload {
  name: string;
  shortDescription?: string;
  technicalDescription: string;
  status: MachineStatus;
  category?: string;
  imageUrls?: string[];
  specs?: MachineSpec[];
  documents?: { title: string; url: string }[];
}

export async function createMachine(data: MachinePayload, token: string): Promise<Machine> {
  const res = await fetch(`${API_URL}/machines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear equipo');
  return res.json();
}

export async function updateMachine(id: string, data: Partial<MachinePayload>, token: string): Promise<Machine> {
  const res = await fetch(`${API_URL}/machines/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar equipo');
  return res.json();
}

export async function deleteMachine(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/machines/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al eliminar equipo');
}

export async function uploadImages(files: File[], token: string): Promise<{ urls: string[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const res = await fetch(`${API_URL}/upload/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Error al subir imágenes');
  return res.json();
}

export async function uploadPdf(file: File, token: string): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/upload/pdf`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Error al subir PDF');
  return res.json();
}

// ── Contact ───────────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string;
  company: string;
  phone: string;
  email: string;
  machineInterest?: string;
  message?: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  machineInterest: string | null;
  message: string | null;
  contacted: boolean;
  createdAt: string;
}

export async function submitContact(data: ContactPayload): Promise<void> {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al enviar solicitud');
}

export async function getContacts(token: string): Promise<ContactRequest[]> {
  const res = await fetch(`${API_URL}/contact`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al cargar solicitudes');
  return res.json();
}

export async function markContacted(id: string, token: string): Promise<ContactRequest> {
  const res = await fetch(`${API_URL}/contact/${id}/contacted`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al actualizar');
  return res.json();
}

export async function deleteContact(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al eliminar');
}

// ── Rentals ───────────────────────────────────────────────────────────────────

export async function getRentalPeriods(machineId: string): Promise<RentalPeriod[]> {
  const res = await fetch(`${API_URL}/rentals?machineId=${machineId}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function createRentalPeriod(data: CreateRentalPayload, token: string): Promise<RentalPeriod> {
  const res = await fetch(`${API_URL}/rentals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear período');
  return res.json();
}

export async function deleteRentalPeriod(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/rentals/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al eliminar período');
}

// ── Stats ────────────────────────────────────────────────────────────────────

export interface StatsSummary {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  last14Days: { date: string; count: number }[];
  topPages: { path: string; count: number }[];
}

export async function getStats(token: string): Promise<StatsSummary> {
  const res = await fetch(`${API_URL}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al cargar estadísticas');
  return res.json();
}
