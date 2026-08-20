// Mock data for when no database is configured
// This allows the app to work in "demo mode" without Supabase/PostgreSQL

export const mockData = {
  user: {
    id: "user-1",
    email: "user@taskpilot.com",
    name: "User",
    phone: "+91 98765 43210",
    timezone: "Asia/Kolkata",
    currency: "INR",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date(),
  },

  tasks: [
    { id: "t1", title: "Follow up with Shenzhen supplier on PI", status: "PLANNED", priority: "HIGH", module: "IMPORT_PURCHASE", dueDate: new Date(), dueTime: "10:00", orderId: "o1", order: { id: "o1", orderNumber: "PO-001DF", title: "LED Lights from Shenzhen", productName: "Cabinet / LED Lights" }, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t2", title: "Review packing list for Mumbai order", status: "PLANNED", priority: "CRITICAL", module: "IMPORT_PURCHASE", dueDate: new Date(), dueTime: "11:00", orderId: "o2", order: { id: "o2", orderNumber: "PO-002SH", title: "Ceramic Tiles - Guangzhou", productName: "Keyboard / Tiles" }, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t3", title: "Call customer about quotation", status: "PLANNED", priority: "MEDIUM", module: "SALES", dueDate: new Date(), dueTime: "14:00", createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t4", title: "Confirm CHA documents for BL release", status: "PLANNED", priority: "HIGH", module: "IMPORT_PURCHASE", dueDate: new Date(), dueTime: "15:00", orderId: "o2", order: { id: "o2", orderNumber: "PO-002SH", title: "Ceramic Tiles - Guangzhou", productName: "Keyboard / Tiles" }, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t5", title: "Send payment proof to Guangzhou supplier", status: "PLANNED", priority: "MEDIUM", module: "IMPORT_PURCHASE", dueDate: new Date(), dueTime: "16:00", orderId: "o1", order: { id: "o1", orderNumber: "PO-001DF", title: "LED Lights from Shenzhen", productName: "Cabinet / LED Lights" }, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t6", title: "Arrange inspection for Shenzhen order", status: "PLANNED", priority: "CRITICAL", module: "IMPORT_PURCHASE", dueDate: new Date(Date.now() - 2 * 86400000), orderId: "o1", order: { id: "o1", orderNumber: "PO-001DF", title: "LED Lights from Shenzhen", productName: "Cabinet / LED Lights" }, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t7", title: "Confirm domestic PO delivery date", status: "PLANNED", priority: "HIGH", module: "IMPORT_PURCHASE", dueDate: new Date(Date.now() - 86400000), orderId: "o3", order: { id: "o3", orderNumber: "PO-003GZ", title: "Plywood - Domestic", productName: "Mouse / Hardware" }, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t9", title: "Waiting for supplier PI from Ningbo", status: "WAITING", priority: "MEDIUM", module: "IMPORT_PURCHASE", waitingFor: "Zhang Wei", followUpDate: new Date(Date.now() + 2 * 86400000), orderId: "o1", order: { id: "o1", orderNumber: "PO-001DF", title: "LED Lights from Shenzhen", productName: "Cabinet / LED Lights" }, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t10", title: "Waiting for customs clearance docs", status: "WAITING", priority: "HIGH", module: "IMPORT_PURCHASE", waitingFor: "CHA Agent", followUpDate: new Date(Date.now() + 3 * 86400000), orderId: "o2", order: { id: "o2", orderNumber: "PO-002SH", title: "Ceramic Tiles - Guangzhou", productName: "Keyboard / Tiles" }, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t11", title: "Waiting for customer PO confirmation", status: "WAITING", priority: "MEDIUM", module: "SALES", waitingFor: "Rahul Mehta", followUpDate: new Date(Date.now() + 4 * 86400000), createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t12", title: "Update product catalog pricing", status: "COMPLETED", priority: "LOW", module: "TASK", completedAt: new Date(Date.now() - 86400000), createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "t13", title: "File customs duty payment receipt", status: "COMPLETED", priority: "MEDIUM", module: "IMPORT_PURCHASE", completedAt: new Date(Date.now() - 86400000), orderId: "o1", order: { id: "o1", orderNumber: "PO-001DF", title: "LED Lights from Shenzhen", productName: "Cabinet / LED Lights" }, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
  ],

  orders: [
    { id: "o1", orderNumber: "ORD-2026-001", type: "CHINA_IMPORT", status: "ACTIVE", title: "LED Lights from Shenzhen", supplierId: "s1", currency: "USD", currentStage: "PRODUCTION", stageProgress: 45, dueDate: new Date("2026-09-15"), createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "o2", orderNumber: "ORD-2026-002", type: "CHINA_IMPORT", status: "ACTIVE", title: "Ceramic Tiles - Guangzhou", supplierId: "s2", currency: "USD", currentStage: "CUSTOMS_DOCUMENTS", stageProgress: 78, dueDate: new Date("2026-08-25"), createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "o3", orderNumber: "ORD-2026-003", type: "DOMESTIC_PURCHASE", status: "ACTIVE", title: "Plywood - Domestic", supplierId: "s3", currency: "INR", currentStage: "DISPATCH", stageProgress: 65, dueDate: new Date("2026-08-20"), createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "o4", orderNumber: "ORD-2026-004", type: "CHINA_IMPORT", status: "ACTIVE", title: "Aluminum Profiles - Foshan", supplierId: "s4", currency: "USD", currentStage: "ETD", stageProgress: 55, dueDate: new Date("2026-09-01"), createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "o5", orderNumber: "ORD-2026-005", type: "CHINA_IMPORT", status: "COMPLETED", title: "Ceramic Tiles - Jaipur", supplierId: "s5", currency: "INR", currentStage: "DELIVERY_GRN", stageProgress: 100, dueDate: new Date("2026-08-01"), createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
  ],

  suppliers: [
    { id: "s1", name: "Shenzhen Tech Co.", country: "China", city: "Shenzhen", performanceScore: 92, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "s2", name: "Guangzhou Ceramics Ltd.", country: "China", city: "Guangzhou", performanceScore: 88, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "s3", name: "Kerala Wood Industries", country: "India", city: "Kochi", performanceScore: 85, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "s4", name: "Foshan Aluminum Co.", country: "China", city: "Foshan", performanceScore: 78, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "s5", name: "Jaipur Ceramics Pvt Ltd", country: "India", city: "Jaipur", performanceScore: 90, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
  ],

  products: [
    { id: "p1", sku: "LED-001", name: "LED Panel Light 60x60", brand: "Philips Compatible", hsCode: "9405.42", unit: "pcs", unitCost: 18.5, weight: 2.8, cbm: 0.035, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "p2", sku: "LED-002", name: "LED Downlight 12W", brand: "Generic", hsCode: "9405.42", unit: "pcs", unitCost: 5.2, weight: 0.35, cbm: 0.004, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "p3", sku: "CT-001", name: "Ceramic Wall Tile 30x60", brand: "China Ceramics", hsCode: "6907.21", unit: "sqm", unitCost: 4.8, weight: 15.5, cbm: 0.018, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "p4", sku: "PW-001", name: "Marine Plywood 18mm", brand: "Greenply", hsCode: "4412.31", unit: "sheet", unitCost: 850, weight: 32, cbm: 0.043, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "p5", sku: "AL-001", name: "Aluminum Profile T6063", brand: "Foshan Alu", hsCode: "7604.10", unit: "meter", unitCost: 3.2, weight: 0.85, cbm: 0.001, createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
  ],

  salesOrders: [
    { id: "so1", customerName: "ABC Corporation", customerContact: "Rahul Mehta", enquiry: "LED lighting for new office building", status: "QUOTATION_SENT", followUpDate: new Date("2026-08-22"), amount: 450000, currency: "INR", createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "so2", customerName: "XYZ Interiors", customerContact: "Priya Patel", enquiry: "Ceramic tiles for 50 apartments", status: "FOLLOW_UP", followUpDate: new Date("2026-08-25"), amount: 1200000, currency: "INR", createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "so3", customerName: "DEF Builders", customerContact: "Amit Singh", enquiry: "Aluminum profiles for windows", status: "ENQUIRY", amount: 280000, currency: "INR", createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
  ],

  serviceTickets: [
    { id: "st1", customerName: "ABC Corporation", complaint: "LED panel not working in Conference Room", status: "IN_PROGRESS", priority: "HIGH", engineer: "Ravi Kumar", visitDate: new Date("2026-08-20"), createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "st2", customerName: "XYZ Interiors", complaint: "Ceramic tile crack in lobby area", status: "VISIT_SCHEDULED", priority: "MEDIUM", engineer: "Amit Sharma", visitDate: new Date("2026-08-22"), createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
    { id: "st3", customerName: "DEF Builders", complaint: "Aluminum frame alignment issue", status: "OPEN", priority: "CRITICAL", createdAt: new Date(), updatedAt: new Date(), userId: "user-1" },
  ],

  notifications: [],
  documents: [],
  payments: [],
  shipments: [],
  landedCosts: [],
};
