import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { DEMO_JOBS } from '../../data/mockData';
import { read, save } from '../../utils/storage';

export default function JobDetailPage() {
  const { id } = useParams();
  const jobs = [...read('jobfinder_company_jobs', []), ...read('jobfinder_jobs', DEMO_JOBS)];
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