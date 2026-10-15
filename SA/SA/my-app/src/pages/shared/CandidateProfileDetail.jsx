import { useParams, Link } from 'react-router-dom';
import { PageTitle, Empty } from '../../components/SharedComponents';
import { read } from '../../utils/storage';

export default function CandidateProfileDetail() {
  const { id } = useParams();
  const profiles = read('jobfinder_demo_candidates', [
    { id: 1, name: 'พิมพ์ชนก วัฒนกิจ', position: 'Frontend Developer', location: 'กรุงเทพฯ', skills: ['React', 'JavaScript', 'CSS'], exp: '2 ปี', about: 'นักพัฒนา Frontend ที่สนใจสร้างประสบการณ์ใช้งานที่ดี' },
    { id: 2, name: 'ธนกร ใจดี', position: 'Data Analyst', location: 'นนทบุรี', skills: ['SQL', 'Python', 'Excel'], exp: '3 ปี', about: 'สนใจการวิเคราะห์ข้อมูลและการสร้างรายงาน' },
    { id: 3, name: 'ณัฐชา แสงทอง', position: 'UX/UI Designer', location: 'นครปฐม', skills: ['Figma', 'UX Research', 'UI Design'], exp: '1 ปี', about: 'ออกแบบผลิตภัณฑ์ดิจิทัลโดยยึดผู้ใช้เป็นศูนย์กลาง' },
    { id: 4, name: 'กิตติพงษ์ ศรีสุข', position: 'Backend Developer', location: 'ทำงานทางไกล', skills: ['Node.js', 'PostgreSQL', 'API'], exp: '4 ปี', about: 'พัฒนา API และระบบฐานข้อมูล' }
  ]);
  const p = profiles.find(x => String(x.id) === String(id));
  return (
    <>
      <PageTitle eyebrow="CANDIDATE PROFILE" title="โปรไฟล์ผู้สมัคร" description="รายละเอียดและคุณสมบัติของผู้สมัคร" action={<Link className="btn btn-outline" to="-1" onClick={e => { e.preventDefault(); window.history.back() }}>← กลับ</Link>} />
      {!p ? <Empty title="ไม่พบโปรไฟล์" text="ไม่พบข้อมูลผู้สมัครนี้" /> : 
        <div className="profile-layout">
          <section className="panel profile-summary">
            <div className="profile-avatar">{p.name.charAt(0)}</div><h2>{p.name}</h2><p>{p.position}</p><span className="status-pill">เปิดรับโอกาส</span>
            <div className="candidate-meta">⌖ {p.location} · ประสบการณ์ {p.exp}</div>
            <a className="btn btn-primary btn-wide" href={`mailto:${p.email || ''}?subject=${encodeURIComponent('โอกาสงาน ' + p.position)}`}>ติดต่อผู้สมัคร</a>
          </section>
          <section className="panel profile-form">
            <h2>เกี่ยวกับผู้สมัคร</h2><p>{p.about || 'ยังไม่มีข้อมูลแนะนำตัว'}</p>
            <h3>ทักษะ</h3><div className="tag-row">{p.skills.map(s => <span className="tag" key={s}>{s}</span>)}</div>
            <h3>ประสบการณ์</h3><p>{p.exp || p.experience || 'ยังไม่ได้ระบุ'} · {p.position}</p>
            <h3>ประวัติการศึกษา</h3><p>{p.education || 'ยังไม่ได้ระบุ'}</p>
            {p.resume?.name && <p>Resume: {p.resume.dataUrl ? <a href={p.resume.dataUrl} download={p.resume.name}>{p.resume.name} (ดาวน์โหลด)</a> : p.resume.name}</p>}

          </section>
        </div>
      }
    </>
  );
}