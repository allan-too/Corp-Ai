
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LegalCRMPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Legal CRM</h1>
          <p className="mt-2 text-gray-600">Legal case management and client tracking</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Legal CRM Dashboard</CardTitle>
            <CardDescription>Manage cases and legal clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Legal CRM tools coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalCRMPage;
