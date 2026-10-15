import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageTitle } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [position, setPosition] = useState(user?.position || '');
  const [location, setLocation] = useState(user?.location || 'กรุงเทพฯ');
  const [skills, setSkills] = useState(user?.skills || 'React, JavaScript, SQL');
  const [about, setAbout] = useState(user?.about || '');
  const [education, setEducation] = useState(user?.education || '');
  const [experience, setExperience] = useState(user?.experience || '');
  const [resume, setResume] = useState(user?.resume || null);
  const [msg, setMsg] = useState('');
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { setMsg('ไฟล์ Resume ต้องมีขนาดไม่เกิน 2 MB'); e.target.value = ''; return; }
      const reader = new FileReader();
      reader.onload = () => setResume({ name: file.name, dataUrl: reader.result, type: file.type });
      reader.readAsDataURL(file);
    }
  };

  function submit(e) {
    e.preventDefault();
    const next = { ...user, name, email, phone, position, location, skills, about, education, experience, resume };
    login(next);
    const users = read('jobfinder_users', []).map(u => u.email === user.email ? { ...u, ...next } : u);
    save('jobfinder_users', users);
    setMsg('บันทึกโปรไฟล์เรียบร้อยแล้ว');
  }
  
  return (
    <>
      <PageTitle eyebrow="MY PROFILE" title="โปรไฟล์ของฉัน" description="ข้อมูลที่ครบถ้วนช่วยให้คุณจัดการการสมัครงานได้สะดวกขึ้น" />
      <div className="profile-layout">
        <div className="profile-summary panel">
          <div className="profile-avatar">{(name || 'U').charAt(0).toUpperCase()}</div>
          <h2>{name || 'ชื่อผู้สมัคร'}</h2><p>{position || 'ระบุตำแหน่งที่สนใจ'}</p>
          <div className="profile-completion">
            <div><span>ข้อมูลโปรไฟล์</span><b>{Math.round([name, email, phone, position, about, education, experience, resume].filter(Boolean).length * 12.5)}%</b></div>
            <div className="progress"><i style={{ width: `${[name, email, phone, position, about, education, experience, resume].filter(Boolean).length * 12.5}%` }} /></div>
          </div>
        </div>
        <form className="panel profile-form form-stack" onSubmit={submit}>
          <h2>ข้อมูลส่วนตัว</h2>
          <div className="form-grid">
            <label>ชื่อ-นามสกุล<input value={name} onChange={e => setName(e.target.value)} required /></label>
            <label>อีเมล<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
            <label>เบอร์โทรศัพท์<input value={phone} onChange={e => setPhone(e.target.value)} placeholder="08x-xxx-xxxx" /></label>
            <label>ตำแหน่งที่สนใจ<input value={position} onChange={e => setPosition(e.target.value)} placeholder="เช่น Frontend Developer" /></label>
            <label>พื้นที่ที่ต้องการ
              <select value={location} onChange={e => setLocation(e.target.value)}>
                <option>กรุงเทพฯ</option><option>นนทบุรี</option><option>นครปฐม</option><option>ทำงานทางไกล</option>
              </select>
            </label>
            <label>ทักษะ (คั่นด้วยจุลภาค)<input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, SQL, Figma" /></label>
            <label>ประวัติการศึกษา<input value={education} onChange={e => setEducation(e.target.value)} placeholder="เช่น ปริญญาตรี วิทยาการคอมพิวเตอร์" /></label>
            <label>ประสบการณ์ทำงาน<input value={experience} onChange={e => setExperience(e.target.value)} placeholder="เช่น 2 ปี Frontend Developer" /></label>
            <label className="span-two">แนะนำตัว<textarea rows="4" value={about} onChange={e => setAbout(e.target.value)} placeholder="เล่าประสบการณ์และเป้าหมายของคุณ" /></label>
            <label className="span-two">อัปโหลด Resume (PDF)
              <div className="file-upload-wrapper">
                <input type="file" accept=".pdf,application/pdf" onChange={handleFileUpload} />
                {resume && <span className="file-name-display" style={{marginLeft:'10px', color:'var(--brand-color)'}}>ไฟล์: {resume.name} {resume.dataUrl && <a href={resume.dataUrl} download={resume.name}>ดาวน์โหลด</a>}</span>}
              </div>
            </label>
          </div>
          {msg && <div className="notice success">{msg}</div>}
          <div className="form-footer"><button className="btn btn-primary">บันทึกข้อมูล</button></div>
        </form>
      </div>
    </>
  );
}