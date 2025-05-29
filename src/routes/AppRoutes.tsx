import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Tool Pages
import CRMPage from '../pages/tools/CRMPage';
import SalesForecastPage from '../pages/tools/SalesForecastPage';
import ChatSupportPage from '../pages/tools/ChatSupportPage';
import MarketingPage from '../pages/tools/MarketingPage';
import SocialMediaPage from '../pages/tools/SocialMediaPage';
import AnalyticsPage from '../pages/tools/AnalyticsPage';
import HRPage from '../pages/tools/HRPage';
import ContractsPage from '../pages/tools/ContractsPage';
import FinancePage from '../pages/tools/FinancePage';
import SupplyChainPage from '../pages/tools/SupplyChainPage';
import SchedulerPage from '../pages/tools/SchedulerPage';
import ReviewsPage from '../pages/tools/ReviewsPage';
import AccountingPage from '../pages/tools/AccountingPage';
import InventoryPage from '../pages/tools/InventoryPage';
import LegalCRMPage from '../pages/tools/LegalCRMPage';
import NotificationsPage from '../pages/tools/NotificationsPage';
import ReservationPage from '../pages/tools/ReservationPage';
import TelcoPage from '../pages/tools/TelcoPage';
import StudentAssistPage from '../pages/tools/StudentAssistPage';

// Footer Pages
import ToolsPage from '../pages/ToolsPage';
import FeaturesPage from '../pages/FeaturesPage';
import PricingPage from '../pages/PricingPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import CareersPage from '../pages/CareersPage';
import DocumentationPage from '../pages/DocumentationPage';
import SupportPage from '../pages/SupportPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';
import CookiesPage from '../pages/CookiesPage';

const AppRoutes = () => {
  const { loading, isAuthenticated, token, verifyToken } = useAuth();

  // Verify token on component mount
  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        console.log('Verifying token validity...');
        await verifyToken();
      }
    };
    
    checkToken();
  }, [token, verifyToken]);

  if (loading) {
    return <LoadingSpinner />;
  }
  
  console.log('AppRoutes rendering with auth state:', { isAuthenticated, hasToken: !!token });

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        {/* Tool Routes */}
        <Route path="tools/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
        <Route path="tools/sales-forecast" element={<ProtectedRoute><SalesForecastPage /></ProtectedRoute>} />
        <Route path="tools/chat-support" element={<ProtectedRoute><ChatSupportPage /></ProtectedRoute>} />
        <Route path="tools/marketing" element={<ProtectedRoute><MarketingPage /></ProtectedRoute>} />
        <Route path="tools/social-media" element={<ProtectedRoute><SocialMediaPage /></ProtectedRoute>} />
        <Route path="tools/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="tools/hr" element={<ProtectedRoute><HRPage /></ProtectedRoute>} />
        <Route path="tools/contracts" element={<ProtectedRoute><ContractsPage /></ProtectedRoute>} />
        <Route path="tools/finance" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} />
        <Route path="tools/supply-chain" element={<ProtectedRoute><SupplyChainPage /></ProtectedRoute>} />
        <Route path="tools/scheduler" element={<ProtectedRoute><SchedulerPage /></ProtectedRoute>} />
        <Route path="tools/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
        <Route path="tools/accounting" element={<ProtectedRoute><AccountingPage /></ProtectedRoute>} />
        <Route path="tools/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
        <Route path="tools/legal-crm" element={<ProtectedRoute><LegalCRMPage /></ProtectedRoute>} />
        <Route path="tools/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="tools/reservation" element={<ProtectedRoute><ReservationPage /></ProtectedRoute>} />
        <Route path="tools/telco" element={<ProtectedRoute><TelcoPage /></ProtectedRoute>} />
        <Route path="tools/student-assist" element={<ProtectedRoute><StudentAssistPage /></ProtectedRoute>} />
      </Route>
      
      {/* Footer Pages */}
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/documentation" element={<DocumentationPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
    </Routes>
  );
};

export default AppRoutes;
