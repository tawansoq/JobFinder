import { Outlet, useNavigate, useLocation, NavLink, Navigate, Link } from 'react-router-dom';
import { useAuth, homeForRole, roleLabel } from '../context/AuthContext';
import Brand from './Brand';

export function Protected({ role, children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (role && user.role !== role) return <Navigate to={homeForRole(user.role)} replace />;
  return children;
}

export function AppShell({ role }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const candidate = [['/jobs', 'ค้นหางาน', '⌕'], ['/matching', 'งานที่เหมาะกับฉัน', '✦'], ['/saved', 'งานที่บันทึก', '♡'], ['/applications', 'ติดตามใบสมัคร', '▤'], ['/profile', 'ประวัติของฉัน', '♙'], ['/community', 'ชุมชน', '▧']];
  const company = [['/company', 'ภาพรวม', '⌂'], ['/company/profile', 'ข้อมูลบริษัท', '▣'], ['/company/jobs', 'ประกาศงานของฉัน', '▤'], ['/company/pipeline', 'ติดตามผู้สมัคร', '⇢'], ['/company/board', 'บอร์ดผู้สมัคร', '▦'], ['/company/report', 'รายงาน', '▥']];
  const recruiter = [['/recruiter', 'ภาพรวม', '⌂'], ['/recruiter/candidates', 'ค้นหาผู้สมัคร', '⌕'], ['/recruiter/interested', 'ผู้สมัครที่สนใจ', '♡'], ['/recruiter/board', 'บอร์ดผู้สมัคร', '▦'], ['/recruiter/submissions', 'ส่งข้อมูลผู้สมัคร', '⇢'], ['/recruiter/report', 'รายงาน', '▥']];
  const items = role === 'company' ? company : role === 'recruiter' ? recruiter : candidate;
  
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="side-label">เมนูหลัก</div>
        <nav>
          {items.map(([to, label, icon]) => (
            <NavLink end key={to} to={to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-box">
            <span>✦</span>
            <b>{role === 'company' || role === 'recruiter' ? 'หาคนที่ใช่ให้ทีม' : 'พร้อมสำหรับโอกาสใหม่?'}</b>
            <p>{role === 'company' || role === 'recruiter' ? 'ค้นหาและคัดเลือกผู้สมัคร' : 'อัปเดตโปรไฟล์เพื่อเพิ่มโอกาส'}</p>
            <Link to={role === 'company' ? '/company/jobs/new' : role === 'recruiter' ? '/recruiter/candidates' : '/profile'}>
              {role === 'company' ? 'ลงประกาศงาน' : role === 'recruiter' ? 'ค้นหาผู้สมัคร' : 'แก้ไขโปรไฟล์'} →
            </Link>
          </div>
          <button className="side-link logout" onClick={() => { logout(); nav('/login', { replace: true }) }}>
            <span className="nav-icon">↪</span>ออกจากระบบ
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="mobile-logo"><Brand small /></div>
          <div className="topbar-spacer" />
          <span className="online-dot" />
          <span className="topbar-caption">{role === 'company' ? 'พื้นที่บริษัท' : role === 'recruiter' ? 'พื้นที่ผู้สรรหา' : 'พื้นที่ผู้สมัคร'}</span>
          <div className="user-avatar">{(user?.name || user?.company || 'U').charAt(0).toUpperCase()}</div>
          <div className="user-meta"><b>{user?.name || user?.company || 'ผู้ใช้งาน'}</b><small>{roleLabel(role)}</small></div>
        </header>
        <main className="page-content"><Outlet /></main>
        <footer className="footer">Jobfinder <span>·</span> ค้นหาโอกาสที่เหมาะกับคุณ</footer>
      </div>
    </div>
  );
}

export function PageTitle({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, sub, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>
    </div>
  );
}

export function Empty({ icon = '✦', title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3><p>{text}</p>{action}
    </div>
  );
}