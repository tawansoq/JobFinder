import { useState } from 'react';
import { useAuth, roleLabel } from '../../context/AuthContext';
import { PageTitle } from '../../components/SharedComponents';
import { read, save } from '../../utils/storage';

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(() => read('jobfinder_posts', [{ id: 1, author: 'ทีม Jobfinder', role: 'ข่าวสาร', text: 'ยินดีต้อนรับสู่ชุมชน Jobfinder แชร์ความรู้และโอกาสการทำงานที่เป็นประโยชน์ได้ที่นี่', date: new Date().toISOString() }]));
  const [draft, setDraft] = useState('');
  
  function publish(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    const next = [{ id: Date.now(), author: user?.name || user?.company || 'ผู้ใช้งาน', role: roleLabel(user?.role), text: draft.trim(), date: new Date().toISOString() }, ...posts];
    setPosts(next); save('jobfinder_posts', next); setDraft('');
  }
  
  return (
    <>
      <PageTitle eyebrow="COMMUNITY" title="ชุมชนและข่าวสาร" description="พื้นที่แบ่งปันความรู้ ข่าวสาร และประสบการณ์ด้านอาชีพ" />
      <form className="panel community-compose" onSubmit={publish}>
        <label htmlFor="post-draft">มีอะไรอยากแบ่งปันไหม?</label>
        <textarea id="post-draft" rows="3" value={draft} onChange={e => setDraft(e.target.value)} placeholder="เขียนโพสต์หรือแบ่งปันเคล็ดลับการทำงาน…" />
        <div className="compose-footer">
          <span className="muted-note">โพสต์จะแสดงในเบราว์เซอร์นี้เท่านั้น</span>
          <button className="btn btn-primary" type="submit" disabled={!draft.trim()}>เผยแพร่โพสต์</button>
        </div>
      </form>
      <div className="community-feed">
        {posts.map(p => (
          <article className="panel community-post" key={p.id}>
            <div className="post-author"><div className="profile-avatar small-avatar">{(p.author || 'U').charAt(0)}</div><div><b>{p.author}</b><small>{p.role || 'สมาชิก'} · {p.date ? new Date(p.date).toLocaleString('th-TH') : ''}</small></div></div>
            <p>{p.text}</p>
            {p.author === (user?.name || user?.company) && <button className="btn btn-outline" onClick={() => { const next = posts.filter(x => x.id !== p.id); setPosts(next); save('jobfinder_posts', next) }}>ลบโพสต์</button>}
          </article>
        ))}
      </div>
    </>
  );
}