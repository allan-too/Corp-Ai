
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ReviewsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="mt-2 text-gray-600">Review management and sentiment analysis</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Reviews Dashboard</CardTitle>
            <CardDescription>Monitor and respond to customer reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Review tools coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewsPage;
