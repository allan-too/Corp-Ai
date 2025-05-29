
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { contractApi } from '../../api/toolsApi';

const ContractsPage = () => {
  const navigate = useNavigate();
  const [contractText, setContractText] = useState('');
  const [review, setReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await contractApi.reviewContract({ contract_text: contractText });
      setReview(response.data);
      toast({
        title: "Success",
        description: "Contract reviewed successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to review contract",
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
            <h1 className="text-3xl font-bold text-gray-900">Contract Review</h1>
            <p className="mt-2 text-gray-600">AI-powered contract analysis and review</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Contract Text</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="contract">Paste Contract Text</Label>
                  <Textarea
                    id="contract"
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    placeholder="Paste your contract text here for AI review..."
                    rows={12}
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading || !contractText.trim()} className="w-full">
                  {isLoading ? 'Reviewing...' : 'Review Contract'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {review ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-green-700">Key Points</h3>
                    <p className="text-sm mt-1">{review.summary}</p>
                  </div>
                  
                  {review.risks && (
                    <div>
                      <h3 className="font-semibold text-red-700">Potential Risks</h3>
                      <ul className="text-sm mt-1 list-disc list-inside">
                        {review.risks.map((risk: string, index: number) => (
                          <li key={index}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {review.recommendations && (
                    <div>
                      <h3 className="font-semibold text-blue-700">Recommendations</h3>
                      <ul className="text-sm mt-1 list-disc list-inside">
                        {review.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Submit a contract for AI-powered review and analysis
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;
