import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageTitle } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

export default function CompanyProfilePage() {
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