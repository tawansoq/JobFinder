import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'หน้าหลัก' },
  { to: '/search', label: 'ค้นหาผู้สมัคร' },
  { to: '/pipeline', label: 'ติดตามสถานะ' },
];

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // สามารถเคลียร์สถานะหรือ Token ตรงนี้ได้ เช่น localStorage.clear();
    navigate('/'); // พาผู้ใช้งานกลับไปที่หน้า Login
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-800">
      <header className="flex items-center justify-between bg-brand-soft px-6 py-2">
        <div>
          <div className="text-2xl font-semibold leading-none">Manpower</div>
          <div className="text-xs">Recruitment &amp; HR Management System</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">สวัสดี</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-white/80 hover:bg-white text-slate-700 hover:text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm border border-slate-200 cursor-pointer"
            title="ออกจากระบบ"
          >
            <LogOut size={14} /> ออกจากระบบ
          </button>
        </div>
      </header>
      <div className="flex">
        <nav className="hidden min-h-[calc(100vh-56px)] w-52 shrink-0 flex-col gap-1 bg-white p-3 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? 'bg-blue-100 font-semibold text-brand' : 'hover:bg-slate-100'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}