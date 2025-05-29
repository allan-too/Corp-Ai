
import { apiClient } from './client';

// Helper function for error handling
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return { data: response.data, error: null };
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    return { 
      data: null, 
      error: error.response?.data?.detail || error.message || 'An error occurred' 
    };
  }
};

// CRM
export const crmApi = {
  createLead: (data) => handleApiCall(() => apiClient.post('/tools/crm', data)),
  getLeads: () => handleApiCall(() => apiClient.get('/tools/crm/leads')),
};

// Sales Forecast
export const salesForecastApi = {
  getForecast: (productId, period) => 
    handleApiCall(() => apiClient.post('/tools/sales_forecast', { product_id: productId, period })),
};

// Chat Support
export const chatSupportApi = {
  sendMessage: (message) => handleApiCall(() => apiClient.post('/tools/chat_support', { query: message })),
  streamChat: (message, onChunk) => {
    const controller = new AbortController();
    const promise = apiClient.post('/tools/chat_support/stream', { query: message }, {
      signal: controller.signal,
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        const chunk = progressEvent.currentTarget.response;
        if (chunk) onChunk(chunk);
      },
    });
    
    return {
      promise: handleApiCall(() => promise),
      cancel: () => controller.abort()
    };
  }
};

// Marketing
export const marketingApi = {
  createCampaign: (data) => handleApiCall(() => apiClient.post('/tools/marketing', data)),
  getCampaigns: () => handleApiCall(() => apiClient.get('/tools/marketing/campaigns')),
};

// Social Media
export const socialMediaApi = {
  createPost: (data) => handleApiCall(() => apiClient.post('/tools/social_media', data)),
  getPosts: () => handleApiCall(() => apiClient.get('/tools/social_media/posts')),
  generateContent: (prompt) => handleApiCall(() => apiClient.post('/tools/social_media/generate', { prompt })),
  schedulePost: (data) => handleApiCall(() => apiClient.post('/tools/social_media/schedule', data)),
};

// Analytics
export const analyticsApi = {
  generateReport: (data) => handleApiCall(() => apiClient.post('/tools/analytics', data)),
  downloadReport: (reportId) => handleApiCall(() => 
    apiClient.get(`/tools/analytics/download/${reportId}`, { responseType: 'blob' })),
  getMetrics: () => handleApiCall(() => apiClient.get('/tools/analytics/metrics')),
};

// HR Assistant
export const hrApi = {
  postJob: (data) => handleApiCall(() => apiClient.post('/tools/hr/job_post', data)),
  getJobs: () => handleApiCall(() => apiClient.get('/tools/hr/jobs')),
  analyzeResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return handleApiCall(() => apiClient.post('/tools/hr/analyze_resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
  },
  generateJobDescription: (data) => handleApiCall(() => apiClient.post('/tools/hr/generate_description', data)),
};

// Contract Review
export const contractApi = {
  reviewContract: (data) => handleApiCall(() => apiClient.post('/tools/contract_review', { text: data.text })),
  uploadContract: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return handleApiCall(() => apiClient.post('/tools/contract_review/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
  },
  getAnalysis: (contractId) => handleApiCall(() => apiClient.get(`/tools/contract_review/${contractId}`)),
};

// Finance Planner
export const financeApi = {
  // Budget Management
  createBudget: (data) => handleApiCall(() => apiClient.post('/tools/finance/budget', data)),
  getBudgets: () => handleApiCall(() => apiClient.get('/tools/finance/budgets')),
  getBudgetById: (id) => handleApiCall(() => apiClient.get(`/tools/finance/budget/${id}`)),
  updateBudget: (id, data) => handleApiCall(() => apiClient.put(`/tools/finance/budget/${id}`, data)),
  deleteBudget: (id) => handleApiCall(() => apiClient.delete(`/tools/finance/budget/${id}`)),
  
  // Bookkeeping
  getTransactions: (filters) => handleApiCall(() => apiClient.get('/tools/finance/transactions', { params: filters })),
  createTransaction: (data) => handleApiCall(() => apiClient.post('/tools/finance/transactions', data)),
  updateTransaction: (id, data) => handleApiCall(() => apiClient.put(`/tools/finance/transactions/${id}`, data)),
  deleteTransaction: (id) => handleApiCall(() => apiClient.delete(`/tools/finance/transactions/${id}`)),
  getCategories: () => handleApiCall(() => apiClient.get('/tools/finance/categories')),
  createCategory: (data) => handleApiCall(() => apiClient.post('/tools/finance/categories', data)),
  reconcileTransactions: (data) => handleApiCall(() => apiClient.post('/tools/finance/reconcile', data)),
  extractFromReceipt: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return handleApiCall(() => apiClient.post('/tools/finance/extract-receipt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
  },
  
  // Accounts Payable
  getVendors: () => handleApiCall(() => apiClient.get('/tools/finance/vendors')),
  createVendor: (data) => handleApiCall(() => apiClient.post('/tools/finance/vendors', data)),
  updateVendor: (id, data) => handleApiCall(() => apiClient.put(`/tools/finance/vendors/${id}`, data)),
  deleteVendor: (id) => handleApiCall(() => apiClient.delete(`/tools/finance/vendors/${id}`)),
  getVendorInvoices: (vendorId) => handleApiCall(() => apiClient.get(`/tools/finance/vendors/${vendorId}/invoices`)),
  getInvoices: (filters) => handleApiCall(() => apiClient.get('/tools/finance/invoices', { params: filters })),
  createInvoice: (data) => handleApiCall(() => apiClient.post('/tools/finance/invoices', data)),
  updateInvoice: (id, data) => handleApiCall(() => apiClient.put(`/tools/finance/invoices/${id}`, data)),
  deleteInvoice: (id) => handleApiCall(() => apiClient.delete(`/tools/finance/invoices/${id}`)),
  extractInvoice: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return handleApiCall(() => apiClient.post('/tools/finance/extract-invoice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
  },
  approveInvoice: (id) => handleApiCall(() => apiClient.post(`/tools/finance/invoices/${id}/approve`)),
  payInvoice: (id, paymentData) => handleApiCall(() => apiClient.post(`/tools/finance/invoices/${id}/pay`, paymentData)),
  detectAnomalies: (data) => handleApiCall(() => apiClient.post('/tools/finance/detect-anomalies', data)),
  
  // Accounts Receivable
  getCustomers: () => handleApiCall(() => apiClient.get('/tools/finance/customers')),
  createCustomer: (data) => handleApiCall(() => apiClient.post('/tools/finance/customers', data)),
  getCustomerInvoices: (customerId) => handleApiCall(() => apiClient.get(`/tools/finance/customers/${customerId}/invoices`)),
  createCustomerInvoice: (data) => handleApiCall(() => apiClient.post('/tools/finance/customer-invoices', data)),
  updateCustomerInvoice: (id, data) => handleApiCall(() => apiClient.put(`/tools/finance/customer-invoices/${id}`, data)),
  sendInvoice: (id, method) => handleApiCall(() => apiClient.post(`/tools/finance/customer-invoices/${id}/send`, { method })),
  deleteCustomerInvoice: (id) => handleApiCall(() => apiClient.delete(`/tools/finance/customer-invoices/${id}`)),
  predictPayments: () => handleApiCall(() => apiClient.get('/tools/finance/predict-payments')),
  getDunningSequences: () => handleApiCall(() => apiClient.get('/tools/finance/dunning-sequences')),
  createDunningSequence: (data) => handleApiCall(() => apiClient.post('/tools/finance/dunning-sequences', data)),
  executeDunning: (invoiceId, sequenceId) => handleApiCall(() => apiClient.post('/tools/finance/execute-dunning', { invoiceId, sequenceId })),
  
  // Financial Planning & Analysis
  createForecast: (data) => handleApiCall(() => apiClient.post('/tools/finance/forecasts', data)),
  getForecasts: () => handleApiCall(() => apiClient.get('/tools/finance/forecasts')),
  getForecastById: (id) => handleApiCall(() => apiClient.get(`/tools/finance/forecasts/${id}`)),
  getFinancialMetrics: () => handleApiCall(() => apiClient.get('/tools/finance/financial-metrics')),
  createScenario: (data) => handleApiCall(() => apiClient.post('/tools/finance/scenarios', data)),
  getScenarios: () => handleApiCall(() => apiClient.get('/tools/finance/scenarios')),
  getScenarioById: (id) => handleApiCall(() => apiClient.get(`/tools/finance/scenarios/${id}`)),
  runScenario: (id) => handleApiCall(() => apiClient.post(`/tools/finance/scenarios/${id}/run`)),
  chatQuery: (query) => handleApiCall(() => apiClient.post('/tools/finance/chat-query', { query })),
  
  // Audit & Compliance
  getAuditLogs: (filters) => handleApiCall(() => apiClient.get('/tools/finance/audit-logs', { params: filters })),
  getComplianceRules: () => handleApiCall(() => apiClient.get('/tools/finance/compliance-rules')),
  createComplianceRule: (data) => handleApiCall(() => apiClient.post('/tools/finance/compliance-rules', data)),
  deleteComplianceRule: (id) => handleApiCall(() => apiClient.delete(`/tools/finance/compliance-rules/${id}`)),
  updateComplianceRule: (id, data) => handleApiCall(() => apiClient.put(`/tools/finance/compliance-rules/${id}`, data)),
  runComplianceCheck: (entityType, entityId) => handleApiCall(() => apiClient.post('/tools/finance/compliance-check', { entityType, entityId })),
  
  // Reports
  uploadSpreadsheet: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return handleApiCall(() => apiClient.post('/tools/finance/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
  },
  generateReport: (data) => handleApiCall(() => apiClient.post('/tools/finance/report', data)),
  downloadReport: (reportId) => handleApiCall(() => 
    apiClient.get(`/tools/finance/report/${reportId}/download`, { responseType: 'blob' })),
  getReportTemplates: () => handleApiCall(() => apiClient.get('/tools/finance/report-templates')),
  createReportTemplate: (data) => handleApiCall(() => apiClient.post('/tools/finance/report-templates', data)),
};

// Supply Chain
export const supplyChainApi = {
  optimizeInventory: (productId) => handleApiCall(() => 
    apiClient.post('/tools/supply_chain/optimize', { product_id: productId })),
  getInventoryStatus: () => handleApiCall(() => apiClient.get('/tools/supply_chain/inventory')),
  predictDemand: (data) => handleApiCall(() => apiClient.post('/tools/supply_chain/predict', data)),
  getSuppliers: () => handleApiCall(() => apiClient.get('/tools/supply_chain/suppliers')),
};

// Scheduler
export const schedulerApi = {
  createAppointment: (data) => handleApiCall(() => apiClient.post('/tools/scheduler', data)),
  getAppointments: () => handleApiCall(() => apiClient.get('/tools/scheduler/appointments')),
  cancelAppointment: (id) => handleApiCall(() => apiClient.delete(`/tools/scheduler/appointments/${id}`)),
  updateAppointment: (id, data) => handleApiCall(() => apiClient.put(`/tools/scheduler/appointments/${id}`, data)),
};

// Review Management
export const reviewApi = {
  getReviews: () => handleApiCall(() => apiClient.get('/tools/reviews')),
  respondToReview: (reviewId, response) => 
    handleApiCall(() => apiClient.post('/tools/reviews/respond', { review_id: reviewId, response })),
  generateResponse: (reviewId) => handleApiCall(() => apiClient.get(`/tools/reviews/generate/${reviewId}`)),
  analyzeReviews: () => handleApiCall(() => apiClient.get('/tools/reviews/analyze')),
};

// Accounting
export const accountingApi = {
  generateInvoice: (data) => handleApiCall(() => apiClient.post('/tools/accounting/invoice', data)),
  downloadInvoice: (invoiceId) => 
    handleApiCall(() => apiClient.get(`/tools/accounting/invoice/${invoiceId}/download`, { responseType: 'blob' })),
  getInvoices: () => handleApiCall(() => apiClient.get('/tools/accounting/invoices')),
  getExpenses: () => handleApiCall(() => apiClient.get('/tools/accounting/expenses')),
  addExpense: (data) => handleApiCall(() => apiClient.post('/tools/accounting/expenses', data)),
};

// Inventory
export const inventoryApi = {
  updateStock: (data) => handleApiCall(() => apiClient.post('/tools/inventory/update', data)),
  getProducts: () => handleApiCall(() => apiClient.get('/tools/inventory/products')),
  addProduct: (data) => handleApiCall(() => apiClient.post('/tools/inventory/products', data)),
  getInventoryReport: () => handleApiCall(() => apiClient.get('/tools/inventory/report')),
};

// Legal CRM
export const legalCrmApi = {
  createCase: (data) => handleApiCall(() => apiClient.post('/tools/legal_crm/case', data)),
  getCases: () => handleApiCall(() => apiClient.get('/tools/legal_crm/cases')),
  getCase: (caseId) => handleApiCall(() => apiClient.get(`/tools/legal_crm/cases/${caseId}`)),
  addDocument: (caseId, data) => handleApiCall(() => apiClient.post(`/tools/legal_crm/cases/${caseId}/documents`, data)),
  getDocuments: (caseId) => handleApiCall(() => apiClient.get(`/tools/legal_crm/cases/${caseId}/documents`)),
};

// Notification
export const notificationApi = {
  sendNotification: (data) => handleApiCall(() => apiClient.post('/tools/notification', data)),
  getNotificationLog: () => handleApiCall(() => apiClient.get('/tools/notification/log')),
  getTemplates: () => handleApiCall(() => apiClient.get('/tools/notification/templates')),
  createTemplate: (data) => handleApiCall(() => apiClient.post('/tools/notification/templates', data)),
};

// Reservation
export const reservationApi = {
  createReservation: (data) => handleApiCall(() => apiClient.post('/tools/reservation', data)),
  getReservations: () => handleApiCall(() => apiClient.get('/tools/reservation/list')),
  cancelReservation: (id) => handleApiCall(() => apiClient.delete(`/tools/reservation/${id}`)),
  updateReservation: (id, data) => handleApiCall(() => apiClient.put(`/tools/reservation/${id}`, data)),
};

// Telco
export const telcoApi = {
  uploadCDR: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return handleApiCall(() => apiClient.post('/tools/telco/cdr/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
  },
  getMaintenanceReport: () => handleApiCall(() => apiClient.get('/tools/telco/maintenance')),
  getChurnAnalysis: () => handleApiCall(() => apiClient.get('/tools/telco/churn')),
  getFraudDetection: () => handleApiCall(() => apiClient.get('/tools/telco/fraud')),
  generateReport: (data) => handleApiCall(() => apiClient.post('/tools/telco/report', data)),
  downloadReport: (reportId) => handleApiCall(() => 
    apiClient.get(`/tools/telco/report/${reportId}/download`, { responseType: 'blob' })),
};

// Student Assist
export const studentApi = {
  uploadNotes: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return handleApiCall(() => apiClient.post('/tools/student/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
  },
  summarizeNotes: (data) => handleApiCall(() => apiClient.post('/tools/student/summarize', data)),
  generateFlashcards: (data) => handleApiCall(() => apiClient.post('/tools/student/flashcards', data)),
  improveWriting: (data) => handleApiCall(() => apiClient.post('/tools/student/writing', data)),
  generateCitations: (data) => handleApiCall(() => apiClient.post('/tools/student/cite', data)),
  transcribeAudio: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return handleApiCall(() => apiClient.post('/tools/student/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
  },
  createPlan: (data) => handleApiCall(() => apiClient.post('/tools/student/plan', data)),
  chatWithAI: (data) => handleApiCall(() => apiClient.post('/tools/student/chat', data)),
  exportReport: (data) => handleApiCall(() => apiClient.post('/tools/student/export', data)),
};
