'use client';

import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export default function PageTracker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    try {
      if (sessionStorage.getItem('fd_visited')) return;
      sessionStorage.setItem('fd_visited', '1');
    } catch {
      return;
    }
    fetch(`${API_URL}/stats/hit`, { method: 'POST' }).catch(() => {});
  }, []);

  return null;
}
