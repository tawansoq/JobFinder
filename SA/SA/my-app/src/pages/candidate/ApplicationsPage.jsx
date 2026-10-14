import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle, Stat, Empty } from '../../components/SharedComponents';
import { DEMO_JOBS } from '../../data/mockData';
import { read, save } from '../../utils/storage';

export default function ApplicationsPage() {
  const jobs = [...read('jobfinder_company_jobs', []), ...read('jobfinder_jobs', DEMO_JOBS)];
  const [apps, setApps] = useState(() => read('jobfinder_applied', []).filter(a => !a.candidateEmail || a.candidateEmail === read('jobfinder_user', {})?.email));
  const clear = id => { const next = apps.filter(a => String(a.jobId) !== String(id)); setApps(next); save('jobfinder_applied', next); };
  const list = apps.map(a => ({ ...a, job: jobs.find(j => String(j.id) === String(a.jobId)) })).filter(a => a.job);
  return (
    <>
      <PageTitle eyebrow="MY APPLICATIONS" title="งานที่สมัครไว้" description="ติดตามรายการสมัครงานของคุณได้จากหน้านี้" />
      <div className="stats-grid">
        <Stat label="สมัครทั้งหมด" value={list.length} sub="รายการใบสมัคร" icon="▤" />
        <Stat label="รอการติดต่อ" value={list.filter(a => a.status === 'สมัครงาน').length} sub="สถานะปัจจุบัน" icon="◷" />
      </div>
      {list.length ? 
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>ตำแหน่งงาน</th><th>บริษัท</th><th>วันที่สมัคร</th><th>สถานะ</th><th></th></tr></thead>
              <tbody>
                {list.map(a => (
                  <tr key={a.jobId}>
                    <td><Link className="table-link" to={`/jobs/${a.job.id}`}>{a.job.title}</Link></td>
                    <td>{a.job.company}</td>
                    <td>{new Date(a.date).toLocaleDateString('th-TH')}</td>
                    <td><span className="status-pill">{a.status}</span>{a.reason && <small className="table-sub">เหตุผล: {a.reason}</small>}</td>
                    <td><button className="text-btn" onClick={() => clear(a.jobId)}>นำออก</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> 
        : <Empty icon="▤" title="ยังไม่มีใบสมัคร" text="เมื่อคุณสมัครงาน รายการจะปรากฏในหน้านี้" action={<Link className="btn btn-primary" to="/jobs">ค้นหางาน</Link>} />
      }
    </>
  );
}