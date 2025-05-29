
import { useState } from 'react';
import CRMForm from '../../components/tools/CRMForm';
import LeadsList from '../../components/tools/LeadsList';

const CRMPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLeadCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CRM Management</h1>
          <p className="mt-2 text-gray-600">Manage customer relationships and track leads</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CRMForm onLeadCreated={handleLeadCreated} />
          </div>
          <div>
            <LeadsList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMPage;
