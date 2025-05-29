
import { useState } from 'react';
import CampaignForm from '../../components/tools/CampaignForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MarketingPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCampaignCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
          <p className="mt-2 text-gray-600">Create and manage marketing campaigns</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CampaignForm onCampaignCreated={handleCampaignCreated} />
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>Personalization:</strong> Include customer names and relevant details
                </div>
                <div className="text-sm">
                  <strong>Timing:</strong> Send campaigns during optimal engagement hours
                </div>
                <div className="text-sm">
                  <strong>A/B Testing:</strong> Test different messages with small segments first
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
