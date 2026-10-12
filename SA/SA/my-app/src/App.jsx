import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import CandidateSearchPage from './pages/CandidateSearchPage.jsx';

const Soon = ({ title }) => (
  <div className="rounded-xl bg-white p-8 text-slate-500 shadow-sm">{title} — กำลังพัฒนา</div>
);

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/search" replace />} />
        <Route path="dashboard" element={<Soon title="แดชบอร์ดผู้สรรหา" />} />
        <Route path="search" element={<CandidateSearchPage />} />
        <Route path="pipeline" element={<Soon title="ติดตามสถานะ / นัดสัมภาษณ์" />} />
        <Route path="candidates/:id" element={<Soon title="โปรไฟล์ผู้สมัคร" />} />
      </Route>
      <Route path="login" element={<Soon title="เข้าสู่ระบบ / เลือกบทบาท" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
