import { useState, useEffect } from 'react';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

const applicationKey = a => `${String(a.candidateEmail || a.email || a.name || a.candidateName || 'unknown').trim().toLowerCase()}::${String(a.jobId ?? a.jobTitle ?? 'unknown').trim().toLowerCase()}`;
function loadUniqueApplications() {
  const combined = [...read('jobfinder_company_applications', []), ...read('jobfinder_applied', []).map(a => ({ ...a, name: a.candidateName || a.name || 'ผู้สมัคร', candidateEmail: a.candidateEmail || a.email, jobTitle: a.jobTitle || `งาน #${a.jobId}` }))];
  const unique = new Map();
  combined.forEach(a => {
    const key = applicationKey(a);
    if (!unique.has(key)) unique.set(key, a);
    else { const prev = unique.get(key); unique.set(key, { ...prev, ...a, status: a.status || prev.status, reason: a.reason || prev.reason, id: prev.id ?? a.id }); }
  });
  return [...unique.values()];
}

export default function Pipeline() {
  const [apps, setApps] = useState(loadUniqueApplications);
  useEffect(() => { save('jobfinder_company_applications', apps); }, [apps]);
  const update = (id, field, value) => {
    const stamp = new Date().toISOString();
    const next = apps.map(a => String(a.id) === String(id) ? { ...a, [field]: value, updatedAt: stamp } : a);
    setApps(next);
    save('jobfinder_company_applications', next);
    save('jobfinder_applied', read('jobfinder_applied', []).map(a => String(a.id) === String(id) ? { ...a, [field]: value, updatedAt: stamp } : a));
  };

  return <>
    <PageTitle eyebrow="CANDIDATE PIPELINE" title="ติดตามผู้สมัคร" description="จัดการสถานะ นัดสัมภาษณ์ และผลการคัดเลือกของผู้สมัครแต่ละคน" />
    <div className="notice">ข้อมูลในหน้านี้เก็บในเบราว์เซอร์เครื่องนี้ ยังไม่ได้เชื่อมต่อ Backend</div>
    {apps.length ? <div className="pipeline-list">{apps.map((a, index) => <article className="pipeline-card" key={a.id ?? applicationKey(a)}>
      <header className="pipeline-card-header"><div className="pipeline-person"><div className="profile-avatar small-avatar">{(a.name || a.candidateName || '?').charAt(0)}</div><div><h2>{a.name || a.candidateName || 'ผู้สมัคร'}</h2><p>{a.candidateEmail || 'ไม่ระบุอีเมล'}</p></div></div><span className="pipeline-index">ผู้สมัคร #{index + 1}</span></header>
      <div className="pipeline-job"><span>ตำแหน่งงาน</span><strong>{a.jobTitle || 'ไม่ระบุตำแหน่ง'}</strong></div>
      <div className="pipeline-fields">
        <label className="pipeline-field"><span>สถานะผู้สมัคร</span><select value={a.status || 'สมัครงาน'} onChange={e => update(a.id, 'status', e.target.value)}><option>สมัครงาน</option><option>Pre-screen</option><option>ส่งลูกค้า</option><option>นัดสัมภาษณ์</option><option>ผ่านสัมภาษณ์</option><option>ไม่ผ่าน</option><option>เริ่มงาน</option></select></label>
        <label className="pipeline-field"><span>วันและเวลาสัมภาษณ์</span><input type="datetime-local" value={a.interviewDate || ''} onChange={e => update(a.id, 'interviewDate', e.target.value)} /></label>
        <label className="pipeline-field"><span>ผลสัมภาษณ์ / เงินเดือน Offer (บาท)</span><input type="number" min="0" placeholder="เช่น 35000" value={a.offeredSalary || ''} onChange={e => update(a.id, 'offeredSalary', e.target.value)} /></label>
      </div>
      <div className="pipeline-fields pipeline-fields-notes">
        <label className="pipeline-field"><span>บันทึกผล Pre-screen</span><textarea rows="2" placeholder="ทักษะตรงกับตำแหน่ง ประสบการณ์ที่เกี่ยวข้อง..." value={a.prescreenNote || ''} onChange={e => update(a.id, 'prescreenNote', e.target.value)} /></label>
        <label className="pipeline-field"><span>เหตุผล / Feedback</span><textarea rows="2" placeholder="บันทึกเหตุผลที่ผ่านหรือไม่ผ่าน และข้อเสนอแนะ" value={a.reason || ''} onChange={e => update(a.id, 'reason', e.target.value)} /></label>
      </div>
    </article>)}</div> : <Empty icon="⇢" title="ยังไม่มีผู้สมัคร" text="เมื่อมีใบสมัครเข้ามา รายการจะปรากฏที่นี่" />}
  </>;
}
