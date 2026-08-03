import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PlaygroundPage from './pages/PlaygroundPage';
import ApplicationsPage from './pages/ApplicationsPage';
import EvaluationDetailsPage from './pages/EvaluationDetailsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import ConversationDetailPage from './pages/ConversationDetailPage';
import ConversationsPage from './pages/ConversationsPage';
import ProfilePage from './pages/ProfilePage';
function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: 'Geist, sans-serif',
            border: '2px solid var(--color-on-background)',
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="playground" element={<PlaygroundPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="applications/:applicationId" element={<ApplicationDetailPage />} />
            <Route path="conversations" element={<ConversationsPage />} />
            <Route path="conversations/:conversationId" element={<ConversationDetailPage />} />
            <Route path="evaluations" element={<EvaluationDetailsPage />} />
            <Route path="evaluations/:id" element={<EvaluationDetailsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
