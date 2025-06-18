
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Milk, Users, Calculator, FileText, TrendingUp } from 'lucide-react';
import FarmerManagement from '@/components/FarmerManagement';
import ProductionEntry from '@/components/ProductionEntry';
import BillingReports from '@/components/BillingReports';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Milk className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Dairy Management System</h1>
          </div>
          <p className="text-lg text-gray-600">Track milk production and manage farmer payments efficiently</p>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="farmers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Farmers
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Milk className="h-4 w-4" />
              Production
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="farmers" className="space-y-6">
            <FarmerManagement />
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <ProductionEntry />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <BillingReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
