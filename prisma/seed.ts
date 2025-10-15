import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Clean existing data
  await prisma.taxReport.deleteMany();
  await prisma.accountPlan.deleteMany();
  await prisma.accountingEntry.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.userCompany.deleteMany();
  await prisma.company.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const demoUser = await prisma.user.create({
    data: {
      name: 'Usuario Demo',
      email: 'demo@example.com',
      password: await hash('demo123', 12),
      provider: 'CREDENTIALS',
      role: 'USER',
      locale: 'es-ES',
      currency: 'EUR',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin Demo',
      email: 'admin@example.com',
      password: await hash('admin123', 12),
      provider: 'CREDENTIALS',
      role: 'ADMIN',
      locale: 'es-ES',
      currency: 'EUR',
    },
  });

  console.log('✅ Usuarios creados');

  // Create demo companies
  const demoCompany = await prisma.company.create({
    data: {
      name: 'Empresa Demo S.L.',
      cif: 'B12345678',
      address: 'Calle Mayor 123',
      city: 'Madrid',
      postalCode: '28001',
      country: 'ES',
      phone: '+34 91 123 45 67',
      email: 'info@empresademo.es',
      website: 'https://empresademo.es',
      fiscalYearStart: '01-01',
    },
  });

  const adminCompany = await prisma.company.create({
    data: {
      name: 'Admin Corp S.A.',
      cif: 'A87654321',
      address: 'Avenida de la Paz 456',
      city: 'Barcelona',
      postalCode: '08001',
      country: 'ES',
      phone: '+34 93 987 65 43',
      email: 'admin@admincorp.es',
      website: 'https://admincorp.es',
      fiscalYearStart: '01-01',
    },
  });

  // Create user-company relationships
  await prisma.userCompany.create({
    data: {
      userId: demoUser.id,
      companyId: demoCompany.id,
      role: 'ADMIN',
    },
  });

  await prisma.userCompany.create({
    data: {
      userId: adminUser.id,
      companyId: adminCompany.id,
      role: 'ADMIN',
    },
  });

  await prisma.userCompany.create({
    data: {
      userId: adminUser.id,
      companyId: demoCompany.id,
      role: 'ACCOUNTANT',
    },
  });

  console.log('✅ Empresas y relaciones creadas');

  // Create categories
  const incomeCategories = [
    { name: 'Nómina', color: '#10B981' },
    { name: 'Freelance', color: '#3B82F6' },
    { name: 'Inversiones', color: '#8B5CF6' },
    { name: 'Ventas', color: '#F59E0B' },
    { name: 'Otros Ingresos', color: '#06B6D4' },
  ];

  const expenseCategories = [
    { name: 'Supermercado', color: '#EF4444' },
    { name: 'Transporte', color: '#F97316' },
    { name: 'Ocio', color: '#EC4899' },
    { name: 'Servicios', color: '#84CC16' },
    { name: 'Salud', color: '#6366F1' },
    { name: 'Educación', color: '#14B8A6' },
    { name: 'Ropa', color: '#F43F5E' },
    { name: 'Hogar', color: '#8B5CF6' },
    { name: 'Restaurantes', color: '#F59E0B' },
    { name: 'Otros Gastos', color: '#6B7280' },
  ];

  const categories = [];

  // Create income categories
  for (const category of incomeCategories) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        type: 'INCOME',
        color: category.color,
        userId: demoUser.id,
      },
    });
    categories.push(created);
  }

  // Create expense categories
  for (const category of expenseCategories) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        type: 'EXPENSE',
        color: category.color,
        userId: demoUser.id,
      },
    });
    categories.push(created);
  }

  console.log('✅ Categorías creadas');

  // Create transactions for the last 12 months
  const now = new Date();
  const transactions = [];

  for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

    // Income transactions (1-3 per month)
    const incomeCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < incomeCount; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const incomeCategory = categories.find(c => c.type === 'INCOME');
      const amount = incomeCategory?.name === 'Nómina' ? 2500 : Math.floor(Math.random() * 1000) + 200;

      transactions.push({
        userId: demoUser.id,
        categoryId: incomeCategory?.id || categories[0].id,
        amount,
        type: 'INCOME',
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
        description: generateIncomeDescription(incomeCategory?.name || 'Ingreso'),
        paymentMethod: 'TRANSFER',
        tags: generateTags('income').join(','),
      });
    }

    // Expense transactions (15-30 per month)
    const expenseCount = Math.floor(Math.random() * 16) + 15;
    for (let i = 0; i < expenseCount; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const expenseCategory = categories.find(c => c.type === 'EXPENSE');
      const amount = Math.floor(Math.random() * 200) + 10;

      transactions.push({
        userId: demoUser.id,
        categoryId: expenseCategory?.id || categories[5].id,
        amount,
        type: 'EXPENSE',
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
        description: generateExpenseDescription(expenseCategory?.name || 'Gasto'),
        paymentMethod: getRandomPaymentMethod(),
        tags: generateTags('expense').join(','),
      });
    }
  }

  // Insert transactions in batches
  const batchSize = 100;
  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);
    await prisma.transaction.createMany({
      data: batch,
    });
  }

  console.log('✅ Transacciones creadas');

  // Create budgets
  const currentMonth = new Date();
  const budgetCategories = categories.filter(c => c.type === 'EXPENSE').slice(0, 5);

  for (const category of budgetCategories) {
    await prisma.budget.create({
      data: {
        userId: demoUser.id,
        categoryId: category.id,
        period: 'MONTHLY',
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
        amount: Math.floor(Math.random() * 500) + 100,
      },
    });
  }

  console.log('✅ Presupuestos creados');

  // Create goals
  await prisma.goal.create({
    data: {
      userId: demoUser.id,
      name: 'Vacaciones de verano',
      targetAmount: 2000,
      currentAmount: 1200,
      deadline: new Date(currentMonth.getFullYear(), 5, 30), // June 30th
    },
  });

  await prisma.goal.create({
    data: {
      userId: demoUser.id,
      name: 'Fondo de emergencia',
      targetAmount: 5000,
      currentAmount: 3200,
      deadline: new Date(currentMonth.getFullYear() + 1, 11, 31), // End of next year
    },
  });

  console.log('✅ Objetivos creados');

  // Create PGC Spain Account Plans for demo company
  const pgcAccounts = [
    // Activo
    { code: '100', name: 'Capital social', type: 'EQUITY', level: 1 },
    { code: '200', name: 'Inmovilizado intangible', type: 'ASSET', level: 1 },
    { code: '210', name: 'Aplicaciones informáticas', type: 'ASSET', level: 2, parentCode: '200' },
    { code: '300', name: 'Inmovilizado material', type: 'ASSET', level: 1 },
    { code: '400', name: 'Acreedores y deudores por operaciones comerciales', type: 'LIABILITY', level: 1 },
    { code: '430', name: 'Clientes', type: 'ASSET', level: 2, parentCode: '400' },
    { code: '500', name: 'Acreedores y deudores por operaciones no comerciales', type: 'LIABILITY', level: 1 },
    { code: '570', name: 'Caja, euros', type: 'ASSET', level: 2, parentCode: '500' },
    { code: '572', name: 'Bancos c/c', type: 'ASSET', level: 2, parentCode: '500' },
    { code: '600', name: 'Compras y gastos', type: 'EXPENSE', level: 1 },
    { code: '700', name: 'Ventas e ingresos', type: 'INCOME', level: 1 },
    { code: '7000', name: 'Ventas de mercaderías', type: 'INCOME', level: 2, parentCode: '700' },
    { code: '7050', name: 'Devoluciones de ventas', type: 'INCOME', level: 2, parentCode: '700' },
    { code: '477', name: 'H.P. IVA repercutido', type: 'LIABILITY', level: 2, parentCode: '400' },
    { code: '472', name: 'H.P. IVA soportado', type: 'ASSET', level: 2, parentCode: '400' },
  ];

  for (const account of pgcAccounts) {
    const parentId = account.parentCode 
      ? await prisma.accountPlan.findFirst({
          where: { companyId: demoCompany.id, code: account.parentCode }
        }).then(p => p?.id)
      : null;

    await prisma.accountPlan.create({
      data: {
        companyId: demoCompany.id,
        code: account.code,
        name: account.name,
        type: account.type,
        level: account.level,
        parentId: parentId,
        isActive: true,
      },
    });
  }

  // Create sample invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      companyId: demoCompany.id,
      number: '001',
      series: 'A',
      customerName: 'Cliente Demo S.L.',
      customerNIF: 'B98765432',
      customerAddress: 'Calle Cliente 456, Madrid',
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      subtotal: 1000.00,
      taxRate: 21.0,
      taxAmount: 210.00,
      total: 1210.00,
      status: 'ISSUED',
      notes: 'Factura de servicios de consultoría',
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      companyId: demoCompany.id,
      number: '002',
      series: 'A',
      customerName: 'Empresa Cliente S.A.',
      customerNIF: 'A12345678',
      customerAddress: 'Avenida Cliente 789, Barcelona',
      date: new Date(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      subtotal: 2500.00,
      taxRate: 21.0,
      taxAmount: 525.00,
      total: 3025.00,
      status: 'DRAFT',
      notes: 'Factura de desarrollo de software',
    },
  });

  // Create accounting entries for invoices
  await prisma.accountingEntry.create({
    data: {
      companyId: demoCompany.id,
      date: invoice1.date,
      description: `Factura ${invoice1.series}-${invoice1.number} a ${invoice1.customerName}`,
      debitAccount: '430', // Clientes
      creditAccount: '7000', // Ventas
      amount: invoice1.subtotal,
      reference: invoice1.id,
    },
  });

  await prisma.accountingEntry.create({
    data: {
      companyId: demoCompany.id,
      date: invoice1.date,
      description: `IVA repercutido Factura ${invoice1.series}-${invoice1.number}`,
      debitAccount: '430', // Clientes
      creditAccount: '477', // H.P. IVA repercutido
      amount: invoice1.taxAmount,
      reference: invoice1.id,
    },
  });

  console.log('✅ Plan de cuentas PGC y facturas demo creados');

  console.log('🎉 Seed completado exitosamente!');
  console.log('\n📋 Usuarios de prueba:');
  console.log('👤 Usuario Demo: demo@example.com / demo123');
  console.log('👑 Admin Demo: admin@example.com / admin123');
  console.log('\n🏢 Empresas demo:');
  console.log('🏪 Empresa Demo S.L. (CIF: B12345678)');
  console.log('🏢 Admin Corp S.A. (CIF: A87654321)');
}

function generateIncomeDescription(category: string): string {
  const descriptions: Record<string, string[]> = {
    'Nómina': ['Salario mensual', 'Pago de nómina', 'Sueldo'],
    'Freelance': ['Proyecto web', 'Consultoría', 'Diseño gráfico', 'Desarrollo app'],
    'Inversiones': ['Dividendos', 'Intereses', 'Ganancias de capital'],
    'Ventas': ['Venta de producto', 'Venta de servicio', 'Comisión'],
    'Otros Ingresos': ['Reembolso', 'Regalo', 'Premio'],
  };

  const options = descriptions[category] || ['Ingreso'];
  return options[Math.floor(Math.random() * options.length)];
}

function generateExpenseDescription(category: string): string {
  const descriptions: Record<string, string[]> = {
    'Supermercado': ['Compra semanal', 'Mercado', 'Alimentación'],
    'Transporte': ['Gasolina', 'Metro', 'Taxi', 'Autobús', 'Parking'],
    'Ocio': ['Cine', 'Concierto', 'Videojuegos', 'Streaming'],
    'Servicios': ['Luz', 'Agua', 'Internet', 'Teléfono'],
    'Salud': ['Farmacia', 'Médico', 'Dentista', 'Gimnasio'],
    'Educación': ['Libros', 'Curso online', 'Material escolar'],
    'Ropa': ['Camisa', 'Pantalones', 'Zapatos', 'Accesorios'],
    'Hogar': ['Muebles', 'Decoración', 'Electrodomésticos'],
    'Restaurantes': ['Cena', 'Almuerzo', 'Café', 'Delivery'],
    'Otros Gastos': ['Gasto varios', 'Compra imprevista'],
  };

  const options = descriptions[category] || ['Gasto'];
  return options[Math.floor(Math.random() * options.length)];
}

function generateTags(type: 'income' | 'expense'): string[] {
  const incomeTags = ['trabajo', 'negocio', 'inversión'];
  const expenseTags = ['necesario', 'opcional', 'urgente', 'planificado'];
  
  const tags = type === 'income' ? incomeTags : expenseTags;
  const numTags = Math.floor(Math.random() * 2) + 1;
  
  return tags
    .sort(() => 0.5 - Math.random())
    .slice(0, numTags);
}

function getRandomPaymentMethod(): string {
  const methods = ['CARD', 'CASH', 'TRANSFER', 'OTHER'];
  return methods[Math.floor(Math.random() * methods.length)];
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
