import { useState, useEffect } from 'react';
import { PageTitle, Empty } from '../../components/SharedComponents';
import JobCard from '../../components/JobCard';
import { DEMO_JOBS } from '../../data/mockData';
import { read, save } from '../../utils/storage';

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

export default function JobsPage() {
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