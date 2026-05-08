import AdminNavbar from '@/components/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />
      {children}
    </div>
  );
}
