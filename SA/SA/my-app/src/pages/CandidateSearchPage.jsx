import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LOCATIONS = ['กรุงเทพ', 'นนทบุรี', 'ปทุมธานี', 'นครปฐม', 'สุพรรณบุรี'];
const SKILLS = ['Java', 'Python', 'SQL', 'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Spring Boot', 'Docker'];
const EXPERIENCE = [
  { label: 'ทุกช่วงประสบการณ์', min: '', max: '' },
  { label: '0–1 ปี', min: 0, max: 1 },
  { label: '1–3 ปี', min: 1, max: 3 },
  { label: '3–5 ปี', min: 3, max: 5 },
  { label: '5 ปีขึ้นไป', min: 5, max: '' },
];

function matchStyle(p) {
  if (p >= 85) return 'bg-green-100 text-green-700';
  if (p >= 70) return 'bg-amber-100 text-amber-700';
  return 'bg-slate-200 text-slate-600';
}

function Select({ label, value, onChange, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-normal"
      >
        {children}
      </select>
    </label>
  );
}

export default function CandidateSearchPage() {
  const [keyword, setKeyword] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [jobId, setJobId] = useState('');
  const [skill, setSkill] = useState('');
  const [location, setLocation] = useState('');
  const [exp, setExp] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [result, setResult] = useState({ total: 0, data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/jobs').then((r) => r.json()).then(setJobs).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (submitted) params.set('q', submitted);
    if (jobId) params.set('job_id', jobId);
    if (skill) params.set('skill', skill);
    if (location) params.set('location', location);
    const e = EXPERIENCE[exp];
    if (e.min !== '') params.set('min_exp', e.min);
    if (e.max !== '') params.set('max_exp', e.max);

    setLoading(true);
    setError('');
    fetch(`/api/candidates?${params}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('โหลดข้อมูลไม่สำเร็จ'))))
      .then(setResult)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [submitted, jobId, skill, location, exp]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-4 text-2xl font-semibold">ค้นหาผู้สมัครงาน</h1>

      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(keyword.trim()); }}
        className="flex gap-3"
      >
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="ค้นหาชื่อ, ตำแหน่งงาน หรือคำสำคัญ"
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3"
        />
        <button className="rounded-2xl bg-action px-8 py-3 font-semibold text-white shadow hover:opacity-90">
          ค้นหา
        </button>
      </form>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Select label="คำนวณ Match กับตำแหน่ง" value={jobId} onChange={setJobId}>
          <option value="">ไม่ระบุตำแหน่ง</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title} – {j.company}</option>)}
        </Select>
        <Select label="ประสบการณ์" value={exp} onChange={(v) => setExp(Number(v))}>
          {EXPERIENCE.map((x, i) => <option key={x.label} value={i}>{x.label}</option>)}
        </Select>
        <Select label="ทักษะ" value={skill} onChange={setSkill}>
          <option value="">ทุกทักษะ</option>
          {SKILLS.map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Select label="พื้นที่" value={location} onChange={setLocation}>
          <option value="">ทุกพื้นที่</option>
          {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
        </Select>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-brand">
        <span className="font-semibold">พบผู้สมัคร {result.total.toLocaleString()} คน</span>
        <span>{jobId ? 'เรียงตาม: % Match' : 'เรียงตาม: ล่าสุด'}</span>
      </div>

      {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-red-600">{error} — ตรวจสอบว่า Docker และ API ทำงานอยู่</p>}
      {loading && <p className="mt-3 text-slate-500">กำลังโหลด…</p>}
      {!loading && !error && result.data.length === 0 && (
        <p className="mt-3 rounded-lg bg-white p-6 text-center text-slate-500">ไม่พบผู้สมัครที่ตรงกับเงื่อนไข ลองลดตัวกรองลง</p>
      )}

      <ul className="mt-3 space-y-4">
        {result.data.map((c) => (
          <li key={c.id} className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xl font-semibold text-brand">
              {c.full_name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{c.full_name}</div>
              <div className="text-sm text-slate-500">{c.desired_position}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.skills.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-blue-50 px-3 py-1 text-sm">{s}</span>
                ))}
                {c.skills.length > 3 && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm">+{c.skills.length - 3}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              {c.match_percent !== null && (
                <span className={`rounded-lg px-3 py-1 text-xl font-semibold ${matchStyle(c.match_percent)}`}>
                  {c.match_percent}% match
                </span>
              )}
              <div className="text-sm text-slate-500">ประสบการณ์ {Number(c.years_experience)} ปี · {c.location}</div>
              <div className="flex gap-2">
                <Link to={`/candidates/${c.id}`} className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm hover:bg-slate-50">
                  ดูโปรไฟล์
                </Link>
                <a href={`mailto:${c.email}`} className="rounded-lg bg-action px-4 py-1.5 text-sm text-white hover:opacity-90">
                  ติดต่อ
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
