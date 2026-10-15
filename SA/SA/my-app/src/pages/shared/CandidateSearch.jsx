import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

const demoProfiles = [
  { id: 1, name: 'พิมพ์ชนก วัฒนกิจ', position: 'Frontend Developer', location: 'กรุงเทพฯ', skills: ['React', 'JavaScript', 'CSS'], exp: '2 ปี', expYears: 2, expectedSalary: 35000, education: 'ปริญญาตรี วิทยาการคอมพิวเตอร์' },
  { id: 2, name: 'ธนกร ใจดี', position: 'Data Analyst', location: 'นนทบุรี', skills: ['SQL', 'Python', 'Excel'], exp: '3 ปี', expYears: 3, expectedSalary: 42000, education: 'ปริญญาตรี สถิติ' },
  { id: 3, name: 'ณัฐชา แสงทอง', position: 'UX/UI Designer', location: 'นครปฐม', skills: ['Figma', 'UX Research', 'UI Design'], exp: '1 ปี', expYears: 1, expectedSalary: 28000, education: 'ปริญญาตรี นิเทศศาสตร์' },
  { id: 4, name: 'กิตติพงษ์ ศรีสุข', position: 'Backend Developer', location: 'ทำงานทางไกล', skills: ['Node.js', 'PostgreSQL', 'API'], exp: '4 ปี', expYears: 4, expectedSalary: 50000, education: 'ปริญญาตรี วิศวกรรมซอฟต์แวร์' }
];

export default function CandidateSearch() {
  const navigate = useNavigate();
  const profiles = read('jobfinder_demo_candidates', demoProfiles).map(p => ({
    ...p,
    skills: Array.isArray(p.skills) ? p.skills : [],
    expYears: Number(p.expYears ?? String(p.exp || '').match(/\d+(?:\.\d+)?/)?.[0] ?? 0),
    expectedSalary: Number(p.expectedSalary ?? p.salary ?? 0)
  }));
  const [keyword, setKeyword] = useState('');
  const [position, setPosition] = useState('ทั้งหมด');
  const [location, setLocation] = useState('ทั้งหมด');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('ทั้งหมด');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [interested, setInterested] = useState(() => read('jobfinder_interested_candidates', []));

  const positions = [...new Set(profiles.map(p => p.position).filter(Boolean))];
  const list = useMemo(() => {
    const requiredSkills = skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const min = minSalary === '' ? null : Number(minSalary);
    const max = maxSalary === '' ? null : Number(maxSalary);
    return profiles.filter(p => {
      const haystack = `${p.name} ${p.position} ${p.skills.join(' ')} ${p.education || ''}`.toLowerCase();
      const salary = p.expectedSalary;
      return (!keyword.trim() || haystack.includes(keyword.trim().toLowerCase()))
        && (position === 'ทั้งหมด' || p.position === position)
        && (location === 'ทั้งหมด' || (p.location || '').includes(location))
        && requiredSkills.every(skill => p.skills.some(s => s.toLowerCase().includes(skill)))
        && (experience === 'ทั้งหมด' || p.expYears >= Number(experience))
        && (min === null || (salary > 0 && salary >= min))
        && (max === null || (salary > 0 && salary <= max));
    });
  }, [profiles, keyword, position, location, skills, experience, minSalary, maxSalary]);

  const toggleInterested = profile => {
    const exists = interested.some(p => String(p.id) === String(profile.id));
    const next = exists ? interested.filter(p => String(p.id) !== String(profile.id)) : [...interested, profile];
    setInterested(next);
    save('jobfinder_interested_candidates', next);
  };
  const resetFilters = () => {
    setKeyword(''); setPosition('ทั้งหมด'); setLocation('ทั้งหมด'); setSkills('');
    setExperience('ทั้งหมด'); setMinSalary(''); setMaxSalary('');
  };

  return <>
    <PageTitle eyebrow="TALENT SEARCH" title="ค้นหาผู้สมัคร" description="ค้นหาตามชื่อ ตำแหน่ง พื้นที่ ทักษะ ประสบการณ์ และเงินเดือนที่คาดหวัง" />
    <section className="candidate-filters">
      <div className="candidate-filter-row candidate-filter-primary">
        <label className="filter-control filter-keyword"><span>ค้นหาผู้สมัคร</span><input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="ชื่อผู้สมัคร ทักษะ หรือการศึกษา" /></label>
        <label className="filter-control"><span>ตำแหน่งงาน</span><select value={position} onChange={e => setPosition(e.target.value)}><option value="ทั้งหมด">ทุกตำแหน่ง</option>{positions.map(p => <option key={p} value={p}>{p}</option>)}</select></label>
        <label className="filter-control"><span>พื้นที่ทำงาน</span><select value={location} onChange={e => setLocation(e.target.value)}><option>ทั้งหมด</option><option>กรุงเทพฯ</option><option>นนทบุรี</option><option>นครปฐม</option><option>ทำงานทางไกล</option></select></label>
      </div>
      <div className="candidate-filter-divider" />
      <div className="candidate-filter-row candidate-filter-secondary">
        <label className="filter-control filter-skills"><span>ทักษะที่ต้องการ <small>คั่นแต่ละทักษะด้วยเครื่องหมายจุลภาค</small></span><input value={skills} onChange={e => setSkills(e.target.value)} placeholder="เช่น React, JavaScript, SQL" /></label>
        <label className="filter-control"><span>ประสบการณ์ขั้นต่ำ</span><select value={experience} onChange={e => setExperience(e.target.value)}><option value="ทั้งหมด">ทุกระดับ</option><option value="1">อย่างน้อย 1 ปี</option><option value="2">อย่างน้อย 2 ปี</option><option value="3">อย่างน้อย 3 ปี</option><option value="5">อย่างน้อย 5 ปี</option></select></label>
        <label className="filter-control"><span>เงินเดือนขั้นต่ำ (บาท/เดือน)</span><input type="number" min="0" value={minSalary} onChange={e => setMinSalary(e.target.value)} placeholder="เช่น 30000" /></label>
        <label className="filter-control"><span>เงินเดือนสูงสุด (บาท/เดือน)</span><input type="number" min="0" value={maxSalary} onChange={e => setMaxSalary(e.target.value)} placeholder="เช่น 50000" /></label>
      </div>
      <div className="candidate-filter-footer"><span>เลือกได้หลายทักษะ เช่น React, SQL · สนใจแล้ว {interested.length} คน</span><button className="btn btn-outline btn-sm" onClick={resetFilters}>ล้างตัวกรอง</button></div>
    </section>

    <div className="section-head candidate-results-head"><div><h2>ผลการค้นหาผู้สมัคร</h2><p>พบ {list.length} โปรไฟล์</p></div></div>
    <div className="candidate-grid">
      {list.map(p => {
        const isInterested = interested.some(item => String(item.id) === String(p.id));
        return <article className="candidate-card" key={p.id}>
          <div className="candidate-top"><div className="profile-avatar small-avatar">{p.name.charAt(0)}</div><button className={`btn btn-sm ${isInterested ? 'btn-primary' : 'btn-outline'}`} onClick={() => toggleInterested(p)} aria-pressed={isInterested}>{isInterested ? '♥ สนใจแล้ว' : '♡ สนใจผู้สมัคร'}</button></div>
          <h3>{p.name}</h3><p>{p.position}</p>
          <div className="candidate-meta">⌖ {p.location} <span>·</span> ประสบการณ์ {p.exp}</div>
          {p.education && <div className="candidate-meta">การศึกษา: {p.education}</div>}
          <div className="candidate-meta">เงินเดือนที่คาดหวัง: {p.expectedSalary ? `${p.expectedSalary.toLocaleString('th-TH')} บาท/เดือน` : 'ยังไม่ระบุ'}</div>
          <div className="tag-row">{p.skills.map(s => <span className="tag" key={s}>{s}</span>)}</div>
          <button className="btn btn-outline btn-wide" onClick={() => navigate(`/candidates/${p.id}`)}>ดูโปรไฟล์และคุณสมบัติ</button>
        </article>;
      })}
    </div>
    {!list.length && <Empty title="ไม่พบผู้สมัคร" text="ลองเปลี่ยนตำแหน่ง ทักษะ พื้นที่ หรือช่วงเงินเดือน" />}
  </>;
}
