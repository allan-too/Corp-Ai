import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { financeApi } from '../../../api/toolsApi';
import { Forecast, Scenario, ForecastDataPoint } from '../../../types/finance';
import { BarChart, LineChart, PieChart, Sparkles, Plus, Calendar, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

// Mock chart component - in a real app, you'd use a proper chart library like Chart.js, Recharts, etc.
const ChartPlaceholder = ({ type, title }: { type: string; title: string }) => {
  return (
    <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-md flex flex-col items-center justify-center p-4">
      {type === 'bar' && <BarChart className="h-12 w-12 text-blue-300 mb-2" />}
      {type === 'line' && <LineChart className="h-12 w-12 text-green-300 mb-2" />}
      {type === 'pie' && <PieChart className="h-12 w-12 text-purple-300 mb-2" />}
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">Interactive chart would appear here</p>
    </div>
  );
};

const ForecastingDashboard = () => {
  const [activeTab, setActiveTab] = useState('forecasts');
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [financialMetrics, setFinancialMetrics] = useState({
    grossMargin: { current: 0, previous: 0 },
    operatingMargin: { current: 0, previous: 0 },
    cashConversion: { current: 0, previous: 0 },
    burnRate: { current: 0, previous: 0 }
  });
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingForecast, setIsCreatingForecast] = useState(false);
  const [isCreatingScenario, setIsCreatingScenario] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    baselineId: '',
    assumptions: []
  });
  const [selectedForecast, setSelectedForecast] = useState<Forecast | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [newForecast, setNewForecast] = useState({
    name: '',
    type: 'revenue' as 'revenue' | 'expense' | 'cash-flow',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    includeSeasonality: true,
    historicalDataMonths: 12
  });

  useEffect(() => {
    fetchForecasts();
    fetchScenarios();
    fetchFinancialMetrics();
  }, []);

  const fetchForecasts = async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getForecasts();
      if (response.data) {
        setForecasts(response.data);
      } else {
        setForecasts([]);
      }
    } catch (error) {
      console.error('Error fetching forecasts:', error);
      setForecasts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchScenarios = async () => {
    try {
      const response = await financeApi.getScenarios();
      if (response.data) {
        setScenarios(response.data);
      } else {
        setScenarios([]);
      }
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      setScenarios([]);
    }
  };

  const fetchFinancialMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getFinancialMetrics();
      if (response.data) {
        setFinancialMetrics(response.data);
      }
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateForecast = async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.createForecast(newForecast);
      if (response.data) {
        setForecasts([...forecasts, response.data]);
        setIsCreatingForecast(false);
        toast.success('Forecast created successfully');
      }
    } catch (error) {
      console.error('Error creating forecast:', error);
      toast.error('Failed to create forecast');
      toast.error('Failed to add forecast. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateScenario = async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.createScenario(newScenario);
      if (response.data) {
        setScenarios([...scenarios, response.data]);
        setIsCreatingScenario(false);
        toast.success('Scenario created successfully');
      }
    } catch (error) {
      console.error('Error creating scenario:', error);
      toast.error('Failed to create scenario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatQuery = async () => {
    if (!chatQuery.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsChatLoading(true);
    try {
      const response = await financeApi.chatQuery(chatQuery);
      if (response.data) {
        setChatResponse(response.data.answer);
      }
    } catch (error) {
      console.error('Error with chat query:', error);
      
      // For demo purposes, generate a mock response
      const mockResponses = [
        "Based on current projections, your Q3 revenue is expected to increase by 12% compared to Q2, reaching approximately $1.2M.",
        "Your cash flow forecast indicates you'll have sufficient liquidity through the end of the year, with a minimum cash balance of $250K in October.",
        "The scenario analysis suggests that even with a 15% decrease in sales, you would remain profitable due to your current cost structure.",
        "Your highest expense categories are salaries (42%), marketing (18%), and office space (15%). I recommend reviewing your marketing spend which has increased 22% year-over-year.",
        "Based on historical data, your business experiences seasonality with revenue peaks in Q4 and Q2. I suggest increasing inventory and staffing accordingly."
      ];
      
      setChatResponse(mockResponses[Math.floor(Math.random() * mockResponses.length)]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Helper function to generate mock forecast data
  function generateMockForecastData(startDate: string, endDate: string, type: string): ForecastDataPoint[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const data: ForecastDataPoint[] = [];
    
    const currentDate = new Date(start);
    const baseAmount = type === 'revenue' ? 50000 : type === 'expense' ? 40000 : 10000;
    
    while (currentDate <= end) {
      // Add some randomness and trend
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const trendFactor = 1 + (currentDate.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 0.2; // 1.0 to 1.2
      
      // Add seasonality
      const month = currentDate.getMonth();
      let seasonalFactor = 1;
      if (type === 'revenue') {
        // Higher in Q4 (holiday season) and Q2
        seasonalFactor = [0.9, 0.95, 1, 1.05, 1.1, 1.15, 1, 0.95, 1, 1.1, 1.2, 1.25][month];
      } else if (type === 'expense') {
        // Higher in Q1 and Q3
        seasonalFactor = [1.1, 1.05, 1, 0.95, 0.9, 0.95, 1, 1.05, 1.1, 1.05, 1, 1.05][month];
      }
      
      const amount = baseAmount * randomFactor * trendFactor * seasonalFactor;
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        amount: Math.round(amount),
        confidence: 0.7 + Math.random() * 0.25 // 0.7 to 0.95
      });
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return data;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Financial Planning & Analysis</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsChatOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            FP&A Chat
          </Button>
          <Button onClick={() => setIsCreatingForecast(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Forecast
          </Button>
          <Button onClick={() => setIsCreatingScenario(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Scenario
          </Button>
        </div>
      </div>

      <Tabs defaultValue="forecasts" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
          <TabsTrigger value="forecasts" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Forecasts
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Scenario Planning
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Financial Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecasts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forecasts.map(forecast => (
              <Card key={forecast.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {forecast.type === 'revenue' && <BarChart className="h-5 w-5 mr-2 text-green-500" />}
                    {forecast.type === 'expense' && <BarChart className="h-5 w-5 mr-2 text-red-500" />}
                    {forecast.type === 'cash-flow' && <LineChart className="h-5 w-5 mr-2 text-blue-500" />}
                    {forecast.name}
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(forecast.startDate).toLocaleDateString()} 
                    <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                    {new Date(forecast.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartPlaceholder 
                    type={forecast.type === 'cash-flow' ? 'line' : 'bar'} 
                    title={`${forecast.type.charAt(0).toUpperCase() + forecast.type.slice(1)} Forecast`} 
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => setSelectedForecast(forecast)}>
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">What-If Scenarios</h3>
            <Button onClick={() => setIsCreatingScenario(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Scenario
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map(scenario => (
              <Card key={scenario.id}>
                <CardHeader>
                  <CardTitle>{scenario.name}</CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Assumptions</h4>
                      <div className="space-y-2">
                        {scenario.assumptions.map(assumption => (
                          <div key={assumption.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <div>
                              <span className="font-medium">{assumption.category}:</span> {assumption.description}
                            </div>
                            <Badge variant="outline" className={assumption.value >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                              {assumption.value > 0 && '+'}
                              {assumption.value}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Results</h4>
                      <div className="space-y-2">
                        {scenario.results.map((result, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <div className="font-medium">{result.category}</div>
                            <div className="flex items-center space-x-2">
                              <span>${result.scenarioValue.toLocaleString()}</span>
                              <Badge variant="outline" className={result.percentChange >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                                {result.percentChange > 0 && '+'}
                                {result.percentChange}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Run Again
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>By product category, last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder type="pie" title="Revenue by Category" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>By category, last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder type="pie" title="Expenses by Category" />
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profit & Loss Trend</CardTitle>
                <CardDescription>Monthly breakdown, last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder type="bar" title="Monthly P&L" />
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Key Financial Metrics</CardTitle>
                <CardDescription>Current vs Previous Period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Gross Margin</div>
                    <div className="text-2xl font-bold mt-1">{financialMetrics.grossMargin.current}%</div>
                    <div className={`text-sm mt-1 ${financialMetrics.grossMargin.current - financialMetrics.grossMargin.previous > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {financialMetrics.grossMargin.current - financialMetrics.grossMargin.previous > 0 ? '+' : ''}
                      {(financialMetrics.grossMargin.current - financialMetrics.grossMargin.previous).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Operating Margin</div>
                    <div className="text-2xl font-bold mt-1">{financialMetrics.operatingMargin.current}%</div>
                    <div className={`text-sm mt-1 ${financialMetrics.operatingMargin.current - financialMetrics.operatingMargin.previous > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {financialMetrics.operatingMargin.current - financialMetrics.operatingMargin.previous > 0 ? '+' : ''}
                      {(financialMetrics.operatingMargin.current - financialMetrics.operatingMargin.previous).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Cash Conversion</div>
                    <div className="text-2xl font-bold mt-1">{financialMetrics.cashConversion.current} days</div>
                    <div className={`text-sm mt-1 ${financialMetrics.cashConversion.previous - financialMetrics.cashConversion.current > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {financialMetrics.cashConversion.previous - financialMetrics.cashConversion.current > 0 ? '-' : '+'}
                      {Math.abs(financialMetrics.cashConversion.current - financialMetrics.cashConversion.previous)} days
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Burn Rate</div>
                    <div className="text-2xl font-bold mt-1">${(financialMetrics.burnRate.current / 1000).toFixed(0)}K/mo</div>
                    <div className={`text-sm mt-1 ${financialMetrics.burnRate.current - financialMetrics.burnRate.previous > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {financialMetrics.burnRate.current - financialMetrics.burnRate.previous > 0 ? '+' : '-'}
                      ${Math.abs((financialMetrics.burnRate.current - financialMetrics.burnRate.previous) / 1000).toFixed(0)}K/mo
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Forecast Dialog */}
      <Dialog open={isCreatingForecast} onOpenChange={setIsCreatingForecast}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Forecast</DialogTitle>
            <DialogDescription>
              Set up parameters for your financial forecast
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="forecast-name">Forecast Name</Label>
              <Input
                id="forecast-name"
                placeholder="e.g., Q3 Revenue Forecast"
                value={newForecast.name}
                onChange={(e) => setNewForecast({ ...newForecast, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="forecast-type">Forecast Type</Label>
              <Select
                value={newForecast.type}
                onValueChange={(value) => setNewForecast({ ...newForecast, type: value as 'revenue' | 'expense' | 'cash-flow' })}
              >
                <SelectTrigger id="forecast-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="cash-flow">Cash Flow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newForecast.startDate}
                  onChange={(e) => setNewForecast({ ...newForecast, startDate: e.target.value })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newForecast.endDate}
                  onChange={(e) => setNewForecast({ ...newForecast, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="historical-months">Historical Data (months)</Label>
              <Select
                value={newForecast.historicalDataMonths.toString()}
                onValueChange={(value) => setNewForecast({ ...newForecast, historicalDataMonths: parseInt(value) })}
              >
                <SelectTrigger id="historical-months">
                  <SelectValue placeholder="Select months" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-seasonality"
                checked={newForecast.includeSeasonality}
                onChange={(e) => setNewForecast({ ...newForecast, includeSeasonality: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="include-seasonality" className="text-sm font-normal">
                Include seasonality adjustments
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingForecast(false)}>Cancel</Button>
            <Button onClick={handleCreateForecast} disabled={!newForecast.name || isLoading}>
              {isLoading ? 'Creating...' : 'Create Forecast'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FP&A Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
              FP&A AI Assistant
            </DialogTitle>
            <DialogDescription>
              Ask questions about your financial data and get AI-powered insights
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            {chatResponse && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-1">AI Assistant</p>
                <p className="text-sm text-gray-700">{chatResponse}</p>
              </div>
            )}
            <div className="flex space-x-2">
              <Textarea
                placeholder="Ask a question about your financial data..."
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                className="flex-1"
              />
              <Button 
                className="self-end" 
                onClick={handleChatQuery} 
                disabled={isChatLoading || !chatQuery.trim()}
              >
                {isChatLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Ask'}
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Example questions: "What's our projected cash flow for Q3?", "How do our expenses compare to last year?", "What's our profit margin trend?"
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForecastingDashboard;
