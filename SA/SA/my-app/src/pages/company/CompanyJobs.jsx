import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

export default function CompanyJobs() {
  const [jobs, setJobs] = useState(() => {
    const existing = read('jobfinder_company_jobs', []);
    
    // 🟢 ถ้าไม่มีประกาศงานเลย ให้สร้างข้อมูลจำลองขึ้นมา 3 ตำแหน่ง
    if (existing.length === 0) {
       const mockJobs = [
         { id: 101, title: 'Frontend Developer', company: 'บริษัท เทคพลัส จำกัด', location: 'กรุงเทพฯ', type: 'Full-time', salary: '35,000 - 50,000', tags: ['React', 'JavaScript', 'CSS'] },
         { id: 102, title: 'UX/UI Designer', company: 'บริษัท ดิจิทัล โซลูชั่นส์ จำกัด', location: 'ทำงานทางไกล', type: 'Full-time', salary: '28,000 - 45,000', tags: ['Figma', 'UI Design'] },
         { id: 103, title: 'Marketing Coordinator', company: 'บริษัท มาร์เก็ตติ้ง โปร จำกัด', location: 'กรุงเทพฯ', type: 'Contract', salary: '30,000', tags: ['Social Media', 'Content'] }
       ];
       save('jobfinder_company_jobs', mockJobs);
       return mockJobs;
    }
    return existing;
  });
  
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
      <PageTitle 
        eyebrow="JOB MANAGEMENT" 
        title="ประกาศงานของฉัน" 
        description="ดูแลตำแหน่งงานที่บริษัทสร้างไว้" 
        action={<Link className="btn btn-primary" to="/company/jobs/new" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>＋ ลงประกาศงาน</Link>} 
      />
      
      {jobs.length ? 
        <div className="panel" style={{ padding: '1rem', marginTop: '1rem' }}>
          <div className="table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-light)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '1.2rem 1rem', width: '35%', fontSize: '1.05rem' }}>ตำแหน่งและบริษัท</th>
                  <th style={{ padding: '1.2rem 1rem', width: '20%', fontSize: '1.05rem' }}>สถานที่</th>
                  <th style={{ padding: '1.2rem 1rem', width: '15%', fontSize: '1.05rem' }}>ประเภท</th>
                  <th style={{ padding: '1.2rem 1rem', width: '18%', fontSize: '1.05rem' }}>เงินเดือน</th>
                  <th style={{ padding: '1.2rem 1rem', width: '12%', textAlign: 'center', fontSize: '1.05rem' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1.5rem 1rem' }}>
                      {/* 🟢 แสดงชื่อตำแหน่งตัวหนา และชื่อบริษัทตัวเล็กสีเทาอยู่ด้านล่าง */}
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{j.title}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '4px' }}>{j.company || 'ไม่ระบุชื่อบริษัท'}</div>
                    </td>
                    <td style={{ padding: '1.5rem 1rem', fontSize: '1rem', color: 'var(--text-light)' }}>{j.location}</td>
                    <td style={{ padding: '1.5rem 1rem', fontSize: '1rem', color: 'var(--text-light)' }}>{j.type}</td>
                    <td style={{ padding: '1.5rem 1rem', fontSize: '1rem', color: 'var(--text-light)' }}>{j.salary || 'ตามตกลง'}</td>
                    <td style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                      <button className="text-btn" style={{ fontSize: '1rem', color: 'var(--brand-color)', fontWeight: '500', marginRight: '10px' }} onClick={() => editJob(j.id)}>แก้ไข</button> 
                      <span style={{ color: 'var(--border-color)' }}>|</span>
                      <button className="text-btn danger-text" style={{ fontSize: '1rem', fontWeight: '500', marginLeft: '10px' }} onClick={() => remove(j.id)}>ลบ</button>
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