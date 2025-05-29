// Finance module types

// Common types
export interface Currency {
  amount: number;
  currency: string;
}

// Bookkeeping types
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status: 'pending' | 'completed' | 'reconciled' | 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  attachmentUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  parentId?: string;
}

// Accounts Payable types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';
  items: InvoiceItem[];
  notes?: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  paymentTerms?: string;
  bankDetails?: string;
  createdAt: string;
  updatedAt: string;
}

// Accounts Receivable types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentTerms?: string;
  creditLimit?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInvoice extends Omit<Invoice, 'vendorId' | 'vendorName'> {
  customerId: string;
  customerName: string;
  paymentPrediction?: {
    predictedDate: string;
    confidence: number;
  };
}

export interface DunningSequence {
  id: string;
  name: string;
  steps: DunningStep[];
  createdAt: string;
  updatedAt: string;
}

export interface DunningStep {
  id: string;
  sequenceId: string;
  daysAfterDue: number;
  channel: 'email' | 'sms' | 'letter';
  templateId: string;
  active: boolean;
}

// Financial Planning & Analysis types
export interface Budget {
  id: string;
  month: string;
  revenue: number;
  expenses: number;
  surplus: number;
  categories: BudgetCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryId: string;
  categoryName: string;
  type: 'income' | 'expense';
  plannedAmount: number;
  actualAmount?: number;
  variance?: number;
}

export interface Forecast {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'revenue' | 'expense' | 'cash-flow';
  data: ForecastDataPoint[];
  createdAt: string;
  updatedAt: string;
}

export interface ForecastDataPoint {
  date: string;
  amount: number;
  confidence: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  baselineId: string;
  assumptions: ScenarioAssumption[];
  results: ScenarioResult[];
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioAssumption {
  id: string;
  scenarioId: string;
  category: string;
  description: string;
  value: number;
  changeType: 'percentage' | 'absolute';
}

export interface ScenarioResult {
  category: string;
  baselineValue: number;
  scenarioValue: number;
  difference: number;
  percentChange: number;
}

// Audit & Compliance types
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'view';
  userId: string;
  userName: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  category: 'revenue-recognition' | 'lease-accounting' | 'tax' | 'regulatory';
  criteria: Record<string, unknown>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceCheck {
  id: string;
  ruleId: string;
  entityType: string;
  entityId: string;
  status: 'passed' | 'failed' | 'warning';
  details: string;
  timestamp: string;
}

// API request/response types
export interface CreateBudgetRequest {
  month: string;
  revenue: number;
  expenses: number;
  categories?: Array<{
    categoryId: string;
    plannedAmount: number;
  }>;
}

export interface CreateBudgetResponse {
  id: string;
  month: string;
  revenue: number;
  expenses: number;
  surplus: number;
  createdAt: string;
}

export interface CreateInvoiceRequest {
  invoiceNumber?: string;
  vendorId: string;
  issueDate: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
  notes?: string;
}

export interface ExtractInvoiceRequest {
  fileUrl: string;
  fileType: 'pdf' | 'image';
}

export interface ExtractInvoiceResponse {
  extractedData: {
    invoiceNumber?: string;
    vendorName?: string;
    issueDate?: string;
    dueDate?: string;
    totalAmount?: number;
    items?: Array<{
      description?: string;
      quantity?: number;
      unitPrice?: number;
      amount?: number;
    }>;
  };
  confidence: number;
}

export interface ForecastRequest {
  type: 'revenue' | 'expense' | 'cash-flow';
  startDate: string;
  endDate: string;
  historicalDataMonths?: number;
  includeSeasonality?: boolean;
}

export interface ChatQueryRequest {
  query: string;
  context?: Record<string, unknown>;
}

export interface ChatQueryResponse {
  answer: string;
  data?: Record<string, unknown>;
  sources?: Array<{
    type: string;
    id: string;
    name: string;
  }>;
}

export interface GenerateReportRequest {
  type: 'profit-loss' | 'balance-sheet' | 'cash-flow' | 'tax' | 'audit';
  startDate: string;
  endDate: string;
  format?: 'pdf' | 'excel' | 'csv';
}

export interface GenerateReportResponse {
  reportId: string;
  reportUrl: string;
  expiresAt: string;
}
