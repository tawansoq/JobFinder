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
      if(filterPeriod === 'all') return allApps;
      const now = new Date();
      return allApps.filter(a => {
          if(!a.date) return false;
          const appDate = new Date(a.date);
          const diffTime = Math.abs(now - appDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          if(filterPeriod === 'daily') return diffDays <= 1;
          if(filterPeriod === 'weekly') return diffDays <= 7;
          if(filterPeriod === 'monthly') return diffDays <= 30;
          return true;
      });
  }, [allApps, filterPeriod]);

  const rows = [
    ['ใบสมัครทั้งหมด', filteredApps.length],
    ['ผ่านสัมภาษณ์', filteredApps.filter(a => a.status === 'ผ่านสัมภาษณ์').length],
    ['รอพิจารณา', filteredApps.filter(a => !['ผ่านสัมภาษณ์', 'เริ่มงาน'].includes(a.status)).length]
  ];
  
  const csv = [['รายการ', 'จำนวน'], ...rows].map(r => r.map(v => '"' + String(v).replaceAll('"', '""') + '"').join(',')).join('\r\n');
  
  function exportCSV() {
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = `jobfinder-report-${filterPeriod}.csv`; a.click(); URL.revokeObjectURL(url);
  }
  
  return (
    <>
      <PageTitle eyebrow="RECRUITMENT REPORT" title="รายงานการสรรหา" description="ภาพรวมจากข้อมูลตัวอย่างและรายการที่บันทึกในเบราว์เซอร์" action={<button className="btn btn-primary" onClick={exportCSV}>↓ ส่งออก CSV</button>} />
      
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
        <Stat label="ตำแหน่งงานที่มองเห็น" value={jobs.length} sub="รวมงานตัวอย่างและงานที่เพิ่ม" icon="▤" />
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
        <p className="auth-note">รายงานนี้เป็นข้อมูล Frontend สำหรับทดลองเท่านั้น ไม่ใช่สถิติจากฐานข้อมูลส่วนกลาง</p>
      </div>
    </>
  );
}