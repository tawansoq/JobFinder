import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageTitle } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

export default function NewJobPage() {
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