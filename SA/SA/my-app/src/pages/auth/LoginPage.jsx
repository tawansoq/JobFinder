import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, homeForRole } from '../../context/AuthContext';
import Brand from '../../components/Brand';

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

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
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

    setTimeout(() => {
      const userData = mode === 'login'
        ? { id: Date.now(), name: email.split('@')[0], email, role: role }
        : { id: Date.now(), name: role === 'company' ? company : name, email, role };
      
      login(userData);
      nav(homeForRole(userData.role), { replace: true });
    }, 500); 
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