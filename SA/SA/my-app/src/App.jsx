import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import CandidateSearchPage from './pages/CandidateSearchPage.jsx';
import Login from './pages/Login.jsx'; // นำเข้าหน้า Login

const Soon = ({ title }) => (
  <div className="rounded-xl bg-white p-8 text-slate-500 shadow-sm">{title} — กำลังพัฒนา</div>
);

export default function App() {
  return (
    <Routes>
      {/* 1. กำหนดให้หน้าแรก (Path "/") แสดงหน้า Login */}
      <Route path="/" element={<Login />} />

      {/* 2. หน้าหลังบ้านทั้งหมดที่จะแสดง Header / Sidebar หลังจากล็อกอินแล้ว */}
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Soon title="แดชบอร์ดผู้สรรหา" />} />
        <Route path="search" element={<CandidateSearchPage />} />
        <Route path="pipeline" element={<Soon title="ติดตามสถานะ / นัดสัมภาษณ์" />} />
        <Route path="candidates/:id" element={<Soon title="โปรไฟล์ผู้สมัคร" />} />
      </Route>

      {/* ถ้าพิมพ์ URL ผิด ให้เด้งกลับมาที่หน้า Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}