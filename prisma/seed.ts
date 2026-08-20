import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.taskActivity.deleteMany();
  await prisma.landedCostEntry.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.serviceTicket.deleteMany();
  await prisma.user.deleteMany();

  // Create default user
  const user = await prisma.user.create({
    data: {
      email: "user@taskpilot.com",
      name: "User",
      phone: "+91 98765 43210",
      timezone: "Asia/Kolkata",
      currency: "INR",
    },
  });
  console.log("✅ Created user:", user.email);

  // Create suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: "Shenzhen Tech Co.",
      country: "China",
      city: "Shenzhen",
      contacts: [
        { name: "Zhang Wei", phone: "+86 138 1234 5678", email: "zhang@sztech.com", role: "Sales Manager" },
      ],
      paymentTerms: "30% advance, 70% before shipment",
      performanceScore: 92,
      userId: user.id,
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: "Guangzhou Ceramics Ltd.",
      country: "China",
      city: "Guangzhou",
      contacts: [
        { name: "Li Ming", phone: "+86 139 8765 4321", email: "liming@gzceramics.com", role: "Export Manager" },
      ],
      paymentTerms: "LC at sight",
      performanceScore: 88,
      userId: user.id,
    },
  });

  const supplier3 = await prisma.supplier.create({
    data: {
      name: "Kerala Wood Industries",
      country: "India",
      city: "Kochi",
      contacts: [
        { name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@keralawood.com", role: "Owner" },
      ],
      paymentTerms: "Net 30",
      performanceScore: 85,
      userId: user.id,
    },
  });

  const supplier4 = await prisma.supplier.create({
    data: {
      name: "Foshan Aluminum Co.",
      country: "China",
      city: "Foshan",
      contacts: [
        { name: "Chen Fang", phone: "+86 136 1111 2222", email: "chen@foshanalu.com", role: "Sales" },
      ],
      paymentTerms: "30% advance, 70% BL copy",
      performanceScore: 78,
      userId: user.id,
    },
  });

  const supplier5 = await prisma.supplier.create({
    data: {
      name: "Jaipur Ceramics Pvt Ltd",
      country: "India",
      city: "Jaipur",
      contacts: [
        { name: "Amit Sharma", phone: "+91 99887 76655", email: "amit@jaipurceramics.in", role: "Sales Head" },
      ],
      paymentTerms: "Net 15",
      performanceScore: 90,
      userId: user.id,
    },
  });
  console.log("✅ Created 5 suppliers");

  // Create products
  const product1 = await prisma.product.create({
    data: {
      sku: "LED-001",
      name: "LED Panel Light 60x60",
      brand: "Philips Compatible",
      hsCode: "9405.42",
      unit: "pcs",
      unitCost: 18.5,
      weight: 2.8,
      cbm: 0.035,
      defaultSupplierId: supplier1.id,
      userId: user.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      sku: "LED-002",
      name: "LED Downlight 12W",
      brand: "Generic",
      hsCode: "9405.42",
      unit: "pcs",
      unitCost: 5.2,
      weight: 0.35,
      cbm: 0.004,
      defaultSupplierId: supplier1.id,
      userId: user.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      sku: "CT-001",
      name: "Ceramic Wall Tile 30x60",
      brand: "China Ceramics",
      hsCode: "6907.21",
      unit: "sqm",
      unitCost: 4.8,
      weight: 15.5,
      cbm: 0.018,
      defaultSupplierId: supplier2.id,
      userId: user.id,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      sku: "PW-001",
      name: "Marine Plywood 18mm",
      brand: "Greenply",
      hsCode: "4412.31",
      unit: "sheet",
      unitCost: 850,
      weight: 32,
      cbm: 0.043,
      defaultSupplierId: supplier3.id,
      userId: user.id,
    },
  });

  const product5 = await prisma.product.create({
    data: {
      sku: "AL-001",
      name: "Aluminum Profile T6063",
      brand: "Foshan Alu",
      hsCode: "7604.10",
      unit: "meter",
      unitCost: 3.2,
      weight: 0.85,
      cbm: 0.001,
      defaultSupplierId: supplier4.id,
      userId: user.id,
    },
  });
  console.log("✅ Created 5 products");

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-001",
      type: "CHINA_IMPORT",
      status: "ACTIVE",
      title: "LED Lights from Shenzhen",
      description: "Urgent order for Diwali season stock",
      supplierId: supplier1.id,
      currency: "USD",
      exchangeRate: 83.5,
      piRef: "PI-2026-0892",
      poRef: "PO-2026-001",
      paymentTerms: "30% advance, 70% before shipment",
      chinaStage: "PRODUCTION",
      currentStage: "PRODUCTION",
      stageProgress: 45,
      dueDate: new Date("2026-09-15"),
      userId: user.id,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-002",
      type: "CHINA_IMPORT",
      status: "ACTIVE",
      title: "Ceramic Tiles - Guangzhou",
      supplierId: supplier2.id,
      currency: "USD",
      exchangeRate: 83.5,
      piRef: "PI-2026-0893",
      poRef: "PO-2026-002",
      paymentTerms: "LC at sight",
      chinaStage: "CUSTOMS_DOCUMENTS",
      currentStage: "CUSTOMS_DOCUMENTS",
      stageProgress: 78,
      dueDate: new Date("2026-08-25"),
      userId: user.id,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-003",
      type: "DOMESTIC_PURCHASE",
      status: "ACTIVE",
      title: "Plywood - Domestic",
      supplierId: supplier3.id,
      currency: "INR",
      exchangeRate: 1,
      paymentTerms: "Net 30",
      domesticStage: "DISPATCH",
      currentStage: "DISPATCH",
      stageProgress: 65,
      dueDate: new Date("2026-08-20"),
      userId: user.id,
    },
  });

  const order4 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-004",
      type: "CHINA_IMPORT",
      status: "ACTIVE",
      title: "Aluminum Profiles - Foshan",
      supplierId: supplier4.id,
      currency: "USD",
      exchangeRate: 83.5,
      chinaStage: "ETD",
      currentStage: "ETD",
      stageProgress: 55,
      dueDate: new Date("2026-09-01"),
      userId: user.id,
    },
  });

  const order5 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-005",
      type: "DOMESTIC_PURCHASE",
      status: "COMPLETED",
      title: "Sanitary Ware - Domestic",
      supplierId: supplier5.id,
      currency: "INR",
      exchangeRate: 1,
      domesticStage: "GRN",
      currentStage: "GRN",
      stageProgress: 100,
      userId: user.id,
    },
  });
  console.log("✅ Created 5 orders");

  // Create order items
  await prisma.orderItem.createMany({
    data: [
      { orderId: order1.id, productId: product1.id, sku: "LED-001", name: "LED Panel Light 60x60", quantity: 500, unit: "pcs", unitCost: 18.5, totalCost: 9250, hsCode: "9405.42" },
      { orderId: order1.id, productId: product2.id, sku: "LED-002", name: "LED Downlight 12W", quantity: 1000, unit: "pcs", unitCost: 5.2, totalCost: 5200, hsCode: "9405.42" },
      { orderId: order2.id, productId: product3.id, sku: "CT-001", name: "Ceramic Wall Tile 30x60", quantity: 2000, unit: "sqm", unitCost: 4.8, totalCost: 9600, hsCode: "6907.21" },
      { orderId: order3.id, productId: product4.id, sku: "PW-001", name: "Marine Plywood 18mm", quantity: 400, unit: "sheet", unitCost: 850, totalCost: 340000, hsCode: "4412.31" },
      { orderId: order4.id, productId: product5.id, sku: "AL-001", name: "Aluminum Profile T6063", quantity: 5000, unit: "meter", unitCost: 3.2, totalCost: 16000, hsCode: "7604.10" },
    ],
  });
  console.log("✅ Created order items");

  // Create tasks
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  await prisma.task.createMany({
    data: [
      { title: "Follow up with Shenzhen supplier on PI", status: "PLANNED", priority: "HIGH", module: "IMPORT_PURCHASE", dueDate: today, dueTime: "10:00", orderId: order1.id, contactName: "Zhang Wei", userId: user.id },
      { title: "Review packing list for Mumbai order", status: "IN_PROGRESS", priority: "CRITICAL", module: "IMPORT_PURCHASE", dueDate: today, dueTime: "11:00", orderId: order2.id, contactName: "Li Ming", userId: user.id },
      { title: "Call customer about quotation", status: "PLANNED", priority: "MEDIUM", module: "SALES", dueDate: today, dueTime: "14:00", contactName: "Rahul Mehta", userId: user.id },
      { title: "Confirm CHA documents for BL release", status: "PLANNED", priority: "HIGH", module: "IMPORT_PURCHASE", dueDate: today, dueTime: "15:00", orderId: order2.id, userId: user.id },
      { title: "Send payment proof to Guangzhou supplier", status: "PLANNED", priority: "MEDIUM", module: "IMPORT_PURCHASE", dueDate: today, dueTime: "16:00", contactName: "Chen Fang", userId: user.id },
      { title: "Arrange inspection for Shenzhen order", status: "PLANNED", priority: "CRITICAL", module: "IMPORT_PURCHASE", dueDate: twoDaysAgo, orderId: order1.id, userId: user.id },
      { title: "Confirm domestic PO delivery date", status: "WAITING", priority: "HIGH", module: "IMPORT_PURCHASE", dueDate: yesterday, waitingFor: "Supplier confirmation", followUpDate: nextWeek, orderId: order3.id, userId: user.id },
      { title: "Send revised quotation to ABC Corp", status: "WAITING", priority: "MEDIUM", module: "SALES", dueDate: twoDaysAgo, waitingFor: "Customer confirmation", followUpDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), userId: user.id },
      { title: "Book shipping container for LED order", status: "PLANNED", priority: "HIGH", module: "IMPORT_PURCHASE", dueDate: tomorrow, orderId: order1.id, userId: user.id },
      { title: "Prepare customs documents for tiles", status: "WAITING", priority: "MEDIUM", module: "IMPORT_PURCHASE", dueDate: tomorrow, waitingFor: "Supplier PI", followUpDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), orderId: order2.id, userId: user.id },
      { title: "Confirm Plywood delivery to warehouse", status: "PLANNED", priority: "HIGH", module: "IMPORT_PURCHASE", dueDate: tomorrow, orderId: order3.id, userId: user.id },
      { title: "Follow-up with Rahul Mehta", status: "WAITING", priority: "MEDIUM", module: "SALES", dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), waitingFor: "Customer PO", followUpDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), userId: user.id },
    ],
  });
  console.log("✅ Created 12 tasks");

  // Create sales orders
  await prisma.salesOrder.createMany({
    data: [
      { customerName: "ABC Corporation", customerContact: "Rahul Mehta", enquiry: "LED lighting for new office building", status: "QUOTATION_SENT", followUpDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), amount: 450000, currency: "INR", userId: user.id },
      { customerName: "XYZ Interiors", customerContact: "Priya Patel", enquiry: "Ceramic tiles for 50 apartments", status: "FOLLOW_UP", followUpDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000), amount: 1200000, currency: "INR", userId: user.id },
      { customerName: "DEF Builders", customerContact: "Amit Singh", enquiry: "Aluminum profiles for windows", status: "ENQUIRY", amount: 280000, currency: "INR", userId: user.id },
    ],
  });
  console.log("✅ Created 3 sales orders");

  // Create service tickets
  await prisma.serviceTicket.createMany({
    data: [
      { customerName: "ABC Corporation", complaint: "LED panel not working in Conference Room", status: "IN_PROGRESS", priority: "HIGH", engineer: "Ravi Kumar", visitDate: tomorrow, userId: user.id },
      { customerName: "XYZ Interiors", complaint: "Ceramic tile crack in lobby area", status: "VISIT_SCHEDULED", priority: "MEDIUM", engineer: "Amit Sharma", visitDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), userId: user.id },
      { customerName: "DEF Builders", complaint: "Aluminum frame alignment issue", status: "OPEN", priority: "CRITICAL", userId: user.id },
    ],
  });
  console.log("✅ Created 3 service tickets");

  // Create shipments
  await prisma.shipment.createMany({
    data: [
      { orderId: order1.id, shippingMode: "Sea FCL", containerNo: "MSKU1234567", bookingDate: new Date("2026-08-10"), etd: new Date("2026-08-20"), eta: new Date("2026-09-05"), blAwbNumber: "MSKU1234567", portOfLoading: "Shenzhen", portOfDestination: "Mumbai", status: "BOOKED", userId: user.id },
      { orderId: order2.id, shippingMode: "Sea LCL", blAwbNumber: "COSU7654321", portOfLoading: "Guangzhou", portOfDestination: "Mumbai", status: "IN_TRANSIT", userId: user.id },
    ],
  });
  console.log("✅ Created 2 shipments");

  console.log("\n🎉 Seeding complete!");
  console.log(`   User: ${user.email}`);
  console.log(`   Suppliers: 5`);
  console.log(`   Products: 5`);
  console.log(`   Orders: 5`);
  console.log(`   Tasks: 12`);
  console.log(`   Sales Orders: 3`);
  console.log(`   Service Tickets: 3`);
  console.log(`   Shipments: 2`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
