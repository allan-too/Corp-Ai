
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { toast } from '@/hooks/use-toast';
import FileUploader from './FileUploader';
import { telcoApi } from '../../api/toolsApi';

const chartConfig = {
  maintenance: {
    label: "Maintenance",
    color: "hsl(var(--chart-1))",
  },
  churn: {
    label: "Churn Rate",
    color: "hsl(var(--chart-2))",
  },
  fraud: {
    label: "Fraud Score",
    color: "hsl(var(--chart-3))",
  },
};

interface MaintenanceData {
  timeline: Array<{ date: string; issues: number }>;
  critical_issues: number;
  pending_tasks: number;
  uptime_percentage: number;
}

interface ChurnData {
  monthly_churn: Array<{ month: string; churn_rate: number }>;
  current_rate: number;
  at_risk_customers: number;
}

interface FraudData {
  risk_distribution: Array<{ name: string; value: number }>;
  high_risk_calls: number;
  suspected_fraud: number;
}

interface DashboardData {
  maintenance: MaintenanceData | null;
  churn: ChurnData | null;
  fraud: FraudData | null;
}

interface LoadingState {
  report: boolean;
}

const TelcoDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    maintenance: null,
    churn: null,
    fraud: null,
  });
  const [isLoading, setIsLoading] = useState<LoadingState>({
    report: false,
  });

  const handleCDRUpload = async (file: File) => {
    const response = await telcoApi.uploadCDR(file);
    toast({
      title: "Success",
      description: "CDR file uploaded and processed successfully!",
    });
    // Refresh all dashboards after upload
    fetchAllData();
    return response.data;
  };

  const fetchAllData = async () => {
    try {
      const [maintenance, churn, fraud] = await Promise.all([
        telcoApi.getMaintenanceReport(),
        telcoApi.getChurnAnalysis(),
        telcoApi.getFraudDetection(),
      ]);
      
      setDashboardData({
        maintenance: maintenance.data,
        churn: churn.data,
        fraud: fraud.data,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    }
  };

  const generateReport = async () => {
    setIsLoading(prev => ({ ...prev, report: true }));
    try {
      const response = await telcoApi.generateReport({
        include_maintenance: true,
        include_churn: true,
        include_fraud: true,
      });
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'telco-report.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Report generated and downloaded!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, report: false }));
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CDR File Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploader
            onFileUpload={handleCDRUpload}
            acceptedFileTypes={['.csv', '.xlsx']}
            title="Upload CDR Files"
            description="Upload Call Detail Records for analysis"
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="maintenance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="churn">Churn Analysis</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Maintenance Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.maintenance ? (
                <div className="space-y-6">
                  <ChartContainer config={chartConfig} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.maintenance.timeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="issues" 
                          stroke="var(--color-maintenance)" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-red-600">Critical Issues</div>
                      <div className="text-2xl font-bold text-red-700">
                        {dashboardData.maintenance.critical_issues}
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-yellow-600">Pending Tasks</div>
                      <div className="text-2xl font-bold text-yellow-700">
                        {dashboardData.maintenance.pending_tasks}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-green-600">Uptime %</div>
                      <div className="text-2xl font-bold text-green-700">
                        {dashboardData.maintenance.uptime_percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Upload CDR files to view maintenance data
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="churn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Churn Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.churn ? (
                <div className="space-y-6">
                  <ChartContainer config={chartConfig} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.churn.monthly_churn}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="churn_rate" fill="var(--color-churn)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600">Current Churn Rate</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {dashboardData.churn.current_rate}%
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-purple-600">At-Risk Customers</div>
                      <div className="text-2xl font-bold text-purple-700">
                        {dashboardData.churn.at_risk_customers}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Upload CDR files to view churn analysis
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.fraud ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <ChartContainer config={chartConfig} className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.fraud.risk_distribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {dashboardData.fraud.risk_distribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 50%)`} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    
                    <div className="space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-sm text-red-600">High Risk Calls</div>
                        <div className="text-2xl font-bold text-red-700">
                          {dashboardData.fraud.high_risk_calls}
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm text-orange-600">Suspected Fraud</div>
                        <div className="text-2xl font-bold text-orange-700">
                          {dashboardData.fraud.suspected_fraud}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Upload CDR files to view fraud detection results
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                Generate comprehensive reports including maintenance status, churn analysis, and fraud detection results.
              </div>
              
              <Button 
                onClick={generateReport} 
                disabled={isLoading.report}
                className="w-full"
              >
                {isLoading.report ? 'Generating Report...' : 'Download PDF Report'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelcoDashboard;
