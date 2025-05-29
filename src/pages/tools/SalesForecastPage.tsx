
import ForecastChart from '../../components/tools/ForecastChart';

const SalesForecastPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Forecast</h1>
          <p className="mt-2 text-gray-600">Predict future sales trends and performance</p>
        </div>
        
        <ForecastChart />
      </div>
    </div>
  );
};

export default SalesForecastPage;
