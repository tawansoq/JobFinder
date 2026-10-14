import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

export default function CompanyJobs() {
  const [jobs, setJobs] = useState(() => read('jobfinder_company_jobs', []));
  const nav = useNavigate();
  
  const remove = id => { 
    if(window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศงานนี้?')) {
        const n = jobs.filter(j => j.id !== id); 
        setJobs(n); 
        save('jobfinder_company_jobs', n); 
    }
  };

  const editJob = (id) => {
    nav(`/company/jobs/edit/${id}`);
  };

  return (
    <>
      <PageTitle eyebrow="JOB MANAGEMENT" title="ประกาศงานของฉัน" description="ดูแลตำแหน่งงานที่บริษัทสร้างไว้" action={<Link className="btn btn-primary" to="/company/jobs/new">＋ ลงประกาศงาน</Link>} />
      {jobs.length ? 
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>ตำแหน่ง</th><th>สถานที่</th><th>ประเภท</th><th>เงินเดือน</th><th>จัดการ</th></tr></thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id}>
                    <td><b>{j.title}</b></td><td>{j.location}</td><td>{j.type}</td><td>{j.salary || 'ตามตกลง'}</td>
                    <td>
                      <button className="text-btn" onClick={() => editJob(j.id)}>แก้ไข</button> | 
                      <button className="text-btn danger-text" onClick={() => remove(j.id)}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> 
        : <Empty icon="▤" title="ยังไม่มีประกาศงาน" text="ประกาศงานที่สร้างจะปรากฏที่นี่" action={<Link className="btn btn-primary" to="/company/jobs/new">สร้างประกาศงาน</Link>} />
      }
    </>
  );
}