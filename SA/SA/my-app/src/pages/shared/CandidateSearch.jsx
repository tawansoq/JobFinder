import { useState } from 'react';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { read } from '../../utils/storage';

export default function CandidateSearch() {
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