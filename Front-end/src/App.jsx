import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import ForgotPassword from './components/Login/ForgotPassword';
import ResetPassword from './components/Login/ResetPassword';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './components/HR/dashboard';
import RecruitmentRequests from './components/HR/RecruitmentRequests';
import CreateRecruitmentRequest from './components/HR/CreateRecruitmentRequest';
import RecruitmentRequestDetail from './components/HR/RecruitmentRequestDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        } />

        {/* HR Routes */}
        <Route path="/hr/recruitment-requests" element={
          <DashboardLayout>
            <RecruitmentRequests />
          </DashboardLayout>
        } />
        <Route path="/hr/recruitment-requests/create" element={
          <DashboardLayout>
            <CreateRecruitmentRequest />
          </DashboardLayout>
        } />
        <Route path="/hr/recruitment-requests/:id" element={
          <DashboardLayout>
            <RecruitmentRequestDetail />
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
