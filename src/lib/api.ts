import type { Machine, MachineStatus } from '@/types/machine';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ── Public ──────────────────────────────────────────────────────────────────

export async function getMachines(status?: string): Promise<Machine[]> {
  const url = status ? `${API_URL}/machines?status=${status}` : `${API_URL}/machines`;
  const res = await fetch(url, { next: { revalidate: 60 } });
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
  technicalDescription: string;
  status: MachineStatus;
  category?: string;
  imageUrls?: string[];
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
