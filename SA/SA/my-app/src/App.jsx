import { useEffect, useMemo, useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate, Link, NavLink, Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';

const AuthContext = createContext(null);
const DEMO_JOBS = [
  { id: 1, title: 'Frontend Developer', company: 'Bright Digital Co., Ltd.', location: 'กรุงเทพฯ (Hybrid)', type: 'Full-time', salary: '25,000–40,000 บาท', category: 'เทคโนโลยี', tags: ['React', 'JavaScript', 'CSS'], posted: 'วันนี้', description: 'ร่วมพัฒนาเว็บแอปพลิเคชันที่ใช้งานง่าย ทำงานร่วมกับทีม Product และ Design' },
  { id: 2, title: 'UX/UI Designer', company: 'Mellow Studio', location: 'นนทบุรี', type: 'Full-time', salary: '22,000–35,000 บาท', category: 'ออกแบบ', tags: ['Figma', 'UI Design', 'UX Research'], posted: '2 วันที่แล้ว', description: 'ออกแบบประสบการณ์ดิจิทัลที่เข้าใจผู้ใช้และทำงานร่วมกับทีมพัฒนา' },
  { id: 3, title: 'Junior Data Analyst', company: 'Northstar Analytics', location: 'กรุงเทพฯ (Hybrid)', type: 'Full-time', salary: '20,000–30,000 บาท', category: 'ข้อมูล', tags: ['SQL', 'Excel', 'Python'], posted: '3 วันที่แล้ว', description: 'วิเคราะห์ข้อมูล จัดทำรายงาน และช่วยทีมธุรกิจตัดสินใจจากข้อมูล' },
  { id: 4, title: 'Marketing Coordinator', company: 'Everyday Market', location: 'นครปฐม', type: 'Full-time', salary: '18,000–25,000 บาท', category: 'การตลาด', tags: ['Social Media', 'Content', 'Analytics'], posted: '4 วันที่แล้ว', description: 'วางแผนคอนเทนต์ ประสานงานแคมเปญ และติดตามผลการตลาด' },
  { id: 5, title: 'Backend Developer', company: 'Bright Digital Co., Ltd.', location: 'ทำงานทางไกล', type: 'Full-time', salary: '30,000–50,000 บาท', category: 'เทคโนโลยี', tags: ['Node.js', 'PostgreSQL', 'API'], posted: '5 วันที่แล้ว', description: 'ออกแบบและพัฒนา REST API รวมถึงปรับปรุงประสิทธิภาพของระบบ' }
];

const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read('jobfinder_user', null));
  const login = (u) => { setUser(u); save('jobfinder_user', u); };
  const logout = () => { setUser(null); localStorage.removeItem('jobfinder_user'); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
const useAuth = () => useContext(AuthContext);

const homeForRole = role => role === 'company' ? '/company' : role === 'recruiter' ? '/recruiter' : '/jobs';
const roleLabel = role => role === 'company' ? 'บริษัท' : role === 'recruiter' ? 'Recruiter / ผู้สรรหา' : 'ผู้สมัครงาน';

function Protected({ role, children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (role && user.role !== role) return <Navigate to={homeForRole(user.role)} replace />;
  return children;
}

function Brand({ small = false }) {
  return (
    <Link className={`brand ${small ? 'brand-small' : ''}`} to="/">
      <span className="brand-mark">J</span>
      <span>jobfinder<span className="brand-dot">.</span><small>งานที่ใช่ เริ่มต้นที่นี่</small></span>
    </Link>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-aside">
        <Brand />
        <div className="auth-message">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h1>โอกาสใหม่<br />เริ่มต้นได้ที่นี่</h1>
          <p>ค้นหางานที่ตรงกับคุณ หรือค้นหาคนที่ใช่สำหรับทีมของคุณ ในพื้นที่เดียว</p>
          <div className="auth-stats">
            <div><b>ค้นหา</b><span>งานที่เหมาะกับคุณ</span></div>
            <div><b>เชื่อมต่อ</b><span>กับโอกาสใหม่ ๆ</span></div>
          </div>
        </div>
        <div className="auth-art">
          <div className="art-card"><span>✦</span><b>Find your fit.</b><small>ก้าวต่อไปในแบบของคุณ</small></div>
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
        </div>
      </div>
      <main className="auth-main">
        {children}
        <p className="auth-foot">© 2026 Jobfinder · หางานอย่างมั่นใจ</p>
      </main>
    </div>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setError('') }, [mode, role]);

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('กรุณากรอกอีเมลและรหัสผ่านให้ครบ');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setError('กรุณากรอกชื่อที่ใช้แสดง');
      return;
    }
    if (mode === 'register' && role === 'company' && !company.trim()) {
      setError('กรุณากรอกชื่อบริษัท');
      return;
    }

    // --- ส่วนจำลองการทำงานของ Backend สำหรับทดสอบ (หลีกเลี่ยงปัญหา CORS บน Codespaces) ---
    setTimeout(() => {
      const mockSuccess = true; 

      if (mockSuccess) {
        const userData = mode === 'login'
          ? { id: Date.now(), name: email.split('@')[0], email, role: role }
          : { id: Date.now(), name: role === 'company' ? company : name, email, role };
        
        login(userData);
        nav(homeForRole(userData.role), { replace: true });
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง (Mock Error)');
      }
    }, 500); 
    // -------------------------------------------------------------------------
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="mobile-brand"><Brand /></div>
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')} type="button">เข้าสู่ระบบ</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')} type="button">สมัครสมาชิก</button>
        </div>
        <h2>{mode === 'login' ? 'ยินดีต้อนรับกลับมา' : 'สร้างบัญชี Jobfinder'}</h2>
        <p className="muted">{mode === 'login' ? 'เข้าสู่ระบบเพื่อไปต่อในพื้นที่ของคุณ' : 'เลือกประเภทบัญชีให้ตรงกับการใช้งาน'}</p>
        <div className="role-picker role-picker-three">
          <button type="button" className={role === 'candidate' ? 'chosen' : ''} onClick={() => setRole('candidate')}><span>♙</span><b>ผู้สมัครงาน</b><small>ค้นหาและสมัครงาน</small></button>
          <button type="button" className={role === 'recruiter' ? 'chosen' : ''} onClick={() => setRole('recruiter')}><span>⌕</span><b>ผู้สรรหา</b><small>ค้นหาและส่งผู้สมัคร</small></button>
          <button type="button" className={role === 'company' ? 'chosen' : ''} onClick={() => setRole('company')}><span>▦</span><b>บริษัท</b><small>ประกาศงานและจัดการทีม</small></button>
        </div>
        <form onSubmit={submit} className="form-stack">
          {mode === 'register' && <label>ชื่อที่ใช้แสดง<input value={name} onChange={e => setName(e.target.value)} placeholder={role === 'company' ? 'ชื่อผู้ติดต่อ' : 'ชื่อ-นามสกุล'} required /></label>}
          {mode === 'register' && role === 'company' && <label>ชื่อบริษัท<input value={company} onChange={e => setCompany(e.target.value)} placeholder="บริษัทของคุณ" required /></label>}
          <label>อีเมล<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" /></label>
          <label>รหัสผ่าน
            <div className="password-wrap">
              <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="กรอกรหัสผ่าน" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              <button type="button" className="show-pass" onClick={() => setShow(!show)}>{show ? 'ซ่อน' : 'แสดง'}</button>
            </div>
          </label>
          {error && <div className="notice error">{error}</div>}
          <button className="btn btn-primary btn-wide" type="submit">{mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'} <span>→</span></button>
        </form>
        <p className="auth-note">ทำงานแบบ Mock สำหรับทดสอบ Frontend (ไม่ติด CORS)</p>
      </div>
    </AuthLayout>
  );
}

function AppShell({ role }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const candidate = [['/jobs', 'ค้นหางาน', '⌕'], ['/matching', 'งานที่เหมาะกับฉัน', '✦'], ['/saved', 'งานที่บันทึก', '♡'], ['/applications', 'ติดตามใบสมัคร', '▤'], ['/profile', 'ประวัติของฉัน', '♙'], ['/community', 'ชุมชน', '▧']];
  const company = [['/company', 'ภาพรวม', '⌂'], ['/company/profile', 'ข้อมูลบริษัท', '▣'], ['/company/jobs', 'ประกาศงานของฉัน', '▤'], ['/company/candidates', 'ค้นหาผู้สมัคร', '⌕'], ['/company/pipeline', 'ติดตามผู้สมัคร', '⇢'], ['/company/board', 'บอร์ดผู้สมัคร', '▦'], ['/company/report', 'รายงาน', '▥']];
  const recruiter = [['/recruiter', 'ภาพรวม', '⌂'], ['/recruiter/candidates', 'ค้นหาผู้สมัคร', '⌕'], ['/recruiter/board', 'บอร์ดผู้สมัคร', '▦'], ['/recruiter/submissions', 'ส่งข้อมูลผู้สมัคร', '⇢'], ['/recruiter/report', 'รายงาน', '▥']];
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

function PageTitle({ eyebrow, title, description, action }) {
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

function Stat({ label, value, sub, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>
    </div>
  );
}

function JobCard({ job, saved, onSave, onApply, applied = false }) {
  return (
    <article className="job-card">
      <div className="company-logo">{job.company?.charAt(0) || 'J'}</div>
      <div className="job-main">
        <div className="job-title-row">
          <Link to={`/jobs/${job.id}`} className="job-title">{job.title}</Link>
          <button className={`save-btn ${saved ? 'is-saved' : ''}`} onClick={() => onSave(job.id)} aria-label="บันทึกงาน">
            {saved ? '♥' : '♡'}
          </button>
        </div>
        <div className="company-name">{job.company}</div>
        <div className="job-meta"><span>⌖ {job.location}</span><span>◷ {job.type}</span><span>฿ {job.salary}</span></div>
        <div className="tag-row">{(job.tags || []).map(t => <span className="tag" key={t}>{t}</span>)}</div>
      </div>
      <div className="job-action">
        <small>{job.posted}</small>
        {applied ? <span className="status-pill">สมัครแล้ว</span> : <button className="btn btn-primary btn-sm" onClick={() => onApply(job.id)}>สมัครงาน</button>}
      </div>
    </article>
  );
}

function useJobData() {
  const [jobs, setJobs] = useState(() => [...read('jobfinder_company_jobs', []), ...read('jobfinder_jobs', DEMO_JOBS)]);
  useEffect(() => {
    let active = true;
    fetch('/api/jobs').then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      if (active && Array.isArray(data) && data.length)
        setJobs([...read('jobfinder_company_jobs', []), ...data.map((j, i) => ({ ...j, id: j.id ?? i + 1, tags: j.tags || [] }))])
    }).catch(() => { });
    return () => { active = false }
  }, []);
  return jobs;
}

function JobsPage() {
  const jobs = useJobData();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('ทั้งหมด');
  const [type, setType] = useState('ทั้งหมด');
  const [saved, setSaved] = useState(() => read('jobfinder_saved', []));
  const [applied, setApplied] = useState(() => read('jobfinder_applied', []));
  const [toast, setToast] = useState('');
  
  const filtered = jobs.filter(j => 
    (`${j.title} ${j.company} ${(j.tags || []).join(' ')}`.toLowerCase().includes(query.toLowerCase())) &&
    (location === 'ทั้งหมด' || (j.location || '').includes(location)) &&
    (type === 'ทั้งหมด' || j.type === type)
  );
  
  function toggle(id) {
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
    setSaved(next);
    save('jobfinder_saved', next);
  }
  
  function apply(id) {
    if (applied.some(a => String(a.jobId) === String(id))) {
      setToast('คุณสมัครงานนี้แล้ว');
      return;
    }
    const next = [...applied, {
      id: Date.now(), jobId: id, status: 'สมัครงาน',
      reason: '', candidateName: read('jobfinder_user', {})?.name || 'ผู้สมัคร',
      candidateEmail: read('jobfinder_user', {})?.email || '',
      jobTitle: jobs.find(j => String(j.id) === String(id))?.title || '',
      company: jobs.find(j => String(j.id) === String(id))?.company || '',
      date: new Date().toISOString()
    }];
    setApplied(next);
    save('jobfinder_applied', next);
    setToast('บันทึกการสมัครแล้ว (ตัวอย่างในเบราว์เซอร์)');
  }
  
  return (
    <>
      <PageTitle eyebrow="JOB BOARD" title="ค้นหางานที่ใช่สำหรับคุณ" description="สำรวจโอกาสใหม่ ๆ และเลือกงานที่ตรงกับทักษะและเป้าหมายของคุณ" />
      <div className="welcome-banner">
        <div><span className="banner-kicker">YOUR NEXT OPPORTUNITY</span><h2>ก้าวต่อไปในเส้นทางอาชีพของคุณ</h2><p>งานที่เหมาะสม อาจอยู่ใกล้กว่าที่คิด</p></div>
        <div className="banner-art">✳</div>
      </div>
      <div className="filter-panel">
        <div className="search-field"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาตำแหน่ง บริษัท หรือทักษะ" /></div>
        <select value={location} onChange={e => setLocation(e.target.value)}>
          <option>ทั้งหมด</option><option>กรุงเทพฯ</option><option>นนทบุรี</option><option>นครปฐม</option><option>ทำงานทางไกล</option>
        </select>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option>ทั้งหมด</option><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
        </select>
      </div>
      <div className="section-head">
        <div><h2>งานที่เปิดรับสมัคร</h2><p>พบ {filtered.length} ตำแหน่งที่ตรงกับการค้นหา</p></div>
        <span className="soft-label">อัปเดตล่าสุด</span>
      </div>
      {toast && <div className="notice success">{toast}<button onClick={() => setToast('')}>ปิด</button></div>}
      <div className="job-list">
        {filtered.map(j => <JobCard key={j.id} job={j} saved={saved.includes(j.id)} onSave={toggle} onApply={apply} applied={applied.some(a => a.jobId === j.id)} />)}
        {!filtered.length && <Empty icon="⌕" title="ไม่พบงานที่ตรงกับการค้นหา" text="ลองเปลี่ยนคำค้นหาหรือตัวกรองของคุณ" />}
      </div>
    </>
  );
}

function Empty({ icon = '✦', title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3><p>{text}</p>{action}
    </div>
  );
}

function SavedPage() {
  const jobs = useJobData();
  const [saved, setSaved] = useState(() => read('jobfinder_saved', []));
  const toggle = id => { const next = saved.filter(x => x !== id); setSaved(next); save('jobfinder_saved', next); };
  const apply = id => {
    const list = read('jobfinder_applied', []);
    if (!list.some(a => a.jobId === id)) {
      const j = jobs.find(x => String(x.id) === String(id));
      const u = read('jobfinder_user', {});
      list.push({
        id: Date.now(), jobId: id, status: 'สมัครงาน', 
        reason: '', candidateName: u?.name || 'ผู้สมัคร', candidateEmail: u?.email || '',
        jobTitle: j?.title || '', company: j?.company || '', date: new Date().toISOString()
      });
      save('jobfinder_applied', list);
    }
  };
  const list = jobs.filter(j => saved.includes(j.id));
  return (
    <>
      <PageTitle eyebrow="SAVED JOBS" title="งานที่บันทึกไว้" description="รวมตำแหน่งที่คุณสนใจไว้เพื่อกลับมาดูภายหลัง" />
      {list.length ? 
        <div className="job-list">{list.map(j => <JobCard key={j.id} job={j} saved onSave={toggle} onApply={apply} applied={read('jobfinder_applied', []).some(a => a.jobId === j.id)} />)}</div> 
        : <Empty icon="♡" title="ยังไม่มีงานที่บันทึก" text="กดรูปหัวใจในงานที่สนใจ แล้วงานจะมาแสดงที่นี่" action={<Link className="btn btn-primary" to="/jobs">ค้นหางาน</Link>} />
      }
    </>
  );
}

function ApplicationsPage() {
  const jobs = useJobData();
  const { user } = useAuth();
  const [apps, setApps] = useState(() => read('jobfinder_applied', []).filter(a => !a.candidateEmail || a.candidateEmail === read('jobfinder_user', {})?.email));
  const clear = id => { const next = apps.filter(a => String(a.jobId) !== String(id)); setApps(next); save('jobfinder_applied', next); };
  const list = apps.map(a => ({ ...a, job: jobs.find(j => String(j.id) === String(a.jobId)) })).filter(a => a.job);
  return (
    <>
      <PageTitle eyebrow="MY APPLICATIONS" title="งานที่สมัครไว้" description="ติดตามรายการสมัครงานของคุณได้จากหน้านี้" />
      <div className="stats-grid">
        <Stat label="สมัครทั้งหมด" value={list.length} sub="รายการใบสมัคร" icon="▤" />
        <Stat label="รอการติดต่อ" value={list.filter(a => a.status === 'สมัครงาน').length} sub="สถานะปัจจุบัน" icon="◷" />
      </div>
      {list.length ? 
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>ตำแหน่งงาน</th><th>บริษัท</th><th>วันที่สมัคร</th><th>สถานะ</th><th></th></tr></thead>
              <tbody>
                {list.map(a => (
                  <tr key={a.jobId}>
                    <td><Link className="table-link" to={`/jobs/${a.job.id}`}>{a.job.title}</Link></td>
                    <td>{a.job.company}</td>
                    <td>{new Date(a.date).toLocaleDateString('th-TH')}</td>
                    <td><span className="status-pill">{a.status}</span>{a.reason && <small className="table-sub">เหตุผล: {a.reason}</small>}</td>
                    <td><button className="text-btn" onClick={() => clear(a.jobId)}>นำออก</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> 
        : <Empty icon="▤" title="ยังไม่มีใบสมัคร" text="เมื่อคุณสมัครงาน รายการจะปรากฏในหน้านี้" action={<Link className="btn btn-primary" to="/jobs">ค้นหางาน</Link>} />
      }
    </>
  );
}

// อัปเดต FR003: เพิ่มอัปโหลดไฟล์ Resume
function ProfilePage() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [position, setPosition] = useState(user?.position || '');
  const [location, setLocation] = useState(user?.location || 'กรุงเทพฯ');
  const [skills, setSkills] = useState(user?.skills || 'React, JavaScript, SQL');
  const [about, setAbout] = useState(user?.about || '');
  const [resume, setResume] = useState(user?.resume || null);
  const [msg, setMsg] = useState('');
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume({ name: file.name, url: URL.createObjectURL(file) });
    }
  };

  function submit(e) {
    e.preventDefault();
    const next = { ...user, name, email, phone, position, location, skills, about, resume };
    login(next);
    const users = read('jobfinder_users', []).map(u => u.email === user.email ? { ...u, ...next } : u);
    save('jobfinder_users', users);
    setMsg('บันทึกโปรไฟล์ในเบราว์เซอร์แล้ว');
  }
  
  return (
    <>
      <PageTitle eyebrow="MY PROFILE" title="โปรไฟล์ของฉัน" description="ข้อมูลที่ครบถ้วนช่วยให้คุณจัดการการสมัครงานได้สะดวกขึ้น" />
      <div className="profile-layout">
        <div className="profile-summary panel">
          <div className="profile-avatar">{(name || 'U').charAt(0).toUpperCase()}</div>
          <h2>{name || 'ชื่อผู้สมัคร'}</h2><p>{position || 'ระบุตำแหน่งที่สนใจ'}</p>
          <div className="profile-completion">
            <div><span>ข้อมูลโปรไฟล์</span><b>{Math.round([name, email, phone, position, about, resume].filter(Boolean).length * 16.6)}%</b></div>
            <div className="progress"><i style={{ width: `${[name, email, phone, position, about, resume].filter(Boolean).length * 16.6}%` }} /></div>
          </div>
        </div>
        <form className="panel profile-form form-stack" onSubmit={submit}>
          <h2>ข้อมูลส่วนตัว</h2>
          <div className="form-grid">
            <label>ชื่อ-นามสกุล<input value={name} onChange={e => setName(e.target.value)} required /></label>
            <label>อีเมล<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
            <label>เบอร์โทรศัพท์<input value={phone} onChange={e => setPhone(e.target.value)} placeholder="08x-xxx-xxxx" /></label>
            <label>ตำแหน่งที่สนใจ<input value={position} onChange={e => setPosition(e.target.value)} placeholder="เช่น Frontend Developer" /></label>
            <label>พื้นที่ที่ต้องการ
              <select value={location} onChange={e => setLocation(e.target.value)}>
                <option>กรุงเทพฯ</option><option>นนทบุรี</option><option>นครปฐม</option><option>ทำงานทางไกล</option>
              </select>
            </label>
            <label>ทักษะ (คั่นด้วยจุลภาค)<input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, SQL, Figma" /></label>
            <label className="span-two">แนะนำตัว<textarea rows="4" value={about} onChange={e => setAbout(e.target.value)} placeholder="เล่าประสบการณ์และเป้าหมายของคุณ" /></label>
            <label className="span-two">อัปโหลด Resume (PDF)
              <div className="file-upload-wrapper">
                <input type="file" accept=".pdf" onChange={handleFileUpload} />
                {resume && <span className="file-name-display" style={{marginLeft:'10px', color:'var(--brand-color)'}}>อัปโหลดแล้ว: {resume.name}</span>}
              </div>
            </label>
          </div>
          {msg && <div className="notice success">{msg}</div>}
          <div className="form-footer"><button className="btn btn-primary">บันทึกข้อมูล</button></div>
        </form>
      </div>
    </>
  );
}

function JobDetailPage() {
  const { id } = useParams();
  const jobs = useJobData();
  const job = jobs.find(j => String(j.id) === id);
  const [saved, setSaved] = useState(() => read('jobfinder_saved', []));
  const [apps, setApps] = useState(() => read('jobfinder_applied', []));
  const [message, setMessage] = useState('');
  
  if (!job) return <><PageTitle eyebrow="JOB DETAILS" title="รายละเอียดงาน" /><Empty title="ไม่พบตำแหน่งงาน" text="งานนี้อาจถูกนำออกหรือไม่มีอยู่แล้ว" action={<Link className="btn btn-primary" to="/jobs">กลับไปค้นหางาน</Link>} /></>;
  
  const toggle = () => {
    const n = saved.includes(job.id) ? saved.filter(x => x !== job.id) : [...saved, job.id];
    setSaved(n); save('jobfinder_saved', n);
  };
  
  const apply = () => {
    if (apps.some(a => String(a.jobId) === String(job.id))) { setMessage('คุณสมัครงานนี้แล้ว'); return }
    const u = read('jobfinder_user', {});
    const n = [...apps, {
      id: Date.now(), jobId: job.id, status: 'สมัครงาน',
      reason: '', candidateName: u?.name || 'ผู้สมัคร', candidateEmail: u?.email || '',
      jobTitle: job.title, company: job.company, date: new Date().toISOString()
    }];
    setApps(n); save('jobfinder_applied', n);
    setMessage('ส่งใบสมัครตัวอย่างเรียบร้อยแล้ว');
  };
  
  return (
    <>
      <Link className="back-link" to="/jobs">← กลับไปค้นหางาน</Link>
      <div className="detail-layout">
        <article className="panel detail-panel">
          <div className="detail-company">
            <div className="company-logo large">{job.company.charAt(0)}</div>
            <div><div className="eyebrow">JOB DETAILS</div><h1>{job.title}</h1><p>{job.company}</p></div>
          </div>
          <div className="job-meta detail-meta"><span>⌖ {job.location}</span><span>◷ {job.type}</span><span>฿ {job.salary}</span></div>
          <div className="detail-section"><h2>เกี่ยวกับตำแหน่งงาน</h2><p>{job.description || 'รายละเอียดตำแหน่งงานและคุณสมบัติจะประกาศโดยบริษัท'}</p></div>
          <div className="detail-section">
            <h2>ทักษะที่เกี่ยวข้อง</h2>
            <div className="tag-row">{(job.tags || []).map(t => <span className="tag" key={t}>{t}</span>)}</div>
          </div>
          {message && <div className="notice success">{message}</div>}
        </article>
        <aside className="panel apply-panel">
          <h3>สนใจตำแหน่งนี้ไหม?</h3><p>ตรวจสอบข้อมูลให้พร้อมก่อนสมัครงาน</p>
          <button className="btn btn-primary btn-wide" onClick={apply}>{apps.some(a => a.jobId === job.id) ? 'สมัครแล้ว' : 'สมัครงานนี้'}</button>
          <button className="btn btn-outline btn-wide" onClick={toggle}>{saved.includes(job.id) ? '♥ บันทึกแล้ว' : '♡ บันทึกงานนี้'}</button>
          <div className="apply-tip">✦ <span>คุณสามารถติดตามสถานะได้ที่เมนู “งานที่สมัคร”</span></div>
        </aside>
      </div>
    </>
  );
}

function CompanyDashboard() {
  const jobs = useJobData();
  const mine = read('jobfinder_company_jobs', []);
  const apps = read('jobfinder_company_applications', []);
  return (
    <>
      <PageTitle eyebrow="COMPANY WORKSPACE" title="ภาพรวมบริษัท" description="จัดการประกาศงานและติดตามผู้สมัครได้จากที่เดียว" action={<Link className="btn btn-primary" to="/company/jobs/new">＋ ลงประกาศงาน</Link>} />
      <div className="welcome-banner company-banner">
        <div><span className="banner-kicker">LET'S BUILD YOUR TEAM</span><h2>ค้นหาคนที่ใช่สำหรับทีมของคุณ</h2><p>สร้างประกาศงานที่ชัดเจน เพื่อเชื่อมต่อกับผู้สมัครที่เหมาะสม</p><Link className="banner-link" to="/company/jobs/new">สร้างประกาศงานแรกของคุณ →</Link></div>
        <div className="banner-art">♧</div>
      </div>
      <div className="stats-grid">
        <Stat label="ประกาศงานทั้งหมด" value={mine.length} sub="งานที่คุณสร้างในเครื่องนี้" icon="▤" />
        <Stat label="ผู้สมัคร" value={apps.length} sub="ใบสมัครตัวอย่าง" icon="♙" />
        <Stat label="งานตัวอย่างในระบบ" value={jobs.length} sub="ข้อมูลสำหรับทดลองใช้งาน" icon="⌕" />
      </div>
      <div className="section-head"><div><h2>ประกาศงานล่าสุด</h2><p>งานที่คุณสร้างไว้</p></div><Link className="text-link" to="/company/jobs">ดูทั้งหมด →</Link></div>
      {mine.length ? 
        <div className="job-list">{mine.map(j => <article className="job-card" key={j.id}><div className="company-logo">{(j.title || 'J').charAt(0)}</div><div className="job-main"><div className="job-title">{j.title}</div><div className="company-name">{j.location} · {j.type}</div><div className="job-meta"><span>฿ {j.salary || 'ตามตกลง'}</span></div></div><span className="status-pill">เผยแพร่แล้ว</span></article>)}</div> 
        : <Empty icon="▤" title="ยังไม่มีประกาศงาน" text="เริ่มต้นด้วยการสร้างประกาศงานเพื่อให้ผู้สมัครเห็นตำแหน่งที่เปิดรับ" action={<Link className="btn btn-primary" to="/company/jobs/new">＋ ลงประกาศงาน</Link>} />
      }
    </>
  );
}

// อัปเดต FR002: เพิ่มปุ่ม แก้ไข ประกาศงาน
function CompanyJobs() {
  const [jobs, setJobs] = useState(() => read('jobfinder_company_jobs', []));
  const nav = useNavigate();
  
  const remove = id => { 
    if(window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศงานนี้?')) {
        const n = jobs.filter(j => j.id !== id); 
        setJobs(n); 
        save('jobfinder_company_jobs', n); 
    }
  };

  const editJob = (id) => {
    nav(`/company/jobs/edit/${id}`);
  };

  return (
    <>
      <PageTitle eyebrow="JOB MANAGEMENT" title="ประกาศงานของฉัน" description="ดูแลตำแหน่งงานที่บริษัทสร้างไว้" action={<Link className="btn btn-primary" to="/company/jobs/new">＋ ลงประกาศงาน</Link>} />
      {jobs.length ? 
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>ตำแหน่ง</th><th>สถานที่</th><th>ประเภท</th><th>เงินเดือน</th><th>จัดการ</th></tr></thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id}>
                    <td><b>{j.title}</b></td><td>{j.location}</td><td>{j.type}</td><td>{j.salary || 'ตามตกลง'}</td>
                    <td>
                      <button className="text-btn" onClick={() => editJob(j.id)}>แก้ไข</button> | 
                      <button className="text-btn danger-text" onClick={() => remove(j.id)}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> 
        : <Empty icon="▤" title="ยังไม่มีประกาศงาน" text="ประกาศงานที่สร้างจะปรากฏที่นี่" action={<Link className="btn btn-primary" to="/company/jobs/new">สร้างประกาศงาน</Link>} />
      }
    </>
  );
}

function NewJobPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', location: 'กรุงเทพฯ', type: 'Full-time', salary: '', category: 'เทคโนโลยี', tags: '', description: '' });
  const [error, setError] = useState('');
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  
  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { setError('กรุณากรอกชื่อตำแหน่งและรายละเอียดงาน'); return }
    const list = read('jobfinder_company_jobs', []);
    const job = { ...form, id: Date.now(), company: user?.company || user?.name || 'บริษัทของคุณ', tags: form.tags.split(',').map(x => x.trim()).filter(Boolean), posted: 'วันนี้' };
    save('jobfinder_company_jobs', [job, ...list]);
    setError(''); nav('/company/jobs');
  }
  
  return (
    <>
      <PageTitle eyebrow="CREATE A JOB" title="ลงประกาศงานใหม่" description="กรอกรายละเอียดให้ชัดเจน เพื่อให้ผู้สมัครเข้าใจตำแหน่งงาน" />
      <form className="panel profile-form form-stack new-job-form" onSubmit={submit}>
        <div className="form-grid">
          <label className="span-two">ชื่อตำแหน่งงาน *<input value={form.title} onChange={e => update('title', e.target.value)} placeholder="เช่น Frontend Developer" required /></label>
          <label>สถานที่ทำงาน
            <select value={form.location} onChange={e => update('location', e.target.value)}>
              <option>กรุงเทพฯ</option><option>นนทบุรี</option><option>นครปฐม</option><option>ทำงานทางไกล</option>
            </select>
          </label>
          <label>รูปแบบการจ้าง
            <select value={form.type} onChange={e => update('type', e.target.value)}>
              <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
            </select>
          </label>
          <label>เงินเดือน<input value={form.salary} onChange={e => update('salary', e.target.value)} placeholder="เช่น 25,000–35,000 บาท" /></label>
          <label>หมวดหมู่
            <select value={form.category} onChange={e => update('category', e.target.value)}>
              <option>เทคโนโลยี</option><option>ออกแบบ</option><option>ข้อมูล</option><option>การตลาด</option><option>ธุรกิจ</option><option>อื่น ๆ</option>
            </select>
          </label>
          <label className="span-two">ทักษะที่ต้องการ (คั่นด้วยจุลภาค)<input value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="React, JavaScript, CSS" /></label>
          <label className="span-two">รายละเอียดงานและคุณสมบัติ *<textarea rows="6" value={form.description} onChange={e => update('description', e.target.value)} placeholder="หน้าที่ความรับผิดชอบ คุณสมบัติ และสวัสดิการ" required /></label>
        </div>
        {error && <div className="notice error">{error}</div>}
        <div className="form-footer">
          <button type="button" className="btn btn-outline" onClick={() => nav('/company/jobs')}>ยกเลิก</button>
          <button className="btn btn-primary">เผยแพร่ประกาศงาน</button>
        </div>
        <p className="auth-note">ประกาศงานนี้จะบันทึกในเบราว์เซอร์ของคุณ ยังไม่ได้ส่งไปยังฐานข้อมูล</p>
      </form>
    </>
  );
}

// อัปเดต FR002: เพิ่ม Component ใหม่สำหรับแก้ไขประกาศงาน
function EditJobPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const existingJobs = read('jobfinder_company_jobs', []);
  const jobToEdit = existingJobs.find(j => String(j.id) === id);
  
  const [form, setForm] = useState(jobToEdit || { title: '', location: 'กรุงเทพฯ', type: 'Full-time', salary: '', category: 'เทคโนโลยี', tags: '', description: '' });
  if (Array.isArray(form.tags)) form.tags = form.tags.join(', ');
  
  const [error, setError] = useState('');
  
  if (!jobToEdit) return <Navigate to="/company/jobs" replace />;

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  
  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { setError('กรุณากรอกชื่อตำแหน่งและรายละเอียดงาน'); return }
    const updatedJobs = existingJobs.map(j => {
        if (String(j.id) === id) {
             return { ...j, ...form, tags: form.tags.split(',').map(x => x.trim()).filter(Boolean) };
        }
        return j;
    });
    save('jobfinder_company_jobs', updatedJobs);
    setError(''); nav('/company/jobs');
  }
  
  return (
    <>
      <PageTitle eyebrow="EDIT JOB" title="แก้ไขประกาศงาน" description="อัปเดตรายละเอียดประกาศงานของคุณ" />
      <form className="panel profile-form form-stack new-job-form" onSubmit={submit}>
        <div className="form-grid">
           <label className="span-two">ชื่อตำแหน่งงาน *<input value={form.title} onChange={e => update('title', e.target.value)} required /></label>
           <label>สถานที่ทำงาน
            <select value={form.location} onChange={e => update('location', e.target.value)}>
              <option>กรุงเทพฯ</option><option>นนทบุรี</option><option>นครปฐม</option><option>ทำงานทางไกล</option>
            </select>
          </label>
          <label>รูปแบบการจ้าง
            <select value={form.type} onChange={e => update('type', e.target.value)}>
              <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
            </select>
          </label>
          <label>เงินเดือน<input value={form.salary} onChange={e => update('salary', e.target.value)} /></label>
          <label>หมวดหมู่
            <select value={form.category} onChange={e => update('category', e.target.value)}>
              <option>เทคโนโลยี</option><option>ออกแบบ</option><option>ข้อมูล</option><option>การตลาด</option><option>ธุรกิจ</option><option>อื่น ๆ</option>
            </select>
          </label>
          <label className="span-two">ทักษะที่ต้องการ (คั่นด้วยจุลภาค)<input value={form.tags} onChange={e => update('tags', e.target.value)} /></label>
          <label className="span-two">รายละเอียดงานและคุณสมบัติ *<textarea rows="6" value={form.description} onChange={e => update('description', e.target.value)} required /></label>
        </div>
        {error && <div className="notice error">{error}</div>}
        <div className="form-footer">
          <button type="button" className="btn btn-outline" onClick={() => nav('/company/jobs')}>ยกเลิก</button>
          <button className="btn btn-primary">บันทึกการแก้ไข</button>
        </div>
      </form>
    </>
  );
}

function CandidateSearch() {
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('ทั้งหมด');
  const profiles = read('jobfinder_demo_candidates', [
    { id: 1, name: 'พิมพ์ชนก วัฒนกิจ', position: 'Frontend Developer', location: 'กรุงเทพฯ', skills: ['React', 'JavaScript', 'CSS'], exp: '2 ปี' },
    { id: 2, name: 'ธนกร ใจดี', position: 'Data Analyst', location: 'นนทบุรี', skills: ['SQL', 'Python', 'Excel'], exp: '3 ปี' },
    { id: 3, name: 'ณัฐชา แสงทอง', position: 'UX/UI Designer', location: 'นครปฐม', skills: ['Figma', 'UX Research', 'UI Design'], exp: '1 ปี' },
    { id: 4, name: 'กิตติพงษ์ ศรีสุข', position: 'Backend Developer', location: 'ทำงานทางไกล', skills: ['Node.js', 'PostgreSQL', 'API'], exp: '4 ปี' }
  ]);
  const list = profiles.filter(p => (`${p.name} ${p.position} ${p.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase())) && (loc === 'ทั้งหมด' || p.location.includes(loc)));
  return (
    <>
      <PageTitle eyebrow="TALENT SEARCH" title="ค้นหาผู้สมัคร" description="สำรวจโปรไฟล์ตัวอย่างเพื่อทดลองประสบการณ์ค้นหาบุคลากร" />
      <div className="filter-panel">
        <div className="search-field"><span>⌕</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหาชื่อ ตำแหน่ง หรือทักษะ" /></div>
        <select value={loc} onChange={e => setLoc(e.target.value)}>
          <option>ทั้งหมด</option><option>กรุงเทพฯ</option><option>นนทบุรี</option><option>นครปฐม</option><option>ทำงานทางไกล</option>
        </select>
      </div>
      <div className="section-head">
        <div><h2>ผู้สมัครที่แนะนำ</h2><p>พบ {list.length} โปรไฟล์</p></div>
        <span className="soft-label">ข้อมูลตัวอย่าง</span>
      </div>
      <div className="candidate-grid">
        {list.map(p => (
          <article className="candidate-card" key={p.id}>
            <div className="candidate-top">
              <div className="profile-avatar small-avatar">{p.name.charAt(0)}</div><span className="status-pill">เปิดรับโอกาส</span>
            </div>
            <h3>{p.name}</h3><p>{p.position}</p>
            <div className="candidate-meta">⌖ {p.location} <span>·</span> ประสบการณ์ {p.exp}</div>
            <div className="tag-row">{p.skills.map(s => <span className="tag" key={s}>{s}</span>)}</div>
            <button className="btn btn-outline btn-wide" onClick={() => alert(`โปรไฟล์ตัวอย่าง: ${p.name}\n${p.position}\nทักษะ: ${p.skills.join(', ')}`)}>ดูโปรไฟล์ตัวอย่าง</button>
          </article>
        ))}
      </div>
      {!list.length && <Empty title="ไม่พบผู้สมัคร" text="ลองปรับคำค้นหาหรือตัวกรอง" />}
    </>
  );
}

const applicationKey = a => `${String(a.candidateEmail || a.email || a.name || a.candidateName || 'unknown').trim().toLowerCase()}::${String(a.jobId ?? a.jobTitle ?? 'unknown').trim().toLowerCase()}`;

function loadUniqueApplications() {
  const combined = [...read('jobfinder_company_applications', []), ...read('jobfinder_applied', []).map(a => ({ ...a, name: a.candidateName || a.name || 'ผู้สมัคร', candidateEmail: a.candidateEmail || a.email, jobTitle: a.jobTitle || `งาน #${a.jobId}` }))];
  const unique = new Map();
  combined.forEach(a => {
    const key = applicationKey(a);
    if (!unique.has(key)) { unique.set(key, a) } 
    else { const prev = unique.get(key); unique.set(key, { ...prev, ...a, status: a.status || prev.status, reason: a.reason || prev.reason, id: prev.id ?? a.id }) }
  });
  return [...unique.values()];
}

// อัปเดต FR006, FR008, FR009: ในตาราง Pipeline 
function Pipeline() {
  const [apps, setApps] = useState(loadUniqueApplications);
  useEffect(() => { save('jobfinder_company_applications', apps) }, []);
  
  const update = (id, field, value) => {
    const next = apps.map(a => String(a.id) === String(id) ? { ...a, [field]: value, updatedAt: new Date().toISOString() } : a);
    setApps(next);
    save('jobfinder_company_applications', next);
    save('jobfinder_applied', read('jobfinder_applied', []).map(a => String(a.id) === String(id) ? { ...a, [field]: value, updatedAt: new Date().toISOString() } : a));
  };
  
  return (
    <>
      <PageTitle eyebrow="CANDIDATE PIPELINE" title="ติดตามผู้สมัคร" description="เปลี่ยนสถานะและบันทึกรายละเอียดการคัดเลือก" />
      <div className="notice">ข้อมูลในหน้านี้เก็บในเบราว์เซอร์เครื่องนี้ ยังไม่ได้เชื่อมต่อ Backend</div>
      {apps.length ? 
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>ผู้สมัคร</th><th>ตำแหน่ง</th><th>สถานะ</th><th>นัดหมายสัมภาษณ์</th><th>ข้อเสนอ / หมายเหตุ</th></tr></thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a.id}>
                    <td>
                      {a.name || a.candidateName || 'ผู้สมัคร'}
                      <small className="table-sub">{a.candidateEmail || ''}</small>
                      {/* FR006: บันทึกผล Pre-screen */}
                      <div className="pre-screen-box">
                        <input type="text" placeholder="ผล Pre-screen เบื้องต้น..." value={a.prescreenNote || ''} onChange={e => update(a.id, 'prescreenNote', e.target.value)} style={{fontSize: '0.8rem', padding: '2px 4px', marginTop: '4px', width: '100%'}}/>
                      </div>
                    </td>
                    <td>{a.jobTitle}</td>
                    <td>
                      <select value={a.status || 'สมัครงาน'} onChange={e => update(a.id, 'status', e.target.value)}>
                        <option>สมัครงาน</option>
                        <option>Pre-screen</option>
                        <option>ส่งลูกค้า</option>
                        <option>นัดสัมภาษณ์</option>
                        <option>ผ่านสัมภาษณ์</option>
                        <option>เริ่มงาน</option>
                      </select>
                    </td>
                    <td>
                      {/* FR008: วันเวลาสัมภาษณ์ */}
                      <input type="datetime-local" value={a.interviewDate || ''} onChange={e => update(a.id, 'interviewDate', e.target.value)} disabled={a.status !== 'นัดสัมภาษณ์' && a.status !== 'ผ่านสัมภาษณ์'} style={{fontSize: '0.8rem'}}/>
                    </td>
                    <td>
                      {/* FR009: เงินเดือนที่ Offer */}
                      { (a.status === 'ผ่านสัมภาษณ์' || a.status === 'เริ่มงาน') ? (
                          <input type="number" placeholder="เงินเดือนที่เสนอ (Offer)" value={a.offeredSalary || ''} onChange={e => update(a.id, 'offeredSalary', e.target.value)} style={{marginBottom: '4px', display: 'block', width: '100%'}}/>
                      ) : null }
                      <input aria-label="เหตุผลหรือหมายเหตุ" value={a.reason || ''} onChange={e => update(a.id, 'reason', e.target.value)} placeholder="เหตุผล (เช่น ไม่ผ่านเพราะ...)" style={{width: '100%'}}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> 
        : <Empty icon="⇢" title="ยังไม่มีผู้สมัคร" text="เมื่อมีใบสมัครเข้ามา รายการจะปรากฏที่นี่" />
      }
    </>
  );
}

function MatchingPage() {
  const jobs = useJobData();
  const { user } = useAuth();
  const profile = read('jobfinder_users', []).find(u => u.email === user?.email) || user || {};
  const skills = String(profile.skills || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  const target = String(profile.position || '').toLowerCase();
  const matches = jobs.map(job => {
    const tags = (job.tags || []).map(x => String(x).toLowerCase());
    const hits = tags.filter(t => skills.some(s => s.includes(t) || t.includes(s)));
    const titleHit = target && String(job.title).toLowerCase().includes(target);
    const score = Math.min(98, Math.round((hits.length / Math.max(tags.length, 1)) * 75) + (titleHit ? 25 : 0));
    return { ...job, score, hits };
  }).sort((a, b) => b.score - a.score);
  
  return (
    <>
      <PageTitle eyebrow="SMART JOB MATCHING" title="งานที่เหมาะกับคุณ" description="คะแนนคำนวณจากทักษะและตำแหน่งที่ระบุในโปรไฟล์ ไม่ใช่การรับประกันผลการสมัคร" action={<Link className="btn btn-outline" to="/profile">อัปเดตโปรไฟล์</Link>} />
      <div className="match-grid">
        {matches.map(j => (
          <article className="candidate-card match-card" key={j.id}>
            <div className="match-score"><strong>{j.score}%</strong><span>ความเหมาะสม</span></div>
            <h3><Link to={`/jobs/${j.id}`} className="job-title">{j.title}</Link></h3><p>{j.company}</p>
            <div className="candidate-meta">{j.location} · {j.salary}</div>
            <div className="tag-row">{(j.tags || []).map(t => <span className={`tag ${j.hits.includes(String(t).toLowerCase()) ? 'tag-match' : ''}`} key={t}>{t}</span>)}</div>
            <p className="match-reason">{j.hits.length ? `ทักษะที่ตรงกัน: ${j.hits.join(', ')}` : 'เพิ่มทักษะในโปรไฟล์เพื่อดูการจับคู่ที่แม่นยำขึ้น'}</p>
            <Link className="btn btn-primary btn-wide" to={`/jobs/${j.id}`}>ดูรายละเอียดงาน</Link>
          </article>
        ))}
      </div>
    </>
  );
}

function RecruiterDashboard() {
  const apps = read('jobfinder_applied', []);
  const profiles = read('jobfinder_demo_candidates', []);
  return (
    <>
      <PageTitle eyebrow="RECRUITER WORKSPACE" title="ภาพรวมผู้สรรหา" description="ค้นหาผู้สมัคร ส่งข้อมูลเข้ากระบวนการ และติดตามผลได้ในที่เดียว" />
      <div className="welcome-banner">
        <div><span className="banner-kicker">TALENT CONNECTION</span><h2>เชื่อมต่อผู้สมัครกับโอกาสที่เหมาะสม</h2><p>จัดการข้อมูลการสรรหาในพื้นที่เดียว</p><Link className="banner-link" to="/recruiter/candidates">ค้นหาผู้สมัคร →</Link></div>
        <div className="banner-art">♧</div>
      </div>
      <div className="stats-grid">
        <Stat label="โปรไฟล์ตัวอย่าง" value={profiles.length || 4} sub="พร้อมค้นหา" icon="♙" />
        <Stat label="ใบสมัครที่บันทึก" value={apps.length} sub="ข้อมูลในเบราว์เซอร์นี้" icon="▤" />
        <Stat label="ผ่านการคัดเลือก" value={apps.filter(a => a.status === 'ผ่านสัมภาษณ์').length} sub="สถานะใบสมัคร" icon="✓" />
      </div>
      <div className="quick-links">
        <Link className="quick-link panel" to="/recruiter/candidates"><b>ค้นหาผู้สมัคร</b><span>ค้นหาจากตำแหน่งและทักษะ →</span></Link>
        <Link className="quick-link panel" to="/recruiter/submissions"><b>ส่งข้อมูลผู้สมัคร</b><span>เลือกผู้สมัครและงานที่เกี่ยวข้อง →</span></Link>
        <Link className="quick-link panel" to="/recruiter/report"><b>ดูรายงาน</b><span>สรุปผลการสรรหา →</span></Link>
      </div>
    </>
  );
}

function SubmissionPage() {
  const profiles = read('jobfinder_demo_candidates', [
    { id: 1, name: 'พิมพ์ชนก วัฒนกิจ', position: 'Frontend Developer', location: 'กรุงเทพฯ', skills: ['React', 'JavaScript', 'CSS'], exp: '2 ปี' },
    { id: 2, name: 'ธนกร ใจดี', position: 'Data Analyst', location: 'นนทบุรี', skills: ['SQL', 'Python', 'Excel'], exp: '3 ปี' },
    { id: 3, name: 'ณัฐชา แสงทอง', position: 'UX/UI Designer', location: 'นครปฐม', skills: ['Figma', 'UX Research', 'UI Design'], exp: '1 ปี' },
    { id: 4, name: 'กิตติพงษ์ ศรีสุข', position: 'Backend Developer', location: 'ทำงานทางไกล', skills: ['Node.js', 'PostgreSQL', 'API'], exp: '4 ปี' }
  ]);
  const jobs = useJobData();
  const [candidate, setCandidate] = useState(String(profiles[0]?.id || ''));
  const [job, setJob] = useState(String(jobs[0]?.id || ''));
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [submissions, setSubmissions] = useState(() => read('jobfinder_submissions', []));
  
  function submit(e) {
    e.preventDefault();
    const person = profiles.find(p => String(p.id) === candidate), position = jobs.find(j => String(j.id) === job);
    if (!person || !position) { setMessage('กรุณาเลือกผู้สมัครและตำแหน่งงาน'); return }
    const item = { id: Date.now(), candidateId: person.id, candidateName: person.name, positionId: position.id, jobTitle: position.title, company: position.company, note, status: 'ส่งข้อมูลแล้ว', date: new Date().toISOString() };
    const next = [item, ...submissions];
    setSubmissions(next); save('jobfinder_submissions', next);
    setMessage('บันทึกการส่งข้อมูลผู้สมัครเรียบร้อย'); setNote('');
  }
  
  return (
    <>
      <PageTitle eyebrow="CANDIDATE SUBMISSION" title="ส่งข้อมูลผู้สมัคร" description="บันทึกการเสนอผู้สมัครให้กับตำแหน่งงานที่เกี่ยวข้อง" />
      <form className="panel profile-form form-stack submission-form" onSubmit={submit}>
        <div className="form-grid">
          <label>ผู้สมัคร
            <select value={candidate} onChange={e => setCandidate(e.target.value)}>{profiles.map(p => <option key={p.id} value={p.id}>{p.name} — {p.position}</option>)}</select>
          </label>
          <label>ตำแหน่งงาน
            <select value={job} onChange={e => setJob(e.target.value)}>{jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.company}</option>)}</select>
          </label>
          <label className="span-two">หมายเหตุสำหรับผู้ว่าจ้าง<textarea rows="3" value={note} onChange={e => setNote(e.target.value)} placeholder="สรุปประสบการณ์หรือเหตุผลที่แนะนำผู้สมัคร" /></label>
        </div>
        {message && <div className="notice success">{message}</div>}
        <button className="btn btn-primary">＋ บันทึกการส่งข้อมูล</button>
        <p className="auth-note">การส่งนี้เป็นการบันทึกใน Frontend เท่านั้น ยังไม่ได้ส่งอีเมลหรือข้อมูลไปยังบริษัทจริง</p>
      </form>
      <div className="section-head"><div><h2>ประวัติการส่งข้อมูล</h2><p>รายการที่บันทึกในเบราว์เซอร์นี้</p></div></div>
      {submissions.length ? 
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>ผู้สมัคร</th><th>ตำแหน่งงาน</th><th>บริษัท</th><th>วันที่</th><th>สถานะ</th></tr></thead>
              <tbody>{submissions.map(x => <tr key={x.id}><td>{x.candidateName}</td><td>{x.jobTitle}</td><td>{x.company}</td><td>{new Date(x.date).toLocaleDateString('th-TH')}</td><td><span className="status-pill">{x.status}</span></td></tr>)}</tbody>
            </table>
          </div>
        </div> 
        : <Empty title="ยังไม่มีประวัติส่งข้อมูล" text="รายการที่บันทึกจะแสดงที่นี่" />
      }
    </>
  );
}

// อัปเดต FR011: เพิ่มฟิลเตอร์เวลาในหน้า Report
function ReportPage() {
  const jobs = useJobData();
  const allApps = read('jobfinder_applied', []);
  const submissions = read('jobfinder_submissions', []);
  const [filterPeriod, setFilterPeriod] = useState('all'); 
  
  const filteredApps = useMemo(() => {
      if(filterPeriod === 'all') return allApps;
      const now = new Date();
      return allApps.filter(a => {
          if(!a.date) return false;
          const appDate = new Date(a.date);
          const diffTime = Math.abs(now - appDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          if(filterPeriod === 'daily') return diffDays <= 1;
          if(filterPeriod === 'weekly') return diffDays <= 7;
          if(filterPeriod === 'monthly') return diffDays <= 30;
          return true;
      });
  }, [allApps, filterPeriod]);

  const rows = [
    ['ใบสมัครทั้งหมด', filteredApps.length],
    ['ผ่านสัมภาษณ์', filteredApps.filter(a => a.status === 'ผ่านสัมภาษณ์').length],
    ['รอพิจารณา', filteredApps.filter(a => !['ผ่านสัมภาษณ์', 'เริ่มงาน'].includes(a.status)).length]
  ];
  
  const csv = [['รายการ', 'จำนวน'], ...rows].map(r => r.map(v => '"' + String(v).replaceAll('"', '""') + '"').join(',')).join('\r\n');
  
  function exportCSV() {
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = `jobfinder-report-${filterPeriod}.csv`; a.click(); URL.revokeObjectURL(url);
  }
  
  return (
    <>
      <PageTitle eyebrow="RECRUITMENT REPORT" title="รายงานการสรรหา" description="ภาพรวมจากข้อมูลตัวอย่างและรายการที่บันทึกในเบราว์เซอร์" action={<button className="btn btn-primary" onClick={exportCSV}>↓ ส่งออก CSV</button>} />
      
      <div className="filter-panel" style={{marginBottom: '1rem'}}>
          <label style={{marginRight: '1rem'}}><b>ช่วงเวลา:</b></label>
          <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
              <option value="all">ทั้งหมด (All-time)</option>
              <option value="daily">รายวัน (Daily)</option>
              <option value="weekly">รายสัปดาห์ (Weekly)</option>
              <option value="monthly">รายเดือน (Monthly)</option>
          </select>
      </div>

      <div className="stats-grid">
        <Stat label="ตำแหน่งงานที่มองเห็น" value={jobs.length} sub="รวมงานตัวอย่างและงานที่เพิ่ม" icon="▤" />
        <Stat label="ใบสมัคร (ตามช่วงเวลา)" value={filteredApps.length} sub={`คัดกรอง: ${filterPeriod}`} icon="♙" />
        <Stat label="ส่งข้อมูลผู้สมัคร" value={submissions.length} sub="ประวัติการเสนอผู้สมัคร" icon="⇢" />
      </div>
      <div className="panel report-panel">
        <h2>สรุปสถานะใบสมัคร ({filterPeriod})</h2>
        <div className="report-bars">
          {rows.map(([label, value]) => (
            <div className="report-row" key={label}>
              <div><span>{label}</span><b>{value}</b></div>
              <div className="progress"><i style={{ width: `${filteredApps.length ? Math.max(value / filteredApps.length * 100, value ? 6 : 0) : 0}%` }} /></div>
            </div>
          ))}
        </div>
        <p className="auth-note">รายงานนี้เป็นข้อมูล Frontend สำหรับทดลองเท่านั้น ไม่ใช่สถิติจากฐานข้อมูลส่วนกลาง</p>
      </div>
    </>
  );
}

function Landing() {
  const { user } = useAuth();
  return <Navigate to={user ? homeForRole(user.role) : '/login'} replace />
}

function CandidateProfileDetail() {
  const { id } = useParams();
  const profiles = read('jobfinder_demo_candidates', [
    { id: 1, name: 'พิมพ์ชนก วัฒนกิจ', position: 'Frontend Developer', location: 'กรุงเทพฯ', skills: ['React', 'JavaScript', 'CSS'], exp: '2 ปี', about: 'นักพัฒนา Frontend ที่สนใจสร้างประสบการณ์ใช้งานที่ดี' },
    { id: 2, name: 'ธนกร ใจดี', position: 'Data Analyst', location: 'นนทบุรี', skills: ['SQL', 'Python', 'Excel'], exp: '3 ปี', about: 'สนใจการวิเคราะห์ข้อมูลและการสร้างรายงาน' },
    { id: 3, name: 'ณัฐชา แสงทอง', position: 'UX/UI Designer', location: 'นครปฐม', skills: ['Figma', 'UX Research', 'UI Design'], exp: '1 ปี', about: 'ออกแบบผลิตภัณฑ์ดิจิทัลโดยยึดผู้ใช้เป็นศูนย์กลาง' },
    { id: 4, name: 'กิตติพงษ์ ศรีสุข', position: 'Backend Developer', location: 'ทำงานทางไกล', skills: ['Node.js', 'PostgreSQL', 'API'], exp: '4 ปี', about: 'พัฒนา API และระบบฐานข้อมูล' }
  ]);
  const p = profiles.find(x => String(x.id) === String(id));
  return (
    <>
      <PageTitle eyebrow="CANDIDATE PROFILE" title="โปรไฟล์ผู้สมัคร" description="ข้อมูลตัวอย่างสำหรับทดลองดูรายละเอียดผู้สมัคร" action={<Link className="btn btn-outline" to="-1" onClick={e => { e.preventDefault(); window.history.back() }}>← กลับ</Link>} />
      {!p ? <Empty title="ไม่พบโปรไฟล์" text="โปรไฟล์นี้ไม่มีอยู่ในข้อมูลตัวอย่าง" /> : 
        <div className="profile-layout">
          <section className="panel profile-summary">
            <div className="profile-avatar">{p.name.charAt(0)}</div><h2>{p.name}</h2><p>{p.position}</p><span className="status-pill">เปิดรับโอกาส</span>
            <div className="candidate-meta">⌖ {p.location} · ประสบการณ์ {p.exp}</div>
            <a className="btn btn-primary btn-wide" href={`mailto:${p.email || ''}?subject=${encodeURIComponent('โอกาสงาน ' + p.position)}`}>ติดต่อผู้สมัคร</a>
          </section>
          <section className="panel profile-form">
            <h2>เกี่ยวกับผู้สมัคร</h2><p>{p.about || 'ยังไม่มีข้อมูลแนะนำตัว'}</p>
            <h3>ทักษะ</h3><div className="tag-row">{p.skills.map(s => <span className="tag" key={s}>{s}</span>)}</div>
            <h3>ประสบการณ์</h3><p>{p.exp} · {p.position}</p>
            <div className="notice">นี่คือข้อมูลตัวอย่างใน Frontend เท่านั้น ยังไม่ได้ดึงข้อมูลจาก Backend</div>
          </section>
        </div>
      }
    </>
  );
}

function CompanyProfilePage() {
  const { user, login } = useAuth();
  const [company, setCompany] = useState(() => read('jobfinder_company_profile', { name: user?.company || user?.name || '', industry: 'เทคโนโลยี', location: 'กรุงเทพฯ', website: '', about: '', size: '1–10 คน' }));
  const [msg, setMsg] = useState('');
  
  function submit(e) {
    e.preventDefault();
    save('jobfinder_company_profile', company); login({ ...user, company: company.name }); setMsg('บันทึกข้อมูลบริษัทไว้ในเบราว์เซอร์แล้ว');
  }
  
  return (
    <>
      <PageTitle eyebrow="COMPANY PROFILE" title="ข้อมูลบริษัท" description="จัดการข้อมูลที่ผู้สมัครควรรู้จักก่อนสมัครงาน" />
      <form className="panel profile-form form-stack" onSubmit={submit}>
        <div className="form-grid">
          <label>ชื่อบริษัท<input required value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} /></label>
          <label>ประเภทธุรกิจ<input value={company.industry} onChange={e => setCompany({ ...company, industry: e.target.value })} placeholder="เช่น เทคโนโลยี" /></label>
          <label>ที่ตั้ง<input value={company.location} onChange={e => setCompany({ ...company, location: e.target.value })} /></label>
          <label>เว็บไซต์<input type="url" value={company.website} onChange={e => setCompany({ ...company, website: e.target.value })} placeholder="https://example.com" /></label>
          <label>ขนาดบริษัท
            <select value={company.size} onChange={e => setCompany({ ...company, size: e.target.value })}>
              <option>1–10 คน</option><option>11–50 คน</option><option>51–200 คน</option><option>มากกว่า 200 คน</option>
            </select>
          </label>
        </div>
        <label>เกี่ยวกับบริษัท<textarea rows="5" value={company.about} onChange={e => setCompany({ ...company, about: e.target.value })} placeholder="แนะนำบริษัท วัฒนธรรม และสิ่งที่ทีมให้ความสำคัญ" /></label>
        {msg && <p className="success-message">{msg}</p>}
        <button className="btn btn-primary" type="submit">บันทึกข้อมูลบริษัท</button>
        <p className="muted-note">ข้อมูลนี้เก็บในเบราว์เซอร์เครื่องนี้ ยังไม่ได้เชื่อมต่อ Backend</p>
      </form>
      <section className="panel company-preview">
        <h2>ตัวอย่างข้อมูลที่ผู้สมัครจะเห็น</h2><h3>{company.name || 'ชื่อบริษัทของคุณ'}</h3><p>{company.industry} · {company.location} · {company.size}</p>
        <p>{company.about || 'เพิ่มคำแนะนำเกี่ยวกับบริษัทเพื่อให้ผู้สมัครรู้จักทีมของคุณมากขึ้น'}</p>
        {company.website && <a href={company.website} target="_blank" rel="noreferrer">เว็บไซต์บริษัท ↗</a>}
      </section>
    </>
  );
}

function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(() => read('jobfinder_posts', [{ id: 1, author: 'ทีม Jobfinder', role: 'ข่าวสาร', text: 'ยินดีต้อนรับสู่ชุมชน Jobfinder แชร์ความรู้และโอกาสการทำงานที่เป็นประโยชน์ได้ที่นี่', date: new Date().toISOString() }]));
  const [draft, setDraft] = useState('');
  
  function publish(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    const next = [{ id: Date.now(), author: user?.name || user?.company || 'ผู้ใช้งาน', role: roleLabel(user?.role), text: draft.trim(), date: new Date().toISOString() }, ...posts];
    setPosts(next); save('jobfinder_posts', next); setDraft('');
  }
  
  return (
    <>
      <PageTitle eyebrow="COMMUNITY" title="ชุมชนและข่าวสาร" description="พื้นที่แบ่งปันความรู้ ข่าวสาร และประสบการณ์ด้านอาชีพ" />
      <form className="panel community-compose" onSubmit={publish}>
        <label htmlFor="post-draft">มีอะไรอยากแบ่งปันไหม?</label>
        <textarea id="post-draft" rows="3" value={draft} onChange={e => setDraft(e.target.value)} placeholder="เขียนโพสต์หรือแบ่งปันเคล็ดลับการทำงาน…" />
        <div className="compose-footer">
          <span className="muted-note">โพสต์จะแสดงในเบราว์เซอร์นี้เท่านั้น</span>
          <button className="btn btn-primary" type="submit" disabled={!draft.trim()}>เผยแพร่โพสต์</button>
        </div>
      </form>
      <div className="community-feed">
        {posts.map(p => (
          <article className="panel community-post" key={p.id}>
            <div className="post-author"><div className="profile-avatar small-avatar">{(p.author || 'U').charAt(0)}</div><div><b>{p.author}</b><small>{p.role || 'สมาชิก'} · {p.date ? new Date(p.date).toLocaleString('th-TH') : ''}</small></div></div>
            <p>{p.text}</p>
            {p.author === (user?.name || user?.company) && <button className="btn btn-outline" onClick={() => { const next = posts.filter(x => x.id !== p.id); setPosts(next); save('jobfinder_posts', next) }}>ลบโพสต์</button>}
          </article>
        ))}
      </div>
    </>
  );
}

function PipelineBoard() {
  const [apps, setApps] = useState(loadUniqueApplications);
  const stages = ['สมัครงาน', 'Pre-screen', 'ส่งลูกค้า', 'นัดสัมภาษณ์', 'ผ่านสัมภาษณ์', 'เริ่มงาน'];
  
  function update(a, status) {
    const next = apps.map(x => String(x.id) === String(a.id) ? { ...x, status, updatedAt: new Date().toISOString() } : x);
    setApps(next);
    save('jobfinder_company_applications', next);
    save('jobfinder_applied', read('jobfinder_applied', []).map(x => String(x.id) === String(a.id) ? { ...x, status, updatedAt: new Date().toISOString() } : x));
  }
  
  return (
    <>
      <PageTitle eyebrow="HIRING PIPELINE" title="บอร์ดติดตามผู้สมัคร" description="ภาพรวมผู้สมัครแยกตามขั้นตอนการคัดเลือก" action={<Link className="btn btn-outline" to="/company/pipeline">มุมมองตาราง</Link>} />
      <div className="pipeline-board">
        {stages.map(stage => (
          <section className="pipeline-column" key={stage}>
            <header><b>{stage}</b><span>{apps.filter(a => (a.status || 'สมัครงาน') === stage).length}</span></header>
            {apps.filter(a => (a.status || 'สมัครงาน') === stage).map(a => (
              <article className="panel pipeline-card" key={a.id}>
                <b>{a.name || a.candidateName || 'ผู้สมัคร'}</b><p>{a.jobTitle || 'ไม่ระบุตำแหน่ง'}</p><small>{a.candidateEmail || ''}</small>
                <select aria-label={'เปลี่ยนสถานะ ' + (a.name || a.candidateName)} value={a.status || 'สมัครงาน'} onChange={e => update(a, e.target.value)}>
                  {stages.map(s => <option key={s}>{s}</option>)}
                </select>
              </article>
            ))}
          </section>
        ))}
      </div>
      <p className="muted-note">การเปลี่ยนสถานะบันทึกใน localStorage เท่านั้น</p>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Protected role="candidate"><AppShell role="candidate" /></Protected>}>
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/matching" element={<MatchingPage />} />
        </Route>
        <Route element={<Protected role="company"><AppShell role="company" /></Protected>}>
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/company/jobs" element={<CompanyJobs />} />
          <Route path="/company/jobs/new" element={<NewJobPage />} />
          {/* FR002: เพิ่ม Route สำหรับหน้า Edit Job */}
          <Route path="/company/jobs/edit/:id" element={<EditJobPage />} />
          <Route path="/company/profile" element={<CompanyProfilePage />} />
          <Route path="/company/board" element={<PipelineBoard />} />
          <Route path="/candidates/:id" element={<CandidateProfileDetail />} />
          <Route path="/company/candidates" element={<CandidateSearch />} />
          <Route path="/company/pipeline" element={<Pipeline />} />
          <Route path="/company/report" element={<ReportPage />} />
        </Route>
        <Route element={<Protected role="recruiter"><AppShell role="recruiter" /></Protected>}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/candidates" element={<CandidateSearch />} />
          <Route path="/recruiter/submissions" element={<SubmissionPage />} />
          <Route path="/recruiter/board" element={<PipelineBoard />} />
          <Route path="/candidates/:id" element={<CandidateProfileDetail />} />
          <Route path="/recruiter/report" element={<ReportPage />} />
        </Route>
        <Route path="*" element={<Landing />} />
      </Routes>
    </AuthProvider>
  );
}