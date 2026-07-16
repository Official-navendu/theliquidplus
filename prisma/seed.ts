import { PrismaClient, UserStatus, UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Permissions
  const permissionsData = [
    { name: 'catalog:read', description: 'Read catalog items' },
    { name: 'catalog:write', description: 'Modify catalog items' },
    { name: 'orders:read', description: 'View customer orders' },
    { name: 'orders:write', description: 'Fulfill/modify customer orders' },
    { name: 'settings:read', description: 'Read system settings' },
    { name: 'settings:write', description: 'Modify store configurations' },
    { name: 'system:read', description: 'Access logs and audits' },
  ];

  const permissionsMap: Record<string, { id: string }> = {};
  for (const perm of permissionsData) {
    const created = await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: { name: perm.name, description: perm.description },
    });
    permissionsMap[perm.name] = created;
  }
  console.log(`✓ Seeded ${permissionsData.length} Permissions.`);

  // 2. Seed Roles
  const rolesData = [
    { name: 'SUPER_ADMIN', description: 'Full access to the entire platform' },
    { name: 'ADMIN', description: 'Standard administrative credentials' },
    { name: 'PRODUCT_MANAGER', description: 'Manage catalog, variants, and reviews' },
    { name: 'ORDER_MANAGER', description: 'Manage orders, fulfillment, and shipments' },
    { name: 'SEO_MANAGER', description: 'Manage search metadata and slugs' },
    { name: 'CONTENT_WRITER', description: 'Manage blog posts and static CMS pages' },
    { name: 'CUSTOMER', description: 'Customer access boundary' },
  ];

  const rolesMap: Record<string, { id: string }> = {};
  for (const role of rolesData) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: { name: role.name, description: role.description },
    });
    rolesMap[role.name] = created;
  }
  console.log(`✓ Seeded ${rolesData.length} Roles.`);

  // 3. Link Roles to Permissions (RolePermission)
  const rolePermissionsMappings: Record<string, string[]> = {
    SUPER_ADMIN: ['catalog:read', 'catalog:write', 'orders:read', 'orders:write', 'settings:read', 'settings:write', 'system:read'],
    ADMIN: ['catalog:read', 'catalog:write', 'orders:read', 'orders:write', 'settings:read', 'settings:write'],
    PRODUCT_MANAGER: ['catalog:read', 'catalog:write'],
    ORDER_MANAGER: ['orders:read', 'orders:write'],
    SEO_MANAGER: ['catalog:read'],
    CONTENT_WRITER: [],
    CUSTOMER: ['catalog:read'],
  };

  for (const [roleName, permissionsList] of Object.entries(rolePermissionsMappings)) {
    const roleId = rolesMap[roleName].id;
    for (const permName of permissionsList) {
      const permissionId = permissionsMap[permName].id;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId,
        },
      });
    }
  }
  console.log('✓ Configured Role-Permission mappings.');

  // 4. Seed Initial Super Admin User
  const passwordHash = await bcrypt.hash('SuperAdminPassword123!', 10);
  const superAdminEmail = 'superadmin@theliquidplus.com';
  
  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: { passwordHash },
    create: {
      email: superAdminEmail,
      passwordHash,
      status: UserStatus.ACTIVE,
      type: UserType.SUPER_ADMIN,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Map user to role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: rolesMap['SUPER_ADMIN'].id,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      roleId: rolesMap['SUPER_ADMIN'].id,
    },
  });

  // Create Profile
  await prisma.customerProfile.upsert({
    where: { userId: superAdmin.id },
    update: {},
    create: {
      userId: superAdmin.id,
      firstName: 'Super',
      lastName: 'Admin',
    },
  });
  console.log(`✓ Seeded Super Admin user account: ${superAdminEmail}`);

  // 5. Seed Default Store Settings
  const defaultSettings = [
    { key: 'fulfillment.return_window_days', value: 15, group: 'fulfillment' },
    { key: 'tax.default_rate_percent', value: 18.00, group: 'tax' },
    { key: 'store.name', value: 'The Liquid Plus', group: 'store' },
    { key: 'store.contact_email', value: 'support@theliquidplus.com', group: 'store' },
  ];

  for (const setting of defaultSettings) {
    await prisma.storeSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, group: setting.group },
      create: { key: setting.key, value: setting.value, group: setting.group },
    });
  }
  console.log('✓ Seeded default Store Settings.');

  // 6. Seed Default Currency Configuration (INR)
  await prisma.currencyConfig.upsert({
    where: { code: 'INR' },
    update: { rate: 1.00, symbol: '₹', isActive: true },
    create: { code: 'INR', symbol: '₹', rate: 1.00, isActive: true },
  });
  console.log('✓ Seeded default Currency (INR).');

  console.log('🌱 Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
