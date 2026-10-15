import { useState, useMemo } from 'react';
import { PageTitle, Stat } from '../../components/SharedComponents';
import { DEMO_JOBS } from '../../data/mockData';
import { read } from '../../utils/storage';

export default function ReportPage() {
  const jobs = [...read('jobfinder_company_jobs', []), ...read('jobfinder_jobs', DEMO_JOBS)];
  const allApps = read('jobfinder_applied', []);
  const submissions = read('jobfinder_submissions', []);
  const [filterPeriod, setFilterPeriod] = useState('all'); 
  
  const filteredApps = useMemo(() => {
    if (filterPeriod === 'all') return allApps;
    const now = new Date();
    const start = new Date(now);
    if (filterPeriod === 'daily') start.setHours(0, 0, 0, 0);
    if (filterPeriod === 'weekly') { const day = (start.getDay() + 6) % 7; start.setDate(start.getDate() - day); start.setHours(0, 0, 0, 0); }
    if (filterPeriod === 'monthly') { start.setDate(1); start.setHours(0, 0, 0, 0); }
    return allApps.filter(a => {
      const raw = a.date || a.appliedAt || a.createdAt;
      if (!raw) return false;
      const d = new Date(raw);
      return !Number.isNaN(d.getTime()) && d >= start && d <= now;
    });
  }, [allApps, filterPeriod]);

  const rows = [
    ['ใบสมัครทั้งหมด', filteredApps.length],
    ['ผ่านสัมภาษณ์', filteredApps.filter(a => a.status === 'ผ่านสัมภาษณ์').length],
    ['รอพิจารณา', filteredApps.filter(a => !['ไม่ผ่าน', 'ผ่านสัมภาษณ์', 'เริ่มงาน'].includes(a.status)).length],
    ['ไม่ผ่าน', filteredApps.filter(a => a.status === 'ไม่ผ่าน' || a.interviewResult === 'ไม่ผ่าน').length],
    ['เริ่มงาน', filteredApps.filter(a => a.status === 'เริ่มงาน').length]
  ];
  
  const csv = [['รายการ', 'จำนวน'], ...rows].map(r => r.map(v => '"' + String(v).replaceAll('"', '""') + '"').join(',')).join('\r\n');
  
  function exportCSV() {
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = `jobfinder-report-${filterPeriod}.csv`; a.click(); URL.revokeObjectURL(url);
  }
  
  return (
    <>
      <PageTitle eyebrow="RECRUITMENT REPORT" title="รายงานการสรรหา" description="ภาพรวมผลการสรรหาและสถานะใบสมัคร" action={<button className="btn btn-primary" onClick={exportCSV}>↓ ส่งออก CSV</button>} />
      
      <div className="filter-panel" style={{marginBottom: '1rem'}}>
          <label style={{marginRight: '1rem'}}><b>ช่วงเวลา:</b></label>
          <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
              <option value="all">ทั้งหมด (All-time)</option>
              <option value="daily">รายวัน (Daily)</option>
              <option value="weekly">รายสัปดาห์ (Weekly)</option>
              <option value="monthly">รายเดือน (Monthly)</option>
          </select>
      </div>

      <div className="stats-grid">
        <Stat label="ตำแหน่งงานที่มองเห็น" value={jobs.length} sub="รวมประกาศงานทั้งหมด" icon="▤" />
        <Stat label="ใบสมัคร (ตามช่วงเวลา)" value={filteredApps.length} sub={`คัดกรอง: ${filterPeriod}`} icon="♙" />
        <Stat label="ส่งข้อมูลผู้สมัคร" value={submissions.length} sub="ประวัติการเสนอผู้สมัคร" icon="⇢" />
      </div>
      <div className="panel report-panel">
        <h2>สรุปสถานะใบสมัคร ({filterPeriod})</h2>
        <div className="report-bars">
          {rows.map(([label, value]) => (
            <div className="report-row" key={label}>
              <div><span>{label}</span><b>{value}</b></div>
              <div className="progress"><i style={{ width: `${filteredApps.length ? Math.max(value / filteredApps.length * 100, value ? 6 : 0) : 0}%` }} /></div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}