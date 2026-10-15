import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

const stages = ['ส่งลูกค้า', 'Pre-screen', 'นัดสัมภาษณ์', 'ผ่านสัมภาษณ์', 'ไม่ผ่าน', 'เริ่มงาน'];
const submissionKey = item => `${String(item.candidateId ?? item.candidateName ?? '').trim().toLowerCase()}::${String(item.positionId ?? item.jobTitle ?? '').trim().toLowerCase()}::${String(item.company ?? '').trim().toLowerCase()}`;

function loadSubmittedCandidates() {
  const saved = read('jobfinder_submissions', []);
  const unique = new Map();
  saved.forEach(item => {
    const key = submissionKey(item);
    const previous = unique.get(key);
    // Keep the latest copy, but preserve a status already changed on the board.
    unique.set(key, previous ? { ...item, ...previous, id: previous.id ?? item.id } : item);
  });
  return [...unique.values()].map(item => ({
    ...item,
    name: item.candidateName || item.name || 'ผู้สมัคร',
    candidateEmail: item.candidateEmail || item.email || '',
    jobTitle: item.jobTitle || 'ไม่ระบุตำแหน่ง',
    status: stages.includes(item.status) ? item.status : 'ส่งลูกค้า',
  }));
}

export default function PipelineBoard() {
  const [apps, setApps] = useState(loadSubmittedCandidates);

  function update(application, status) {
    const next = apps.map(item => String(item.id) === String(application.id) ? { ...item, status, updatedAt: new Date().toISOString() } : item);
    setApps(next);
    save('jobfinder_submissions', next);
  }

  return <>
    <PageTitle eyebrow="HIRING PIPELINE" title="บอร์ดติดตามผู้สมัคร" description="แสดงเฉพาะผู้สมัครที่ Recruiter ส่งข้อมูลให้บริษัทแล้ว สามารถเปลี่ยนสถานะได้จากการ์ด" action={<Link className="btn btn-outline" to="/company/pipeline">มุมมองตาราง</Link>} />
    {!apps.length ? <Empty title="ยังไม่มีผู้สมัครในบอร์ด" text="ผู้สมัครจะเข้ามาในบอร์ดหลังจากเลือกผู้สมัครที่สนใจและกดส่งข้อมูลในเมนู “ส่งข้อมูลผู้สมัคร”" action={<Link className="btn btn-primary" to="/recruiter/submissions">ไปหน้าส่งข้อมูลผู้สมัคร</Link>} /> : <div className="pipeline-board pipeline-board-all-stages">
      {stages.map(stage => {
        const stageApps = apps.filter(item => item.status === stage);
        return <section className="pipeline-column" key={stage}>
          <header><b>{stage}</b><span>{stageApps.length}</span></header>
          {stageApps.map(item => <article className="panel pipeline-card" key={item.id}>
            <b>{item.name}</b>
            <p>{item.jobTitle}</p>
            {item.company && <small>บริษัท: {item.company}</small>}
            {item.candidateEmail && <small>{item.candidateEmail}</small>}
            <label className="pipeline-status-label">สถานะ
              <select aria-label={`เปลี่ยนสถานะ ${item.name}`} value={item.status} onChange={e => update(item, e.target.value)}>
                {stages.map(value => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </article>)}
          {!stageApps.length && <p className="pipeline-empty-stage">ยังไม่มีผู้สมัคร</p>}
        </section>;
      })}
    </div>}
    <p className="muted-note">ข้อมูลบันทึกใน localStorage ของเบราว์เซอร์นี้เท่านั้น</p>
  </>;
}
