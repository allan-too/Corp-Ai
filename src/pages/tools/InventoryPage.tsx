
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InventoryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="mt-2 text-gray-600">Inventory management and optimization</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Inventory Dashboard</CardTitle>
            <CardDescription>Track stock levels and manage products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Inventory tools coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryPage;
