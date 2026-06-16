
// Entry point — router sẽ được mount ở đây sau
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Error404 from "./pages/404/404";
import PublicLayout from "./components/layout/MarketplaceLayout";
import PostJob from "./pages/client/PostJob/PostJob01";
import PostJobLayout from "./components/layout/PostJobLayout";
import PostJob02 from "./pages/client/PostJob/PostJob02";
import ClientLayout from "./components/layout/ClientLayout";
import DashboardClient from "./pages/client/DashboardClient";
import PostJob03 from "./pages/client/PostJob/PostJob03";
import ExpertLayout from "./components/layout/ExpertLayout";
import DashboardExpert from "./pages/expert/DashboardExpert";
import MyTask from "./pages/expert/MyTask";
import MyProposals from "./pages/expert/MyProposals";
import ProfileExpert from "./pages/expert/ProfileExpert";
import ManageProposals from "./pages/client/ManageProposals";
import Messages from "./pages/Messenger/Messages";
import ProjectDetailClient from "./pages/client/Project/ProjectDetailClient";
import ProjectClient from "./pages/client/Project/Project";
import ProfileClient from "./pages/client/ProfileClient";
import Marketplace from "./pages/public/Marketplace";
import Services from "./pages/public/Services";
import ServiceDetail from "./pages/public/ServiceDetail";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import JobDetail from "./pages/public/JobDetail";
import Authentication from "./components/layout/Authentication";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import OAuth2CallbackPage from "./pages/auth/OAuth2CallbackPage";
import useAuthStore from "./store/authStore";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageJobsPage from "./pages/admin/ManageJobsPage";
import StatisticsPage from "./pages/admin/StatisticsPage";
import SavedServices from "./pages/client/SavedService";

// Renders ClientLayout or ExpertLayout depending on logged-in user's role
function MessengerLayout() {
  const { user } = useAuthStore();
  if (user?.role === "EXPERT") return <ExpertLayout />;
  return <ClientLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authentication />}>
          <Route index element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
        </Route>

        {/* Shared /messages route — accessible by both CLIENT and EXPERT */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MessengerLayout />}>
            <Route path="/messages" element={<Messages />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="CLIENT" />}>
          <Route element={<PostJobLayout />}>
            <Route path="/post-job/step-1" element={<PostJob />} />
            <Route path="/post-job/step-2" element={<PostJob02 />} />
            <Route path="/post-job/step-3" element={<PostJob03 />} />
          </Route>

          <Route element={<ClientLayout />}>
            <Route path="/dashboard" element={<DashboardClient />} />
            <Route path="/projects" element={<ProjectClient />} />
            <Route path="/projects/:id" element={<ProjectDetailClient />} />
            <Route path="/manage-proposals" element={<ManageProposals />} />
            <Route path="/client-profile" element={<ProfileClient />} />
            <Route path="/saved-services" element={<SavedServices />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="EXPERT" />}>
          <Route element={<ExpertLayout />}>
            <Route path="/dashboard-expert" element={<DashboardExpert />} />
            <Route path="/my-tasks" element={<MyTask />} />
            <Route path="/my-proposals" element={<MyProposals />} />
            <Route path="/expert-profile" element={<ProfileExpert />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="jobs" element={<ManageJobsPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>

        <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}
