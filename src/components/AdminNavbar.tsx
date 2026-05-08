'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNavbar() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = 'admin_token=; Max-Age=0; path=/';
    router.push('/admin/login');
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="text-xl font-black text-blue-700 tracking-tight">F&D Equipos</span>
            <span className="hidden sm:block text-xs text-slate-400 font-medium border-l border-slate-200 pl-3 uppercase tracking-wider">
              Administración
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              target="_blank"
              className="text-slate-500 hover:text-blue-700 transition-colors text-sm font-medium flex items-center gap-1.5"
            >
              Ver sitio
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600 transition-colors text-sm font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
