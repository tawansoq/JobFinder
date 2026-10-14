import { Link } from 'react-router-dom';
import { PageTitle, Stat, Empty } from '../../components/SharedComponents';
import { DEMO_JOBS } from '../../data/mockData';
import { read } from '../../utils/storage';

export default function CompanyDashboard() {
  const jobs = [...read('jobfinder_company_jobs', []), ...read('jobfinder_jobs', DEMO_JOBS)];
  const mine = read('jobfinder_company_jobs', []);
  const apps = read('jobfinder_company_applications', []);
  
  return (
    <>
      <PageTitle eyebrow="COMPANY WORKSPACE" title="ภาพรวมบริษัท" description="จัดการประกาศงานและติดตามผู้สมัครได้จากที่เดียว" action={<Link className="btn btn-primary" to="/company/jobs/new">＋ ลงประกาศงาน</Link>} />
      <div className="welcome-banner company-banner">
        <div><span className="banner-kicker">LET'S BUILD YOUR TEAM</span><h2>ค้นหาคนที่ใช่สำหรับทีมของคุณ</h2><p>สร้างประกาศงานที่ชัดเจน เพื่อเชื่อมต่อกับผู้สมัครที่เหมาะสม</p><Link className="banner-link" to="/company/jobs/new">สร้างประกาศงานแรกของคุณ →</Link></div>
        <div className="banner-art">♧</div>
      </div>
      <div className="stats-grid">
        <Stat label="ประกาศงานทั้งหมด" value={mine.length} sub="งานที่คุณสร้างในเครื่องนี้" icon="▤" />
        <Stat label="ผู้สมัคร" value={apps.length} sub="ใบสมัครตัวอย่าง" icon="♙" />
        <Stat label="งานตัวอย่างในระบบ" value={jobs.length} sub="ข้อมูลสำหรับทดลองใช้งาน" icon="⌕" />
      </div>
      <div className="section-head"><div><h2>ประกาศงานล่าสุด</h2><p>งานที่คุณสร้างไว้</p></div><Link className="text-link" to="/company/jobs">ดูทั้งหมด →</Link></div>
      {mine.length ? 
        <div className="job-list">{mine.map(j => <article className="job-card" key={j.id}><div className="company-logo">{(j.title || 'J').charAt(0)}</div><div className="job-main"><div className="job-title">{j.title}</div><div className="company-name">{j.location} · {j.type}</div><div className="job-meta"><span>฿ {j.salary || 'ตามตกลง'}</span></div></div><span className="status-pill">เผยแพร่แล้ว</span></article>)}</div> 
        : <Empty icon="▤" title="ยังไม่มีประกาศงาน" text="เริ่มต้นด้วยการสร้างประกาศงานเพื่อให้ผู้สมัครเห็นตำแหน่งที่เปิดรับ" action={<Link className="btn btn-primary" to="/company/jobs/new">＋ ลงประกาศงาน</Link>} />
      }
    </>
  );
}