import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle, Empty } from '../../components/SharedComponents';
import JobCard from '../../components/JobCard';
import { DEMO_JOBS } from '../../data/mockData';
import { read, save } from '../../utils/storage';

export default function SavedPage() {
  const jobs = [...read('jobfinder_company_jobs', []), ...read('jobfinder_jobs', DEMO_JOBS)];
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