import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, homeForRole } from './context/AuthContext';
import { Protected, AppShell } from './components/Layout';

// หน้า Login & Candidate
import LoginPage from './pages/auth/LoginPage';
import JobsPage from './pages/candidate/JobsPage';
import JobDetailPage from './pages/candidate/JobDetailPage';
import SavedPage from './pages/candidate/SavedPage';
import ApplicationsPage from './pages/candidate/ApplicationsPage';
import ProfilePage from './pages/candidate/ProfilePage';
import MatchingPage from './pages/candidate/MatchingPage';

// หน้า Company
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyJobs from './pages/company/CompanyJobs';
import NewJobPage from './pages/company/NewJobPage';
import EditJobPage from './pages/company/EditJobPage';
import CompanyProfilePage from './pages/company/CompanyProfilePage';
import Pipeline from './pages/company/Pipeline';

// หน้า Recruiter
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import SubmissionPage from './pages/recruiter/SubmissionPage';

// หน้า Shared / ทั่วไป
import CandidateSearch from './pages/shared/CandidateSearch';
import CandidateProfileDetail from './pages/shared/CandidateProfileDetail';
import CommunityPage from './pages/shared/CommunityPage';
import PipelineBoard from './pages/shared/PipelineBoard';
import ReportPage from './pages/shared/ReportPage';

function Landing() {
  const { user } = useAuth();
  return <Navigate to={user ? homeForRole(user.role) : '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Candidate Routes */}
        <Route element={<Protected role="candidate"><AppShell role="candidate" /></Protected>}>
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/matching" element={<MatchingPage />} />
        </Route>

        {/* Company Routes */}
        <Route element={<Protected role="company"><AppShell role="company" /></Protected>}>
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/company/jobs" element={<CompanyJobs />} />
          <Route path="/company/jobs/new" element={<NewJobPage />} />
          <Route path="/company/jobs/edit/:id" element={<EditJobPage />} />
          <Route path="/company/profile" element={<CompanyProfilePage />} />
          <Route path="/company/board" element={<PipelineBoard />} />
          <Route path="/company/candidates" element={<CandidateSearch />} />
          <Route path="/company/pipeline" element={<Pipeline />} />
          <Route path="/company/report" element={<ReportPage />} />
          <Route path="/candidates/:id" element={<CandidateProfileDetail />} />
        </Route>

        {/* Recruiter Routes */}
        <Route element={<Protected role="recruiter"><AppShell role="recruiter" /></Protected>}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/candidates" element={<CandidateSearch />} />
          <Route path="/recruiter/submissions" element={<SubmissionPage />} />
          <Route path="/recruiter/board" element={<PipelineBoard />} />
          <Route path="/recruiter/report" element={<ReportPage />} />
          <Route path="/candidates/:id" element={<CandidateProfileDetail />} />
        </Route>

        <Route path="*" element={<Landing />} />
      </Routes>
    </AuthProvider>
  );
}