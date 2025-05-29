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
import { Progress } from '@/components/ui/progress';
import { financeApi } from '../../../api/toolsApi';
import { CustomerInvoice, Customer, DunningSequence } from '../../../types/finance';
import { Plus, RefreshCw, Search, Mail, Clock, AlertTriangle, BarChart, Calendar, Trash, Edit, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const AccountsReceivableDashboard = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dunningSequences, setDunningSequences] = useState<DunningSequence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customerId: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    description: '',
    items: []
  });
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'Net 30'
  });
  const [isAddingSequence, setIsAddingSequence] = useState(false);
  const [newSequence, setNewSequence] = useState({
    name: '',
    description: '',
    steps: [{ id: '1', action: 'email', delay: 7, template: 'reminder' }]
  });
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoice | null>(null);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<CustomerInvoice | null>(null);
  const [isViewingDunning, setIsViewingDunning] = useState(false);
  const [filter, setFilter] = useState({
    status: 'all',
    customer: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
    fetchDunningSequences();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getCustomerInvoices({});
      if (response.data) {
        setInvoices(response.data);
      } else {
        // Initialize with empty array if no data
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await financeApi.getCustomers();
      if (response.data) {
        setCustomers(response.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  };

  const fetchDunningSequences = async () => {
    try {
      const response = await financeApi.getDunningSequences();
      if (response.data) {
        setDunningSequences(response.data);
      } else {
        setDunningSequences([]);
      }
    } catch (error) {
      console.error('Error fetching dunning sequences:', error);
      setDunningSequences([]);
    }
  };

  const handleSendInvoice = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await financeApi.sendInvoice(id, 'email');
      if (response.data) {
        toast.success('Invoice sent successfully');
        fetchInvoices(); // Refresh the invoice list
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
      
      fetchInvoices(); // Refresh the invoice list
      toast.success('Invoice sent successfully');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDunning = async (invoiceId: string, sequenceId: string) => {
    setIsLoading(true);
    try {
      const response = await financeApi.executeDunning(invoiceId, sequenceId);
      if (response.data) {
        toast.success('Collection sequence started successfully');
        setIsViewingDunning(false);
        fetchInvoices(); // Refresh the invoice list
      }
    } catch (error) {
      console.error('Error starting collection sequence:', error);
      toast.error('Failed to start collection sequence');
      setIsViewingDunning(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setIsLoading(true);
      try {
        const response = await financeApi.deleteCustomerInvoice(id);
        if (response.data) {
          toast.success('Invoice deleted successfully');
          // Remove the invoice from the local state
          setInvoices(invoices.filter(invoice => invoice.id !== id));
          // If the deleted invoice was selected, clear the selection
          if (selectedInvoice && selectedInvoice.id === id) {
            setSelectedInvoice(null);
          }
        }
      } catch (error) {
        console.error('Error deleting invoice:', error);
        toast.error('Failed to delete invoice');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleEditInvoice = (invoice: CustomerInvoice) => {
    setEditingInvoice({
      ...invoice
    });
    setIsEditingInvoice(true);
  };
  
  const handleUpdateInvoice = async () => {
    if (!editingInvoice) return;
    
    setIsLoading(true);
    try {
      const response = await financeApi.updateCustomerInvoice(editingInvoice.id, editingInvoice);
      if (response.data) {
        toast.success('Invoice updated successfully');
        // Update the invoice in the local state
        setInvoices(invoices.map(invoice => 
          invoice.id === editingInvoice.id ? response.data : invoice
        ));
        // Update the selected invoice if it was the one being edited
        if (selectedInvoice && selectedInvoice.id === editingInvoice.id) {
          setSelectedInvoice(response.data);
        }
        setIsEditingInvoice(false);
        setEditingInvoice(null);
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInvoice = async () => {
    if (!newInvoice.customerId || !newInvoice.amount || !newInvoice.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await financeApi.createCustomerInvoice(newInvoice);
      if (response.data) {
        toast.success('Invoice added successfully');
        setInvoices([...invoices, response.data]);
        setIsAddingInvoice(false);
        setNewInvoice({
          customerId: '',
          amount: 0,
          dueDate: new Date().toISOString().split('T')[0],
          description: '',
          items: []
        });
      }
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast.error('Failed to add invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await financeApi.createCustomer(newCustomer);
      if (response.data) {
        toast.success('Customer added successfully');
        setCustomers([...customers, response.data]);
        setIsAddingCustomer(false);
        setNewCustomer({
          name: '',
          email: '',
          phone: '',
          address: '',
          paymentTerms: 'Net 30'
        });
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDunningSequence = async () => {
    if (!newSequence.name) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await financeApi.createDunningSequence(newSequence);
      if (response.data) {
        toast.success('Dunning sequence added successfully');
        setDunningSequences([...dunningSequences, response.data]);
        setIsAddingSequence(false);
        setNewSequence({
          name: '',
          description: '',
          steps: [{ id: '1', action: 'email', delay: 7, template: 'reminder' }]
        });
      }
    } catch (error) {
      console.error('Error adding dunning sequence:', error);
      toast.error('Failed to add dunning sequence');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filter.status !== 'all' && invoice.status !== filter.status) return false;
    if (filter.customer !== 'all' && invoice.customerId !== filter.customer) return false;
    if (filter.searchTerm && !invoice.invoiceNumber.toLowerCase().includes(filter.searchTerm.toLowerCase()) && 
        !invoice.customerName.toLowerCase().includes(filter.searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalReceivables = filteredInvoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalOverdue = filteredInvoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  const overduePercentage = totalReceivables > 0 ? (totalOverdue / totalReceivables) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Receivables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalReceivables.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Total Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOverdue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Overdue Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{overduePercentage.toFixed(1)}%</div>
              <Progress value={overduePercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
          <TabsTrigger value="invoices" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Customer Invoices
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Customers
          </TabsTrigger>
          <TabsTrigger value="collections" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Collections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search invoices..."
                  className="pl-8 w-[250px]"
                  value={filter.searchTerm}
                  onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
                />
              </div>
              <Select
                value={filter.status}
                onValueChange={(value) => setFilter({ ...filter, status: value })}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filter.customer}
                onValueChange={(value) => setFilter({ ...filter, customer: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsAddingInvoice(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Invoices</CardTitle>
              <CardDescription>
                Manage your customer invoices and track payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Predicted Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        <div className="flex justify-center items-center">
                          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                          Loading invoices...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              ${invoice.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                              ${invoice.status === 'sent' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                              ${invoice.status === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                              ${invoice.status === 'draft' ? 'bg-gray-50 text-gray-700 border-gray-200' : ''}
                            `}
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {invoice.paymentPrediction ? (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-sm">
                                {new Date(invoice.paymentPrediction.predictedDate).toLocaleDateString()}
                                <span className="text-xs text-gray-500 ml-1">
                                  ({Math.round(invoice.paymentPrediction.confidence * 100)}%)
                                </span>
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not available</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {invoice.status === 'draft' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleSendInvoice(invoice.id)}
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Send
                              </Button>
                            )}
                            {invoice.status === 'overdue' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setIsViewingDunning(true);
                                }}
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Collect
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleDeleteInvoice(invoice.id)}
                            >
                              <Trash className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditInvoice(invoice)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={fetchInvoices}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" onClick={() => {}}>
                Export
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8 w-[250px]"
              />
            </div>
            <Button onClick={() => setIsAddingCustomer(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
            <Button onClick={() => setIsAddingSequence(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Sequence
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Manage your customer relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Credit Limit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.paymentTerms}</TableCell>
                        <TableCell>${customer.creditLimit?.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Collection Sequences</h3>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Sequence
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dunningSequences.map(sequence => (
              <Card key={sequence.id}>
                <CardHeader>
                  <CardTitle>{sequence.name}</CardTitle>
                  <CardDescription>
                    {sequence.steps.length} steps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sequence.steps.map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              Day {step.daysAfterDue}
                            </Badge>
                            <Badge variant="outline" className={
                              step.channel === 'email' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              step.channel === 'sms' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }>
                              {step.channel}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">
                            {step.channel === 'email' && 'Send email using '}
                            {step.channel === 'sms' && 'Send SMS using '}
                            {step.channel === 'letter' && 'Send letter using '}
                            <span className="font-medium">
                              {step.templateId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Duplicate</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dunning Dialog */}
      <Dialog open={isViewingDunning} onOpenChange={setIsViewingDunning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Collection Sequence</DialogTitle>
            <DialogDescription>
              Select a collection sequence to start for invoice {selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              {dunningSequences.map(sequence => (
                <div key={sequence.id} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    id={`sequence-${sequence.id}`}
                    name="dunning-sequence"
                    className="h-4 w-4 text-blue-600"
                  />
                  <Label htmlFor={`sequence-${sequence.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium">{sequence.name}</div>
                    <div className="text-sm text-gray-500">{sequence.steps.length} steps, starts immediately</div>
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewingDunning(false)}>Cancel</Button>
            <Button onClick={() => handleStartDunning(selectedInvoice?.id || '', '1')}>
              Start Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountsReceivableDashboard;
