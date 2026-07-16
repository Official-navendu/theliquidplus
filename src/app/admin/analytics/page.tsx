'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminLayoutPrimitives';
import { AdminChartCard } from '@/components/admin/DashboardWidgets';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Store Analytics & Reports"
        description="Inspect sales performance charts, page visits allocation, and visitor checkout logs."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChartCard
          title="Conversion Rates By Product"
          description="Purchase conversions from visits metrics"
        />
        <AdminChartCard
          title="Daily Checkout Funnel"
          description="Cart additions to payment completions flow"
        />
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
