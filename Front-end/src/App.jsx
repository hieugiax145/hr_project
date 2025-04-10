import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import ForgotPassword from './components/Login/ForgotPassword';
import ResetPassword from './components/Login/ResetPassword';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './components/HR/dashboard';
import RecruitmentRequests from './components/HR/RecruitmentRequests';
import CEORecruitmentRequests from './components/HR/CEORecruitmentRequests';
import OtherRecruitmentRequests from './components/HR/OtherRecruitmentRequests';
import CreateRecruitmentRequest from './components/HR/CreateRecruitmentRequest';
import RecruitmentRequestDetail from './components/HR/RecruitmentRequestDetail';
import EditRecruitmentRequestDetail from './components/HR/EditRecruitmentRequestDetail';
import Positions from './components/HR/Positions';
import CreatePosition from './components/HR/CreatePosition';
import EditPosition from './components/HR/EditPosition';
import JobsCandidates from './components/HR/JobsCandidates';
import Candidates from './components/HR/Candidates';
import CandidateDetail from './components/HR/CandidateDetail';
import CEORecruitmentRequestDetail from './components/HR/CEORecruitmentRequestDetail';
import Calendar from './components/Calendar/Calendar';
import EventDetail from './pages/EventDetail';
import Notifications from './components/Notifications/Notifications';
import EmailList from './components/Email/EmailList';
import CreateNotification from './components/Notifications/CreateNotification';
import SendEmail from './components/HR/SendEmail';
import EditNotification from './components/Notifications/EditNotification';
import NotificationDetail from './components/Notifications/NotificationDetail';
import EvaluationForm from './components/Notifications/EvaluationForm';
import AccountManagement from './components/HR/AccountManagement';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userRole = user?.role;
  
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        } />

        {/* Account Management route - only for CEO */}
        <Route path="/account-management" element={
          <DashboardLayout>
            <ProtectedRoute allowedRoles={['admin', 'ceo']}>
              <AccountManagement />
            </ProtectedRoute>
          </DashboardLayout>
        } />

        {/* Recruitment Requests routes with role-based access */}
        <Route path="/hr/recruitment-requests" element={
          <DashboardLayout>
            <ProtectedRoute allowedRoles={['department_head', 'recruitment']}>
              <RecruitmentRequests />
            </ProtectedRoute>
          </DashboardLayout>
        } />
        <Route path="/hr/ceo-recruitment-requests" element={
          <DashboardLayout>
            <ProtectedRoute allowedRoles={['ceo']}>
              <CEORecruitmentRequests />
            </ProtectedRoute>
          </DashboardLayout>
        } />
        <Route path="/hr/other-recruitment-requests" element={
          <DashboardLayout>
            <ProtectedRoute allowedRoles={['recruitment', 'applicant', 'director', 'business_director', 'admin']}>
              <OtherRecruitmentRequests />
            </ProtectedRoute>
          </DashboardLayout>
        } />

        {/* Calendar routes */}
        <Route path="/calendar" element={
          <DashboardLayout>
            <Calendar />
          </DashboardLayout>
        } />
        <Route path="/calendar/event/:eventId" element={
          <DashboardLayout>
            <EventDetail />
          </DashboardLayout>
        } />

        {/* Notifications routes */}
        <Route path="/notifications" element={
          <DashboardLayout>
            <Notifications />
          </DashboardLayout>
        } />
        <Route path="/notifications/create" element={
          <DashboardLayout>
            <CreateNotification />
          </DashboardLayout>
        } />
        <Route path="/notifications/edit/:id" element={
          <DashboardLayout>
            <EditNotification />
          </DashboardLayout>
        } />
        <Route path="/notifications/:id" element={<NotificationDetail />} />
        <Route path="/notifications/:id/evaluate" element={<EvaluationForm />} />

        {/* HR Routes */}
        <Route path="/hr/recruitment-requests/create" element={
          <DashboardLayout>
            <ProtectedRoute allowedRoles={['department_head', 'recruitment']}>
              <CreateRecruitmentRequest />
            </ProtectedRoute>
          </DashboardLayout>
        } />
        <Route path="/hr/recruitment-requests/:id" element={
          <DashboardLayout>
            <ProtectedRoute allowedRoles={['department_head', 'recruitment', 'admin']}>
              <RecruitmentRequestDetail />
            </ProtectedRoute>
          </DashboardLayout>
        } />
        <Route path="/hr/recruitment-requests/:id/edit" element={
          <DashboardLayout>
            <ProtectedRoute allowedRoles={['department_head', 'recruitment']}>
              <EditRecruitmentRequestDetail />
            </ProtectedRoute>
          </DashboardLayout>
        } />
        <Route path="/positions" element={
          <DashboardLayout>
            <Positions />
          </DashboardLayout>
        } />
        <Route path="/positions/create" element={
          <DashboardLayout>
            <CreatePosition />
          </DashboardLayout>
        } />
        <Route path="/positions/edit/:id" element={
          <DashboardLayout>
            <EditPosition />
          </DashboardLayout>
        } />
        <Route path="/positions/:id/candidates" element={
          <DashboardLayout>
            <JobsCandidates />
          </DashboardLayout>
        } />
        <Route path="/candidates" element={
          <DashboardLayout>
            <Candidates />
          </DashboardLayout>
        } />
        <Route path="/candidates/:id" element={
          <DashboardLayout>
            <CandidateDetail />
          </DashboardLayout>
        } />
        <Route path="/hr/ceo-recruitment-requests/:id" element={
          <DashboardLayout>
            <CEORecruitmentRequestDetail />
          </DashboardLayout>
        } />
        <Route
          path="/emails"
          element={
              <DashboardLayout>
                <EmailList />
              </DashboardLayout>
          }
        />
        <Route
          path="/send-email"
          element={
              <DashboardLayout>
                <SendEmail />
              </DashboardLayout>
          }
        />
        <Route
          path="/candidates/:id/send-email"
          element={
              <DashboardLayout>
                <SendEmail />
              </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
