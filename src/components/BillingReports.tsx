
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Download, FileText, Calendar } from 'lucide-react';
import { useDairyData } from '@/hooks/useDairyData';

const BillingReports = () => {
  const { farmers, productions, getBillingData } = useDairyData();
  const [selectedFarmer, setSelectedFarmer] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  const billingData = getBillingData(selectedFarmer, selectedPeriod);

  const generateReport = () => {
    const reportData = {
      period: selectedPeriod,
      farmer: selectedFarmer === 'all' ? 'All Farmers' : farmers.find(f => f.id === selectedFarmer)?.name,
      data: billingData,
      generatedAt: new Date().toLocaleString()
    };
    
    console.log('Generated Report:', reportData);
    // In a real app, this would generate a PDF or export to Excel
    alert(`Report generated for ${reportData.farmer} - ${selectedPeriod} period`);
  };

  const getTotalAmount = () => {
    return billingData.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  const getTotalQuantity = () => {
    return billingData.reduce((sum, item) => sum + item.totalQuantity, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Billing & Reports
          </CardTitle>
          <CardDescription>Generate billing reports for different time periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Farmer</label>
              <Select value={selectedFarmer} onValueChange={setSelectedFarmer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose farmer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Farmers</SelectItem>
                  {farmers.map((farmer) => (
                    <SelectItem key={farmer.id} value={farmer.id}>
                      {farmer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Billing Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly (15 days)</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={generateReport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Total Quantity</p>
                    <p className="text-2xl font-bold text-blue-900">{getTotalQuantity().toFixed(1)} L</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-900">₹{getTotalAmount().toFixed(2)}</p>
                  </div>
                  <Calculator className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">Avg Price/L</p>
                    <p className="text-2xl font-bold text-purple-900">
                      ₹{getTotalQuantity() > 0 ? (getTotalAmount() / getTotalQuantity()).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Table */}
          {billingData.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No billing data available for the selected period.</p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Billing Report
                </CardTitle>
                <CardDescription>
                  {selectedFarmer === 'all' ? 'All Farmers' : farmers.find(f => f.id === selectedFarmer)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Total Quantity (L)</TableHead>
                      <TableHead>Avg Price/L</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Entries</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.farmerName}</TableCell>
                        <TableCell>{item.totalQuantity.toFixed(1)} L</TableCell>
                        <TableCell>₹{(item.totalAmount / item.totalQuantity).toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">₹{item.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{item.entries}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 border-gray-300 font-semibold bg-gray-50">
                      <TableCell>TOTAL</TableCell>
                      <TableCell>{getTotalQuantity().toFixed(1)} L</TableCell>
                      <TableCell>
                        ₹{getTotalQuantity() > 0 ? (getTotalAmount() / getTotalQuantity()).toFixed(2) : '0.00'}
                      </TableCell>
                      <TableCell>₹{getTotalAmount().toFixed(2)}</TableCell>
                      <TableCell>{billingData.reduce((sum, item) => sum + item.entries, 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingReports;
