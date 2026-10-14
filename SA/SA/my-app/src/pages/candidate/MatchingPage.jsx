import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageTitle } from '../../components/SharedComponents';
import { DEMO_JOBS } from '../../data/mockData';
import { read } from '../../utils/storage';

export default function MatchingPage() {
  const jobs = [...read('jobfinder_company_jobs', []), ...read('jobfinder_jobs', DEMO_JOBS)];
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