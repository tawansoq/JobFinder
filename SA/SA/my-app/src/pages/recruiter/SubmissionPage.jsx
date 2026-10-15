import { useMemo, useState } from 'react';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { DEMO_JOBS } from '../../data/mockData';
import { read, save } from '../../utils/storage';

export default function SubmissionPage() {
  // Only candidates explicitly marked as interested can be submitted to a company.
  const profiles = read('jobfinder_interested_candidates', []);
  const jobs = [...read('jobfinder_company_jobs', []), ...read('jobfinder_jobs', DEMO_JOBS)]
    .filter((job, index, all) => all.findIndex(x => String(x.id) === String(job.id)) === index);
  const [candidate, setCandidate] = useState(String(profiles[0]?.id ?? ''));
  const [job, setJob] = useState(String(jobs[0]?.id ?? ''));
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [submissions, setSubmissions] = useState(() => read('jobfinder_submissions', []));

  const selectedProfile = useMemo(() => profiles.find(p => String(p.id) === candidate), [profiles, candidate]);

  function submit(e) {
    e.preventDefault();
    const person = profiles.find(p => String(p.id) === candidate);
    const position = jobs.find(j => String(j.id) === job);
    if (!person || !position) {
      setMessageType('error');
      setMessage('กรุณาเลือกผู้สมัครที่กดสนใจและตำแหน่งงาน');
      return;
    }
    const duplicate = submissions.some(s => String(s.candidateId) === String(person.id) && String(s.positionId) === String(position.id));
    if (duplicate) {
      setMessageType('error');
      setMessage('ผู้สมัครคนนี้ถูกส่งให้ตำแหน่งนี้แล้ว หากต้องการส่งตำแหน่งอื่นให้เลือกตำแหน่งงานใหม่');
      return;
    }
    const item = {
      id: `submission-${Date.now()}`,
      candidateId: person.id,
      candidateName: person.name,
      candidateEmail: person.email || '',
      candidatePosition: person.position || '',
      candidateLocation: person.location || '',
      candidateSkills: person.skills || [],
      candidateExperience: person.exp || '',
      candidateEducation: person.education || '',
      expectedSalary: Number(person.expectedSalary || person.salary || 0),
      positionId: position.id,
      jobTitle: position.title,
      company: position.company,
      note: note.trim(),
      // A candidate enters the recruitment board only after this submission is saved.
      status: 'ส่งลูกค้า',
      date: new Date().toISOString(),
    };
    const next = [item, ...submissions];
    setSubmissions(next);
    save('jobfinder_submissions', next);
    setMessageType('success');
    setMessage('ส่งข้อมูลผู้สมัครเข้าบอร์ดติดตามเรียบร้อยแล้ว');
    setNote('');
  }

  return <>
    <PageTitle eyebrow="CANDIDATE SUBMISSION" title="ส่งข้อมูลผู้สมัคร" description="เลือกเฉพาะผู้สมัครที่กดสนใจ แล้วส่งข้อมูลให้บริษัทเพื่อเริ่มติดตามในบอร์ด" />

    {!profiles.length ? <Empty title="ยังไม่มีผู้สมัครที่สนใจ" text="ไปที่หน้าค้นหาผู้สมัคร แล้วกด “สนใจผู้สมัคร” ก่อน จึงจะสามารถส่งข้อมูลได้" /> : <form className="panel profile-form form-stack submission-form" onSubmit={submit}>
      <div className="form-grid submission-form-grid">
        <label>ผู้สมัครที่สนใจ
          <select value={candidate} onChange={e => setCandidate(e.target.value)} required>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.name} — {p.position || 'ไม่ระบุตำแหน่ง'}</option>)}
          </select>
        </label>
        <label>ตำแหน่งงานของบริษัท
          <select value={job} onChange={e => setJob(e.target.value)} required>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.company}</option>)}
          </select>
        </label>
        {selectedProfile && <div className="submission-selected-summary span-two">
          <strong>{selectedProfile.name}</strong>
          <span>{selectedProfile.position || 'ไม่ระบุตำแหน่ง'} · {selectedProfile.location || 'ไม่ระบุพื้นที่'}</span>
          <span>ประสบการณ์ {selectedProfile.exp || 'ไม่ระบุ'} · เงินเดือนที่คาดหวัง {Number(selectedProfile.expectedSalary || selectedProfile.salary || 0) ? `${Number(selectedProfile.expectedSalary || selectedProfile.salary).toLocaleString('th-TH')} บาท/เดือน` : 'ไม่ระบุ'}</span>
          <div className="tag-row">{(selectedProfile.skills || []).map(skill => <span className="tag" key={skill}>{skill}</span>)}</div>
        </div>}
        <label className="span-two">หมายเหตุสำหรับผู้ว่าจ้าง<textarea rows="3" value={note} onChange={e => setNote(e.target.value)} placeholder="สรุปประสบการณ์หรือเหตุผลที่แนะนำผู้สมัคร" /></label>
      </div>
      {message && <div className={`notice ${messageType === 'error' ? 'error' : 'success'}`}>{message}</div>}
      <button className="btn btn-primary" type="submit">＋ บันทึกการส่งข้อมูลและเพิ่มเข้าบอร์ด</button>
      <p className="auth-note">เมื่อส่งข้อมูลแล้ว ผู้สมัครจะปรากฏในบอร์ดติดตามที่ขั้น “ส่งลูกค้า” ข้อมูลนี้บันทึกในเบราว์เซอร์เท่านั้น</p>
    </form>}

    <div className="section-head"><div><h2>ประวัติการส่งข้อมูล</h2><p>แสดงรายการที่ส่งแล้ว โดยไม่แสดงรายการซ้ำของผู้สมัครและตำแหน่งเดียวกัน</p></div></div>
    {submissions.length ? <div className="panel"><div className="table-wrap"><table>
      <thead><tr><th>ผู้สมัคร</th><th>ตำแหน่งงาน</th><th>บริษัท</th><th>วันที่</th><th>สถานะ</th></tr></thead>
      <tbody>{submissions.map(x => <tr key={x.id}><td>{x.candidateName}</td><td>{x.jobTitle}</td><td>{x.company}</td><td>{x.date ? new Date(x.date).toLocaleDateString('th-TH') : '—'}</td><td><span className="status-pill">{x.status || 'ส่งลูกค้า'}</span></td></tr>)}</tbody>
    </table></div></div> : <Empty title="ยังไม่มีประวัติส่งข้อมูล" text="เมื่อส่งผู้สมัครที่สนใจแล้ว รายการจะแสดงที่นี่" />}
  </>;
}
