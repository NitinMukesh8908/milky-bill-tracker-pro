
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Milk, Plus, Calendar } from 'lucide-react';
import { useDairyData } from '@/hooks/useDairyData';
import { toast } from 'sonner';

const ProductionEntry = () => {
  const { farmers, productions, addProduction } = useDairyData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    farmerId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    pricePerLiter: 30
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.farmerId || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedFarmer = farmers.find(f => f.id === formData.farmerId);
    const productionData = {
      ...formData,
      quantity: parseFloat(formData.quantity),
      pricePerLiter: selectedFarmer?.pricePerLiter || formData.pricePerLiter
    };

    addProduction(productionData);
    toast.success('Production entry added successfully');
    setFormData({
      farmerId: '',
      quantity: '',
      date: new Date().toISOString().split('T')[0],
      pricePerLiter: 30
    });
    setIsAddDialogOpen(false);
  };

  const handleFarmerChange = (farmerId) => {
    const selectedFarmer = farmers.find(f => f.id === farmerId);
    setFormData({
      ...formData,
      farmerId,
      pricePerLiter: selectedFarmer?.pricePerLiter || 30
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Milk className="h-5 w-5" />
                Milk Production Entry
              </CardTitle>
              <CardDescription>Record daily milk production from farmers</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" disabled={farmers.length === 0}>
                  <Plus className="h-4 w-4" />
                  Add Production
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Production Entry</DialogTitle>
                  <DialogDescription>Record milk production for a specific farmer</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="farmer">Select Farmer</Label>
                    <Select value={formData.farmerId} onValueChange={handleFarmerChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a farmer" />
                      </SelectTrigger>
                      <SelectContent>
                        {farmers.map((farmer) => (
                          <SelectItem key={farmer.id} value={farmer.id}>
                            {farmer.name} - ₹{farmer.pricePerLiter}/L
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity (Liters)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      placeholder="Enter milk quantity"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price per Liter (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.50"
                      value={formData.pricePerLiter}
                      onChange={(e) => setFormData({...formData, pricePerLiter: parseFloat(e.target.value)})}
                      placeholder="30.00"
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Production Entry</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {farmers.length === 0 ? (
            <div className="text-center py-8">
              <Milk className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Please add farmers first before recording production.</p>
            </div>
          ) : productions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No production entries yet. Start recording daily milk production.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Quantity (L)</TableHead>
                  <TableHead>Price/L</TableHead>
                  <TableHead>Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productions.map((production) => {
                  const farmer = farmers.find(f => f.id === production.farmerId);
                  const totalAmount = production.quantity * production.pricePerLiter;
                  return (
                    <TableRow key={production.id}>
                      <TableCell>{production.date}</TableCell>
                      <TableCell className="font-medium">{farmer?.name || 'Unknown'}</TableCell>
                      <TableCell>{production.quantity} L</TableCell>
                      <TableCell>₹{production.pricePerLiter}</TableCell>
                      <TableCell className="font-semibold">₹{totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionEntry;
