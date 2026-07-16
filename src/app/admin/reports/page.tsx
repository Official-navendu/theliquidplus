'use client';

import * as React from 'react';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';

interface ReportRow {
  id: string;
  name: string;
  generatedAt: string;
  size: string;
}

export default function AdminReportsPage() {
  const reports: ReportRow[] = [
    { id: '1', name: 'Q2 Gross Sales Audit Log', generatedAt: '2026-07-10', size: '1.2 MB' },
    { id: '2', name: 'Low Stock Deficit Timeline', generatedAt: '2026-07-09', size: '420 KB' },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Administrative Audit Reports"
        description="Download financial statements, warehouse audits, and user login logs."
      />
      <AdminCard className="space-y-4">
        <AdminTable<ReportRow>
          columns={[
            { key: 'name', label: 'Report Identifier', sortable: true },
            { key: 'generatedAt', label: 'Compiled Date', sortable: true },
            { key: 'size', label: 'File Size' },
          ]}
          data={reports}
          searchPlaceholder="Search audit sheets..."
        />
      </AdminCard>
    </div>
  );
}
export const dynamic = 'force-dynamic';
