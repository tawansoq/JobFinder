import { useState, useEffect } from 'react';
import { PageTitle, Empty } from '../../components/SharedComponents';
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

export default function Pipeline() {
  const [apps, setApps] = useState(loadUniqueApplications);
  useEffect(() => { save('jobfinder_company_applications', apps) }, [apps]);
  
  const update = (id, field, value) => {
    const next = apps.map(a => String(a.id) === String(id) ? { ...a, [field]: value, updatedAt: new Date().toISOString() } : a);
    setApps(next);
    save('jobfinder_company_applications', next);
    save('jobfinder_applied', read('jobfinder_applied', []).map(a => String(a.id) === String(id) ? { ...a, [field]: value, updatedAt: new Date().toISOString() } : a));
  };
  
  return (
    <>
      <PageTitle eyebrow="CANDIDATE PIPELINE" title="ติดตามผู้สมัคร" description="เปลี่ยนสถานะและบันทึกรายละเอียดการคัดเลือก" />
      <div className="notice">ข้อมูลในหน้านี้เก็บในเบราว์เซอร์เครื่องนี้ ยังไม่ได้เชื่อมต่อ Backend</div>
      {apps.length ? 
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>ผู้สมัคร</th><th>ตำแหน่ง</th><th>สถานะ</th><th>นัดหมายสัมภาษณ์</th><th>ข้อเสนอ / หมายเหตุ</th></tr></thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a.id}>
                    <td>
                      {a.name || a.candidateName || 'ผู้สมัคร'}
                      <small className="table-sub">{a.candidateEmail || ''}</small>
                      <div className="pre-screen-box">
                        <input type="text" placeholder="ผล Pre-screen เบื้องต้น..." value={a.prescreenNote || ''} onChange={e => update(a.id, 'prescreenNote', e.target.value)} style={{fontSize: '0.8rem', padding: '2px 4px', marginTop: '4px', width: '100%'}}/>
                      </div>
                    </td>
                    <td>{a.jobTitle}</td>
                    <td>
                      <select value={a.status || 'สมัครงาน'} onChange={e => update(a.id, 'status', e.target.value)}>
                        <option>สมัครงาน</option>
                        <option>Pre-screen</option>
                        <option>ส่งลูกค้า</option>
                        <option>นัดสัมภาษณ์</option>
                        <option>ผ่านสัมภาษณ์</option>
                        <option>เริ่มงาน</option>
                      </select>
                    </td>
                    <td>
                      <input type="datetime-local" value={a.interviewDate || ''} onChange={e => update(a.id, 'interviewDate', e.target.value)} disabled={a.status !== 'นัดสัมภาษณ์' && a.status !== 'ผ่านสัมภาษณ์'} style={{fontSize: '0.8rem'}}/>
                    </td>
                    <td>
                      { (a.status === 'ผ่านสัมภาษณ์' || a.status === 'เริ่มงาน') ? (
                          <input type="number" placeholder="เงินเดือนที่เสนอ (Offer)" value={a.offeredSalary || ''} onChange={e => update(a.id, 'offeredSalary', e.target.value)} style={{marginBottom: '4px', display: 'block', width: '100%'}}/>
                      ) : null }
                      <input aria-label="เหตุผลหรือหมายเหตุ" value={a.reason || ''} onChange={e => update(a.id, 'reason', e.target.value)} placeholder="เหตุผล (เช่น ไม่ผ่านเพราะ...)" style={{width: '100%'}}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> 
        : <Empty icon="⇢" title="ยังไม่มีผู้สมัคร" text="เมื่อมีใบสมัครเข้ามา รายการจะปรากฏที่นี่" />
      }
    </>
  );
}