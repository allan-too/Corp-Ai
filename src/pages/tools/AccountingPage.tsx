
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AccountingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Accounting</h1>
          <p className="mt-2 text-gray-600">Accounting automation and reporting</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Accounting Dashboard</CardTitle>
            <CardDescription>Track expenses and generate reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Accounting tools coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountingPage;
