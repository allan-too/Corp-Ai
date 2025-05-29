
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, FileText, CreditCard, BanknoteIcon, BarChart3, ShieldCheck, Loader2 } from 'lucide-react';

// Finance module components
import BookkeepingDashboard from '../../components/tools/finance/BookkeepingDashboard';
import AccountsPayableDashboard from '../../components/tools/finance/AccountsPayableDashboard';
import AccountsReceivableDashboard from '../../components/tools/finance/AccountsReceivableDashboard';
import ForecastingDashboard from '../../components/tools/finance/ForecastingDashboard';
import AuditDashboard from '../../components/tools/finance/AuditDashboard';
import BudgetForm from '../../components/tools/BudgetForm';

const FinancePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookkeeping');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has access to enterprise features
  const hasEnterpriseAccess = user?.subscriptionPlan === 'enterprise' || user?.role === 'admin';
  const hasProfessionalAccess = hasEnterpriseAccess || user?.subscriptionPlan === 'professional';

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finance Suite</h1>
            <p className="mt-2 text-gray-600">Comprehensive financial management and analysis</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="bookkeeping" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
            <TabsTrigger value="bookkeeping" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              Bookkeeping
            </TabsTrigger>
            <TabsTrigger value="accounts-payable" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <CreditCard className="mr-2 h-4 w-4" />
              Accounts Payable
              {!hasEnterpriseAccess && (
                <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                  Enterprise
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="accounts-receivable" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <BanknoteIcon className="mr-2 h-4 w-4" />
              Accounts Receivable
              {!hasProfessionalAccess && (
                <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                  Pro
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <BarChart3 className="mr-2 h-4 w-4" />
              Forecasting & FP&A
              {!hasProfessionalAccess && (
                <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                  Pro
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Audit & Compliance
              {!hasEnterpriseAccess && (
                <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                  Enterprise
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookkeeping" className="space-y-6">
            <BookkeepingDashboard />
          </TabsContent>

          <TabsContent value="accounts-payable" className="space-y-6">
            {hasEnterpriseAccess ? (
              <AccountsPayableDashboard />
            ) : (
              <SubscriptionRequired 
                title="Accounts Payable Automation" 
                description="Upgrade to Enterprise plan to access automated invoice processing, approval workflows, and vendor management."
                plan="Enterprise"
              />
            )}
          </TabsContent>

          <TabsContent value="accounts-receivable" className="space-y-6">
            {hasProfessionalAccess ? (
              <AccountsReceivableDashboard />
            ) : (
              <SubscriptionRequired 
                title="Accounts Receivable & Collections" 
                description="Upgrade to Professional plan to access invoice management, payment predictions, and automated collections."
                plan="Professional"
              />
            )}
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            {hasProfessionalAccess ? (
              <ForecastingDashboard />
            ) : (
              <SubscriptionRequired 
                title="Financial Planning & Analysis" 
                description="Upgrade to Professional plan to access revenue forecasting, scenario planning, and AI-powered financial analysis."
                plan="Professional"
              />
            )}
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            {hasEnterpriseAccess ? (
              <AuditDashboard />
            ) : (
              <SubscriptionRequired 
                title="Audit & Compliance" 
                description="Upgrade to Enterprise plan to access automated compliance checks, audit trails, and regulatory reporting."
                plan="Enterprise"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Subscription required component
interface SubscriptionRequiredProps {
  title: string;
  description: string;
  plan: 'Professional' | 'Enterprise';
}

const SubscriptionRequired: React.FC<SubscriptionRequiredProps> = ({ title, description, plan }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button onClick={() => navigate('/pricing')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Upgrade to {plan}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FinancePage;
