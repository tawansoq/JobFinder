import { Link } from 'react-router-dom';
import { PageTitle, Stat } from '../../components/SharedComponents';
import { read } from '../../utils/storage';

export default function RecruiterDashboard() {
  const apps = read('jobfinder_applied', []);
  const profiles = read('jobfinder_demo_candidates', []);
  
  return (
    <>
      <PageTitle eyebrow="RECRUITER WORKSPACE" title="ภาพรวมผู้สรรหา" description="ค้นหาผู้สมัคร ส่งข้อมูลเข้ากระบวนการ และติดตามผลได้ในที่เดียว" />
      <div className="welcome-banner">
        <div><span className="banner-kicker">TALENT CONNECTION</span><h2>เชื่อมต่อผู้สมัครกับโอกาสที่เหมาะสม</h2><p>จัดการข้อมูลการสรรหาในพื้นที่เดียว</p><Link className="banner-link" to="/recruiter/candidates">ค้นหาผู้สมัคร →</Link></div>
        <div className="banner-art">♧</div>
      </div>
      <div className="stats-grid">
        <Stat label="โปรไฟล์ตัวอย่าง" value={profiles.length || 4} sub="พร้อมค้นหา" icon="♙" />
        <Stat label="ใบสมัครที่บันทึก" value={apps.length} sub="ใบสมัครที่ได้รับ" icon="▤" />
        <Stat label="ผ่านการคัดเลือก" value={apps.filter(a => a.status === 'ผ่านสัมภาษณ์').length} sub="สถานะใบสมัคร" icon="✓" />
      </div>
      <div className="quick-links">
        <Link className="quick-link panel" to="/recruiter/candidates"><b>ค้นหาผู้สมัคร</b><span>ค้นหาจากตำแหน่งและทักษะ →</span></Link>
        <Link className="quick-link panel" to="/recruiter/submissions"><b>ส่งข้อมูลผู้สมัคร</b><span>เลือกผู้สมัครและงานที่เกี่ยวข้อง →</span></Link>
        <Link className="quick-link panel" to="/recruiter/report"><b>ดูรายงาน</b><span>สรุปผลการสรรหา →</span></Link>
      </div>
    </>
  );
}