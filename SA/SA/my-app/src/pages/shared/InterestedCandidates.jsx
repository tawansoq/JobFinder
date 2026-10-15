import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

export default function InterestedCandidates() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState(() => read('jobfinder_interested_candidates', []));
  const [selected, setSelected] = useState(null);
  const remove = id => {
    const next = profiles.filter(p => String(p.id) !== String(id));
    setProfiles(next);
    save('jobfinder_interested_candidates', next);
  };

  return <>
    <PageTitle eyebrow="SAVED CANDIDATES" title="ผู้สมัครที่สนใจ" description="รวมโปรไฟล์ที่คุณกดสนใจไว้ เพื่อกลับมาดูรายละเอียดได้สะดวก" />
    <div className="section-head"><div><h2>รายการที่บันทึกไว้</h2><p>ทั้งหมด {profiles.length} โปรไฟล์</p></div></div>
    {profiles.length ? <div className="candidate-grid">{profiles.map(p => <article className="candidate-card" key={p.id}>
      <div className="candidate-top"><div className="profile-avatar small-avatar">{(p.name || '?').charAt(0)}</div><span className="status-pill">♥ สนใจ</span></div>
      <h3>{p.name}</h3><p>{p.position}</p>
      <div className="candidate-meta">⌖ {p.location || 'ไม่ระบุ'} <span>·</span> ประสบการณ์ {p.exp || 'ไม่ระบุ'}</div>
      {p.education && <div className="candidate-meta">การศึกษา: {p.education}</div>}
      <div className="candidate-meta">เงินเดือนที่คาดหวัง: {Number(p.expectedSalary || p.salary || 0) ? `${Number(p.expectedSalary || p.salary).toLocaleString('th-TH')} บาท/เดือน` : 'ยังไม่ระบุ'}</div>
      <div className="tag-row">{(p.skills || []).map(s => <span className="tag" key={s}>{s}</span>)}</div>
      <div className="interested-actions"><button className="btn btn-outline" onClick={() => setSelected(p)}>ดูโปรไฟล์</button><button className="btn btn-outline danger-text" onClick={() => remove(p.id)}>นำออก</button></div>
    </article>)}</div> : <Empty title="ยังไม่มีผู้สมัครที่สนใจ" text="กลับไปหน้าค้นหาผู้สมัคร แล้วกดปุ่ม ♡ สนใจผู้สมัคร เพื่อบันทึกโปรไฟล์ไว้ที่นี่" action={<button className="btn btn-primary" onClick={() => navigate('/recruiter/candidates')}>ค้นหาผู้สมัคร</button>} />}

    {selected && <div className="profile-modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}>
      <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="saved-profile-title">
        <button className="profile-modal-close" onClick={() => setSelected(null)} aria-label="ปิด">×</button>
        <div className="profile-modal-heading"><div className="profile-avatar">{(selected.name || '?').charAt(0)}</div><div><span className="eyebrow">CANDIDATE PROFILE</span><h2 id="saved-profile-title">{selected.name || 'ไม่ระบุชื่อ'}</h2><p>{selected.position || 'ไม่ระบุตำแหน่ง'}</p></div></div>
        <div className="profile-modal-grid">
          <div><span>พื้นที่ทำงาน</span><strong>{selected.location || 'ไม่ระบุ'}</strong></div>
          <div><span>ประสบการณ์</span><strong>{selected.exp || 'ไม่ระบุ'}</strong></div>
          <div><span>การศึกษา</span><strong>{selected.education || 'ไม่ระบุ'}</strong></div>
          <div><span>เงินเดือนที่คาดหวัง</span><strong>{Number(selected.expectedSalary || selected.salary || 0) ? `${Number(selected.expectedSalary || selected.salary).toLocaleString('th-TH')} บาท/เดือน` : 'ไม่ระบุ'}</strong></div>
        </div>
        <div className="profile-modal-section"><h3>ทักษะ</h3><div className="tag-row">{(selected.skills || []).length ? selected.skills.map(skill => <span className="tag" key={skill}>{skill}</span>) : <span className="muted">ยังไม่มีข้อมูลทักษะ</span>}</div></div>
        <div className="profile-modal-section"><h3>เกี่ยวกับผู้สมัคร</h3><p>{selected.about || 'ยังไม่มีข้อมูลแนะนำตัว'}</p></div>
        {selected.resumeName && <div className="profile-modal-section"><h3>Resume</h3><p>{selected.resumeName}</p></div>}
        <div className="profile-modal-footer"><button className="btn btn-outline" onClick={() => setSelected(null)}>ปิด</button><button className="btn btn-primary" onClick={() => { remove(selected.id); setSelected(null); }}>นำออกจากรายการสนใจ</button></div>
      </section>
    </div>}
  </>;
}
