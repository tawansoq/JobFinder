import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

const applicationKey = a => `${String(a.candidateEmail || a.email || a.name || a.candidateName || 'unknown').trim().toLowerCase()}::${String(a.jobId ?? a.jobTitle ?? 'unknown').trim().toLowerCase()}`;

function loadUniqueApplications() {
  const combined = [...read('jobfinder_company_applications', []), ...read('jobfinder_applied', []).map(a => ({ ...a, name: a.candidateName || a.name || 'ผู้สมัคร', candidateEmail: a.candidateEmail || a.email, jobTitle: a.jobTitle || `งาน #${a.jobId}` }))];
  const unique = new Map();
  combined.forEach(a => {
    const key = applicationKey(a);
    if (!unique.has(key)) { unique.set(key, a) } 
    else { const prev = unique.get(key); unique.set(key, { ...prev, ...a, status: a.status || prev.status, reason: a.reason || prev.reason, id: prev.id ?? a.id }) }
  });
  return [...unique.values()];
}

export default function PipelineBoard() {
  const [apps, setApps] = useState(loadUniqueApplications);
  const stages = ['สมัครงาน', 'Pre-screen', 'ส่งลูกค้า', 'นัดสัมภาษณ์', 'ผ่านสัมภาษณ์', 'เริ่มงาน'];
  
  function update(a, status) {
    const next = apps.map(x => String(x.id) === String(a.id) ? { ...x, status, updatedAt: new Date().toISOString() } : x);
    setApps(next);
    save('jobfinder_company_applications', next);
    save('jobfinder_applied', read('jobfinder_applied', []).map(x => String(x.id) === String(a.id) ? { ...x, status, updatedAt: new Date().toISOString() } : x));
  }
  
  return (
    <>
      <PageTitle eyebrow="HIRING PIPELINE" title="บอร์ดติดตามผู้สมัคร" description="ภาพรวมผู้สมัครแยกตามขั้นตอนการคัดเลือก" action={<Link className="btn btn-outline" to="/company/pipeline">มุมมองตาราง</Link>} />
      <div className="pipeline-board">
        {stages.map(stage => (
          <section className="pipeline-column" key={stage}>
            <header><b>{stage}</b><span>{apps.filter(a => (a.status || 'สมัครงาน') === stage).length}</span></header>
            {apps.filter(a => (a.status || 'สมัครงาน') === stage).map(a => (
              <article className="panel pipeline-card" key={a.id}>
                <b>{a.name || a.candidateName || 'ผู้สมัคร'}</b><p>{a.jobTitle || 'ไม่ระบุตำแหน่ง'}</p><small>{a.candidateEmail || ''}</small>
                <select aria-label={'เปลี่ยนสถานะ ' + (a.name || a.candidateName)} value={a.status || 'สมัครงาน'} onChange={e => update(a, e.target.value)}>
                  {stages.map(s => <option key={s}>{s}</option>)}
                </select>
              </article>
            ))}
          </section>
        ))}
      </div>
      <p className="muted-note">การเปลี่ยนสถานะบันทึกใน localStorage เท่านั้น</p>
    </>
  );
}