import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Building2, Mail, Lock, Eye, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate(); // เรียกใช้งาน hook สำหรับเปลี่ยนหน้า

  const [selectedRoleType, setSelectedRoleType] = useState('recruiter'); // 'candidate', 'recruiter', 'company'
  const [subRole, setSubRole] = useState('Recruiter'); // 'Recruiter', 'Team Leader / Manager'
  const [email, setEmail] = useState('somsak.recruiter@manpower.co.th');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // ฟังก์ชันสำหรับจัดการเมื่อกดปุ่มเข้าสู่ระบบ
  const handleLogin = (e) => {
    e.preventDefault();
    
    // ตรงนี้คุณสามารถเพิ่มการเรียก API ไปยัง Backend ที่โฟลเดอร์ server/ ของคุณได้
    // ตัวอย่างเช่น: axios.post('/api/login', { email, password, subRole })

    // เมื่อล็อกอินสำเร็จ (หรือจำลองการกด) ให้พาไปหน้า Dashboard ทันที
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Top Tag */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-800"></span>
            FR001 / UC001 • TALENT GATEWAY
          </span>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">ยินดีต้อนรับ</h2>
          <p className="text-xs text-slate-500 mt-1">กรุณาเลือกบทบาทของคุณเพื่อเริ่มใช้งานระบบ</p>
        </div>

        {/* Role Cards Selection */}
        <div className="grid grid-cols-3 gap-3">
          {/* Candidate Card */}
          <div 
            onClick={() => setSelectedRoleType('candidate')}
            className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between ${
              selectedRoleType === 'candidate' 
                ? 'border-teal-700 bg-teal-50/20 shadow-sm ring-1 ring-teal-700' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-3">
                <User size={18} />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">มาหางาน</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                ผู้หางาน / Candidate ค้นหางานที่ใช่ สำหรับคุณ พร้อมแนะนำตำแหน่งที่ตรงกับทักษะ
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-slate-900">
              ดำเนินการต่อ <ArrowRight size={14} className="ml-1" />
            </div>
          </div>

          {/* Recruiter Card (Active) */}
          <div 
            onClick={() => setSelectedRoleType('recruiter')}
            className={`cursor-pointer rounded-xl p-4 border relative transition-all flex flex-col justify-between ${
              selectedRoleType === 'recruiter' 
                ? 'border-teal-700 bg-teal-50/30 shadow-sm ring-1 ring-teal-700' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {selectedRoleType === 'recruiter' && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-teal-800 text-white text-[9px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap shadow-sm">
                แนะนำสำหรับเจ้าหน้าที่
              </span>
            )}
            <div>
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 mb-3">
                <Briefcase size={18} />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">หาคนสมัครงาน</h3>
                <CheckCircle2 size={16} className="text-teal-700" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Recruiter / สรรหาบุคลากร ค้นหาผู้สมัครที่มีเหมาะสม กับตำแหน่งงานของคุณ และบริหารจัดการไปป์ไลน์
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-800">
              ดำเนินการต่อ <ArrowRight size={14} className="ml-1" />
            </div>
          </div>

          {/* Company Card */}
          <div 
            onClick={() => setSelectedRoleType('company')}
            className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between ${
              selectedRoleType === 'company' 
                ? 'border-teal-700 bg-teal-50/20 shadow-sm ring-1 ring-teal-700' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-3">
                <Building2 size={18} />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">บริษัท</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Company / บริษัทลูกค้า จัดการข้อมูลบริษัท ประกาศรับสมัครงาน และติดตามความคืบหน้าการส่งมอบ
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-slate-900">
              ดำเนินการต่อ <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
        </div>

        {/* Sub-form section for Corporate Authentication */}
        <form onSubmit={handleLogin} className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">UC001 • CORPORATE AUTHENTICATION</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">เข้าสู่ระบบด้วยบัญชีบริษัท Man จำกัด</h3>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              BR001 Single Sign-On
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">เลือกประเภทสิทธิ์การใช้งาน (Role)</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-200/60 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSubRole('Recruiter')}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  subRole === 'Recruiter' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase size={14} /> Recruiter
              </button>
              <button
                type="button"
                onClick={() => setSubRole('Team Leader / Manager')}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  subRole === 'Team Leader / Manager' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User size={14} /> Team Leader / Manager
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">อีเมลองค์กร (Corporate Email)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-600">รหัสผ่าน (Password)</label>
              <a href="#" className="text-[11px] text-teal-700 hover:underline">ลืมรหัสผ่าน?</a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400">
                <Eye size={16} />
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-700" 
              />
              <span className="text-slate-600">จดจำการเข้าสู่ระบบ</span>
            </label>
            <span className="text-[10px] text-slate-400">SSL 256-bit</span>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            เข้าสู่ระบบ (Sign In) <ArrowRight size={14} />
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-600">
            <ShieldCheck size={14} className="text-teal-700" /> Better People, Better Tomorrow
          </div>
          <p className="text-[10px] text-slate-400">Manpower Recruitment Suite • All Rights Reserved</p>
        </div>

      </div>
    </div>
  );
}