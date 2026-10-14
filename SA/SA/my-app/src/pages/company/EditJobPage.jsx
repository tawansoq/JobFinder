import { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { PageTitle } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

export default function EditJobPage() {
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