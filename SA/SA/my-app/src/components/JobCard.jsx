import { Link } from 'react-router-dom';

export default function JobCard({ job, saved, onSave, onApply, applied = false }) {
  return (
    <article className="job-card">
      <div className="company-logo">{job.company?.charAt(0) || 'J'}</div>
      <div className="job-main">
        <div className="job-title-row">
          <Link to={`/jobs/${job.id}`} className="job-title">{job.title}</Link>
          <button className={`save-btn ${saved ? 'is-saved' : ''}`} onClick={() => onSave(job.id)} aria-label="บันทึกงาน">
            {saved ? '♥' : '♡'}
          </button>
        </div>
        <div className="company-name">{job.company}</div>
        <div className="job-meta"><span>⌖ {job.location}</span><span>◷ {job.type}</span><span>฿ {job.salary}</span></div>
        <div className="tag-row">{(job.tags || []).map(t => <span className="tag" key={t}>{t}</span>)}</div>
      </div>
      <div className="job-action">
        <small>{job.posted}</small>
        {applied ? <span className="status-pill">สมัครแล้ว</span> : <button className="btn btn-primary btn-sm" onClick={() => onApply(job.id)}>สมัครงาน</button>}
      </div>
    </article>
  );
}