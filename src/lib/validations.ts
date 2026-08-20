import { z } from "zod";

// ─── Task Schemas ───────────────────────────────────────

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "WAITING", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).optional(),
  module: z.enum(["TASK", "IMPORT_PURCHASE", "SALES", "SERVICE"]).optional(),
  taskType: z.string().max(50).optional(),
  dueDate: z.string().optional().nullable(),
  dueTime: z.string().max(5).optional().nullable(),
  reminderAt: z.string().optional().nullable(),
  reminderLead: z.number().int().min(0).optional().nullable(),
  isRecurring: z.boolean().optional(),
  recurrenceRule: z.string().optional().nullable(),
  owner: z.string().max(100).optional().nullable(),
  contactName: z.string().max(100).optional().nullable(),
  contactCompany: z.string().max(100).optional().nullable(),
  nextAction: z.string().max(500).optional().nullable(),
  waitingFor: z.string().max(500).optional().nullable(),
  followUpDate: z.string().optional().nullable(),
  tags: z.string().max(500).optional().nullable(),
  orderId: z.string().optional().nullable(),
  shipmentId: z.string().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string(),
});

// Waiting validation: must have waitingFor or followUpDate
export const waitingTaskSchema = z.object({
  waitingFor: z.string().min(1, "Waiting For is required when status is Waiting"),
  followUpDate: z.string().min(1, "Follow-up date is required when status is Waiting"),
});

// ─── Order Schemas ──────────────────────────────────────

export const createOrderSchema = z.object({
  type: z.enum(["CHINA_IMPORT", "DOMESTIC_PURCHASE"]),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().nullable(),
  supplierId: z.string().optional().nullable(),
  currency: z.string().max(3).optional().nullable(),
  exchangeRate: z.number().positive().optional().nullable(),
  piRef: z.string().max(100).optional().nullable(),
  poRef: z.string().max(100).optional().nullable(),
  paymentTerms: z.string().max(200).optional().nullable(),
  dueDate: z.string().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const updateOrderSchema = createOrderSchema.partial().extend({
  id: z.string(),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).optional(),
});

// ─── Order Item Schema ──────────────────────────────────

export const createOrderItemSchema = z.object({
  orderId: z.string(),
  productId: z.string().optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  name: z.string().min(1, "Name is required").max(200),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().max(20).optional(),
  unitCost: z.number().min(0, "Cost must be non-negative"),
  totalCost: z.number().min(0).optional(),
  hsCode: z.string().max(20).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

// ─── Supplier Schema ────────────────────────────────────

export const createSupplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  country: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  contacts: z.array(z.object({
    name: z.string().max(100),
    phone: z.string().max(50).optional(),
    email: z.string().email().optional().or(z.literal("")),
    role: z.string().max(50).optional(),
    wechat: z.string().max(100).optional(),
    whatsapp: z.string().max(50).optional(),
  })).optional(),
  paymentTerms: z.string().max(200).optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  notes: z.string().max(2000).optional().nullable(),
});

export const updateSupplierSchema = createSupplierSchema.partial().extend({
  id: z.string(),
});

// ─── Product Schema ─────────────────────────────────────

export const createProductSchema = z.object({
  sku: z.string().max(100).optional().nullable(),
  name: z.string().min(1, "Name is required").max(200),
  brand: z.string().max(100).optional().nullable(),
  hsCode: z.string().max(20).optional().nullable(),
  unit: z.string().max(20).optional(),
  unitCost: z.number().min(0).optional().nullable(),
  weight: z.number().min(0).optional().nullable(),
  cbm: z.number().min(0).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  defaultSupplierId: z.string().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string(),
});

// ─── Shipment Schema ────────────────────────────────────

export const createShipmentSchema = z.object({
  orderId: z.string(),
  shipmentNumber: z.string().max(100).optional().nullable(),
  shippingMode: z.string().max(50).optional().nullable(),
  forwarder: z.string().max(200).optional().nullable(),
  containerNo: z.string().max(50).optional().nullable(),
  bookingDate: z.string().optional().nullable(),
  etd: z.string().optional().nullable(),
  eta: z.string().optional().nullable(),
  actualDeparture: z.string().optional().nullable(),
  actualArrival: z.string().optional().nullable(),
  blAwbNumber: z.string().max(100).optional().nullable(),
  portOfLoading: z.string().max(200).optional().nullable(),
  portOfDestination: z.string().max(200).optional().nullable(),
  status: z.enum(["BOOKING", "BOOKED", "READY", "IN_TRANSIT", "ARRIVED", "CUSTOMS", "CLEARED", "DELIVERED"]).optional(),
  notes: z.string().max(2000).optional().nullable(),
});

// ─── Payment Schema ─────────────────────────────────────

export const createPaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().max(3).optional(),
  exchangeRate: z.number().positive().optional(),
  paymentDate: z.string().min(1, "Payment date is required"),
  type: z.enum(["ADVANCE", "PARTIAL", "FINAL", "BALANCE"]),
  reference: z.string().max(200).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// ─── Landed Cost Schema ─────────────────────────────────

export const createLandedCostSchema = z.object({
  orderId: z.string(),
  component: z.string().min(1, "Component is required").max(100),
  amount: z.number().min(0, "Amount must be non-negative"),
  currency: z.string().max(3).optional(),
  exchangeRate: z.number().positive().optional(),
  allocationMethod: z.string().max(50).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

// ─── Document Schema ────────────────────────────────────

export const createDocumentSchema = z.object({
  type: z.enum(["PI", "PO", "COMMERCIAL_INVOICE", "PACKING_LIST", "BL_AWB", "COO", "CUSTOMS", "CHA", "PAYMENT_PROOF", "OTHER"]),
  fileName: z.string().min(1).max(255),
  fileUrl: z.string().url(),
  fileSize: z.number().int().max(10 * 1024 * 1024).optional(), // 10MB
  mimeType: z.string().max(100).optional(),
  orderId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

// ─── Sales Order Schema ─────────────────────────────────

export const createSalesOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required").max(200),
  customerContact: z.string().max(200).optional().nullable(),
  customerEmail: z.string().email().optional().nullable().or(z.literal("")),
  customerPhone: z.string().max(50).optional().nullable(),
  enquiry: z.string().max(2000).optional().nullable(),
  quotation: z.string().max(2000).optional().nullable(),
  status: z.enum(["ENQUIRY", "QUOTATION_SENT", "FOLLOW_UP", "ORDER_RECEIVED", "COMPLETED", "LOST"]).optional(),
  followUpDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  amount: z.number().min(0).optional().nullable(),
  currency: z.string().max(3).optional(),
  notes: z.string().max(2000).optional().nullable(),
});

// ─── Service Ticket Schema ──────────────────────────────

export const createServiceTicketSchema = z.object({
  customerName: z.string().min(1, "Customer name is required").max(200),
  customerContact: z.string().max(200).optional().nullable(),
  complaint: z.string().max(2000).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  engineer: z.string().max(100).optional().nullable(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).optional(),
  status: z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "VISIT_SCHEDULED", "COMPLETED", "CLOSED"]).optional(),
  visitDate: z.string().optional().nullable(),
  followUpDate: z.string().optional().nullable(),
  closureNotes: z.string().max(2000).optional().nullable(),
});

// ─── Search Schema ──────────────────────────────────────

export const searchSchema = z.object({
  query: z.string().min(1).max(200),
  module: z.enum(["ALL", "TASKS", "ORDERS", "SUPPLIERS", "PRODUCTS"]).optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  supplierId: z.string().optional(),
});

// ─── Types ──────────────────────────────────────────────

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreateLandedCostInput = z.infer<typeof createLandedCostSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type CreateSalesOrderInput = z.infer<typeof createSalesOrderSchema>;
export type CreateServiceTicketInput = z.infer<typeof createServiceTicketSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
