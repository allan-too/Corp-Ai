import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { financeApi } from '../../../api/toolsApi';
import { AuditLog, ComplianceRule, ComplianceCheck } from '../../../types/finance';
import { ShieldCheck, Download, RefreshCw, Search, Plus, FileText, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const AuditDashboard = () => {
  const [activeTab, setActiveTab] = useState('audit-logs');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [checkEntity, setCheckEntity] = useState({ type: '', id: '' });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [filter, setFilter] = useState({
    entityType: 'all',
    action: 'all',
    startDate: '',
    endDate: '',
    searchTerm: ''
  });
  const [reportOptions, setReportOptions] = useState({
    type: 'audit',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0], // 3 months ago
    endDate: new Date().toISOString().split('T')[0], // today
    format: 'pdf'
  });

  useEffect(() => {
    fetchAuditLogs();
    fetchComplianceRules();
    fetchComplianceChecks();
  }, []);

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getAuditLogs({});
      if (response.data) {
        setAuditLogs(response.data);
      } else {
        setAuditLogs([]);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setAuditLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComplianceRules = async () => {
    try {
      const response = await financeApi.getComplianceRules();
      if (response.data) {
        setComplianceRules(response.data);
      } else {
        setComplianceRules([]);
      }
    } catch (error) {
      console.error('Error fetching compliance rules:', error);
      setComplianceRules([]);
    }
  };

  const fetchComplianceChecks = async () => {
    try {
      const response = await financeApi.getComplianceChecks();
      if (response.data) {
        setComplianceChecks(response.data);
      } else {
        setComplianceChecks([]);
      }
    } catch (error) {
      console.error('Error fetching compliance checks:', error);
      setComplianceChecks([]);
    }
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.generateReport(reportOptions);
      if (response.data) {
        toast.success('Report generated successfully');
        setIsGeneratingReport(false);
        
        // In a real implementation, you would download the report
        // window.open(response.data.reportUrl, '_blank');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
      setIsGeneratingReport(false);
      toast.success('Report generated successfully (demo)');
    }
  };

  const handleRunCheck = async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.runComplianceCheck(checkEntity.type, checkEntity.id);
      if (response.data) {
        toast.success('Compliance check completed successfully');
        fetchComplianceChecks(); // Refresh the checks list
      }
    } catch (error) {
      console.error('Error running compliance check:', error);
      toast.error('Failed to run compliance check');
    } finally {
      setIsLoading(false);
      setIsRunningCheck(false);
    }
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    if (filter.entityType !== 'all' && log.entityType !== filter.entityType) return false;
    if (filter.action !== 'all' && log.action !== filter.action) return false;
    if (filter.startDate && new Date(log.timestamp) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(log.timestamp) > new Date(filter.endDate)) return false;
    if (filter.searchTerm && 
        !log.entityId.toLowerCase().includes(filter.searchTerm.toLowerCase()) && 
        !log.userName.toLowerCase().includes(filter.searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Audit & Compliance</h2>
        <div className="flex space-x-2">
          <Dialog open={isGeneratingReport} onOpenChange={setIsGeneratingReport}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Audit Report</DialogTitle>
                <DialogDescription>
                  Configure your audit report parameters
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select
                    value={reportOptions.type}
                    onValueChange={(value) => setReportOptions({ ...reportOptions, type: value })}
                  >
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="audit">Audit Trail</SelectItem>
                      <SelectItem value="compliance">Compliance Summary</SelectItem>
                      <SelectItem value="tax">Tax Documentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={reportOptions.startDate}
                      onChange={(e) => setReportOptions({ ...reportOptions, startDate: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={reportOptions.endDate}
                      onChange={(e) => setReportOptions({ ...reportOptions, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="report-format">Format</Label>
                  <Select
                    value={reportOptions.format}
                    onValueChange={(value) => setReportOptions({ ...reportOptions, format: value })}
                  >
                    <SelectTrigger id="report-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGeneratingReport(false)}>Cancel</Button>
                <Button onClick={handleGenerateReport} disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Report'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {isRunningCheck ? (
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Run Compliance Check</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Entity Type</label>
                <select 
                  className="w-full p-2 border rounded-md" 
                  value={checkEntity.type}
                  onChange={(e) => setCheckEntity({...checkEntity, type: e.target.value})}
                >
                  <option value="">Select Entity Type</option>
                  <option value="invoice">Invoice</option>
                  <option value="transaction">Transaction</option>
                  <option value="payment">Payment</option>
                  <option value="budget">Budget</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Entity ID</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  value={checkEntity.id}
                  onChange={(e) => setCheckEntity({...checkEntity, id: e.target.value})}
                  placeholder="Enter entity ID"
                />
              </div>
              <div className="flex space-x-2 mb-4">
                <Button 
                  onClick={handleRunCheck}
                  disabled={!checkEntity.type || !checkEntity.id}
                >
                  Run Check
                </Button>
                <Button variant="outline" onClick={() => setIsRunningCheck(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsRunningCheck(true)}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Run Compliance Check
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="audit-logs" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
          <TabsTrigger value="audit-logs" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Compliance Rules
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Saved Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit-logs" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-8 w-[250px]"
                  value={filter.searchTerm}
                  onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
                />
              </div>
              <Select
                value={filter.entityType}
                onValueChange={(value) => setFilter({ ...filter, entityType: value })}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                  <SelectItem value="transaction">Transactions</SelectItem>
                  <SelectItem value="budget">Budgets</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filter.action}
                onValueChange={(value) => setFilter({ ...filter, action: value })}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Start Date"
                className="w-[150px]"
                value={filter.startDate}
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
              />
              <Input
                type="date"
                placeholder="End Date"
                className="w-[150px]"
                value={filter.endDate}
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
              />
            </div>
            <Button variant="outline" onClick={fetchAuditLogs}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Comprehensive log of all system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        <div className="flex justify-center items-center">
                          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                          Loading audit logs...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredAuditLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{log.userName}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              ${log.action === 'create' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                              ${log.action === 'update' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                              ${log.action === 'delete' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                              ${log.action === 'view' ? 'bg-gray-50 text-gray-700 border-gray-200' : ''}
                            `}
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.entityType}</TableCell>
                        <TableCell>{log.entityId}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredAuditLogs.length} of {auditLogs.length} logs
              </div>
              <Button variant="outline" onClick={() => {}}>
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Compliance Rules</h3>
            <Button onClick={() => setIsAddingRule(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {complianceRules.map(rule => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{rule.name}</CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={rule.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}
                    >
                      {rule.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Category</h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {rule.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Criteria</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(rule.criteria, null, 2)}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Checks</h4>
                      <div className="space-y-2">
                        {complianceChecks
                          .filter(check => check.ruleId === rule.id)
                          .slice(0, 2)
                          .map(check => (
                            <div key={check.id} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-md">
                              {check.status === 'passed' && <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />}
                              {check.status === 'failed' && <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />}
                              {check.status === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />}
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">
                                    {check.entityType} {check.entityId}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    {new Date(check.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{check.details}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Edit Rule
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setCheckEntity({type: typeof rule.criteria.entityType === 'string' ? rule.criteria.entityType : 'invoice', id: 'all'});
                      handleRunCheck();
                    }}
                  >
                    Run Check
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>
                Access your previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Generated On</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { 
                      id: '1', 
                      name: 'Q2 Audit Trail', 
                      type: 'audit', 
                      startDate: '2023-04-01', 
                      endDate: '2023-06-30',
                      generatedOn: '2023-07-02T10:30:00Z',
                      format: 'pdf'
                    },
                    { 
                      id: '2', 
                      name: 'June Compliance Summary', 
                      type: 'compliance', 
                      startDate: '2023-06-01', 
                      endDate: '2023-06-30',
                      generatedOn: '2023-07-01T14:15:00Z',
                      format: 'excel'
                    },
                    { 
                      id: '3', 
                      name: 'Q2 Tax Documentation', 
                      type: 'tax', 
                      startDate: '2023-04-01', 
                      endDate: '2023-06-30',
                      generatedOn: '2023-07-05T09:45:00Z',
                      format: 'pdf'
                    }
                  ].map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{new Date(report.generatedOn).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {report.format}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            Regenerate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditDashboard;
