import { useState } from 'react';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { DEMO_JOBS } from '../../data/mockData';
import { read, save } from '../../utils/storage';

export default function SubmissionPage() {
  const profiles = read('jobfinder_demo_candidates', [
    { id: 1, name: 'พิมพ์ชนก วัฒนกิจ', position: 'Frontend Developer', location: 'กรุงเทพฯ', skills: ['React', 'JavaScript', 'CSS'], exp: '2 ปี' },
    { id: 2, name: 'ธนกร ใจดี', position: 'Data Analyst', location: 'นนทบุรี', skills: ['SQL', 'Python', 'Excel'], exp: '3 ปี' },
    { id: 3, name: 'ณัฐชา แสงทอง', position: 'UX/UI Designer', location: 'นครปฐม', skills: ['Figma', 'UX Research', 'UI Design'], exp: '1 ปี' },
    { id: 4, name: 'กิตติพงษ์ ศรีสุข', position: 'Backend Developer', location: 'ทำงานทางไกล', skills: ['Node.js', 'PostgreSQL', 'API'], exp: '4 ปี' }
  ]);
  const jobs = [...read('jobfinder_company_jobs', []), ...read('jobfinder_jobs', DEMO_JOBS)];
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