
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supplyChainApi } from '../../api/toolsApi';

const SupplyChainPage = () => {
  const navigate = useNavigate();
  const [productId, setProductId] = useState('');
  const [optimization, setOptimization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await supplyChainApi.optimizeInventory(productId);
      setOptimization(response.data);
      toast({
        title: "Success",
        description: "Inventory optimization completed!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize inventory",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Supply Chain</h1>
            <p className="mt-2 text-gray-600">Optimize inventory and supply chain operations</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter product ID"
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Optimizing...' : 'Optimize Inventory'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Results</CardTitle>
            </CardHeader>
            <CardContent>
              {optimization ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Recommended Reorder Quantity</h3>
                    <p className="text-2xl font-bold text-blue-900">{optimization.reorder_quantity}</p>
                  </div>
                  
                  {optimization.optimal_stock_level && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800">Optimal Stock Level</h3>
                      <p className="text-lg text-green-900">{optimization.optimal_stock_level}</p>
                    </div>
                  )}
                  
                  {optimization.cost_savings && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800">Potential Cost Savings</h3>
                      <p className="text-lg text-purple-900">${optimization.cost_savings}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Enter a Product ID to get optimization recommendations
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainPage;
