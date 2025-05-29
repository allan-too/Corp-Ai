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
import { Invoice, Vendor } from '../../../types/finance';
import { FileUp, Plus, RefreshCw, Search, Upload, AlertTriangle, CheckCircle2, Trash, Edit, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const AccountsPayableDashboard = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'Net 30'
  });
  const [isEditingVendor, setIsEditingVendor] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
  const [filter, setFilter] = useState({
    status: 'all',
    vendor: 'all',
    searchTerm: ''
  });
  const [newInvoice, setNewInvoice] = useState({
    vendorId: '',
    amount: '',
    dueDate: '',
    description: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchInvoices();
    fetchVendors();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getInvoices({});
      if (response.data) {
        setInvoices(response.data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const response = await financeApi.getVendors({});
      if (response.data) {
        setVendors(response.data);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch vendors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVendor = async () => {
    if (!newVendor.name || !newVendor.email) {
      toast.error('Vendor name and email are required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await financeApi.createVendor(newVendor);
      if (response.data) {
        setVendors([...vendors, response.data]);
        setNewVendor({
          name: '',
          email: '',
          phone: '',
          address: '',
          paymentTerms: 'Net 30'
        });
        setIsAddingVendor(false);
        toast.success('Vendor added successfully');
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast.error('Failed to add vendor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVendor = async () => {
    if (!editingVendor || !editingVendor.id) return;

    setIsLoading(true);
    try {
      const response = await financeApi.updateVendor(editingVendor.id, editingVendor);
      if (response.data) {
        setVendors(vendors.map(v => v.id === editingVendor.id ? response.data : v));
        setEditingVendor(null);
        setIsEditingVendor(false);
        toast.success('Vendor updated successfully');
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast.error('Failed to update vendor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!vendorId) return;

    if (!window.confirm('Are you sure you want to delete this vendor?')) return;

    setIsLoading(true);
    try {
      await financeApi.deleteVendor(vendorId);
      setVendors(vendors.filter(v => v.id !== vendorId));
      toast.success('Vendor deleted successfully');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error('Failed to delete vendor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInvoice = async () => {
    if (!newInvoice.vendorId || !newInvoice.amount || !newInvoice.dueDate) {
      toast.error('Vendor, amount, and due date are required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await financeApi.createInvoice(newInvoice);
      if (response.data) {
        setInvoices([...invoices, response.data]);
        setNewInvoice({
          vendorId: '',
          amount: '',
          dueDate: '',
          description: '',
          status: 'draft'
        });
        setIsAddingInvoice(false);
        toast.success('Invoice added successfully');
      }
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast.error('Failed to add invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadInvoice = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await financeApi.uploadInvoice(formData);
      if (response.data) {
        setInvoices([...invoices, response.data]);
        setSelectedFile(null);
        setIsUploadingInvoice(false);
        toast.success('Invoice uploaded and processed successfully');
      }
    } catch (error) {
      console.error('Error uploading invoice:', error);
      toast.error('Failed to upload and process invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = filter.status === 'all' || invoice.status === filter.status;
    const matchesVendor = filter.vendor === 'all' || invoice.vendorId === filter.vendor;
    const matchesSearch = invoice.description?.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(filter.searchTerm.toLowerCase());
    return matchesStatus && matchesVendor && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Accounts Payable</h2>
          <p className="text-muted-foreground">
            Manage your vendor invoices, payments, and vendor relationships.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => fetchInvoices()} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${invoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((acc, curr) => acc + parseFloat(curr.amount.toString()), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + parseFloat(curr.amount.toString()), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredInvoices.filter(i => i.status === 'pending').length} invoices
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
          <TabsTrigger value="invoices" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="vendors" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Vendors
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filter.vendor}
                onValueChange={(value) => setFilter({ ...filter, vendor: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isUploadingInvoice} onOpenChange={setIsUploadingInvoice}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Invoice</DialogTitle>
                    <DialogDescription>
                      Upload an invoice PDF or image to automatically extract details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-center justify-center gap-1.5 p-6 border-2 border-dashed border-gray-300 rounded-lg">
                      <FileUp className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-600">Drag and drop your invoice or click to browse</p>
                      <Input
                        id="invoice"
                        type="file"
                        accept="image/*,.pdf"
                        className="mt-2"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadingInvoice(false)}>Cancel</Button>
                    <Button onClick={handleUploadInvoice} disabled={!selectedFile || isLoading}>
                      {isLoading ? 'Processing...' : 'Process Invoice'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button onClick={() => setIsAddingInvoice(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </div>
          </div>

          {isAddingInvoice && (
            <div className="p-4 border rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New Invoice</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select
                    value={newInvoice.vendorId}
                    onValueChange={(value) => setNewInvoice({ ...newInvoice, vendorId: value })}
                  >
                    <SelectTrigger id="vendor">
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newInvoice.status}
                    onValueChange={(value) => setNewInvoice({ ...newInvoice, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Invoice description"
                    value={newInvoice.description}
                    onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingInvoice(false)}>Cancel</Button>
                <Button onClick={handleAddInvoice} disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Invoice'}
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No invoices found. Add a new invoice to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => {
                    const vendor = vendors.find(v => v.id === invoice.vendorId);
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{vendor?.name || 'Unknown Vendor'}</TableCell>
                        <TableCell>${parseFloat(invoice.amount.toString()).toFixed(2)}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              invoice.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : invoice.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : invoice.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Vendor List</h3>
            <Button onClick={() => setIsAddingVendor(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Vendor
            </Button>
          </div>

          {isAddingVendor && (
            <div className="p-4 border rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New Vendor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Vendor name"
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@vendor.com"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select
                    value={newVendor.paymentTerms}
                    onValueChange={(value) => setNewVendor({ ...newVendor, paymentTerms: value })}
                  >
                    <SelectTrigger id="paymentTerms">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Vendor address"
                    value={newVendor.address}
                    onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingVendor(false)}>Cancel</Button>
                <Button onClick={handleAddVendor} disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Vendor'}
                </Button>
              </div>
            </div>
          )}

          {isEditingVendor && editingVendor && (
            <div className="p-4 border rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Edit Vendor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="Vendor name"
                    value={editingVendor.name}
                    onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="contact@vendor.com"
                    value={editingVendor.email}
                    onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    placeholder="+1 (555) 123-4567"
                    value={editingVendor.phone}
                    onChange={(e) => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-paymentTerms">Payment Terms</Label>
                  <Select
                    value={editingVendor.paymentTerms}
                    onValueChange={(value) => setEditingVendor({ ...editingVendor, paymentTerms: value })}
                  >
                    <SelectTrigger id="edit-paymentTerms">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    placeholder="Vendor address"
                    value={editingVendor.address}
                    onChange={(e) => setEditingVendor({ ...editingVendor, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsEditingVendor(false);
                  setEditingVendor(null);
                }}>Cancel</Button>
                <Button onClick={handleEditVendor} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Payment Terms</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No vendors found. Add a new vendor to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.email}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>{vendor.paymentTerms}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setEditingVendor(vendor);
                              setIsEditingVendor(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteVendor(vendor.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountsPayableDashboard;
