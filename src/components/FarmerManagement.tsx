
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { useDairyData } from '@/hooks/useDairyData';
import { toast } from 'sonner';

const FarmerManagement = () => {
  const { farmers, addFarmer, updateFarmer, deleteFarmer } = useDairyData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pricePerLiter: 30
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Farmer name is required');
      return;
    }

    if (editingFarmer) {
      updateFarmer(editingFarmer.id, formData);
      toast.success('Farmer updated successfully');
      setEditingFarmer(null);
    } else {
      addFarmer(formData);
      toast.success('Farmer added successfully');
      setIsAddDialogOpen(false);
    }

    setFormData({ name: '', phone: '', address: '', pricePerLiter: 30 });
  };

  const handleEdit = (farmer) => {
    setEditingFarmer(farmer);
    setFormData(farmer);
  };

  const handleDelete = (farmerId) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      deleteFarmer(farmerId);
      toast.success('Farmer deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Farmer Management
              </CardTitle>
              <CardDescription>Manage farmer information and pricing</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Farmer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Farmer</DialogTitle>
                  <DialogDescription>Enter farmer details and pricing information</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Farmer Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter farmer name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Enter address"
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
                  <Button type="submit" className="w-full">Add Farmer</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {farmers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No farmers registered yet. Add your first farmer to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Price/Liter</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farmers.map((farmer) => (
                  <TableRow key={farmer.id}>
                    <TableCell className="font-medium">{farmer.name}</TableCell>
                    <TableCell>{farmer.phone || 'N/A'}</TableCell>
                    <TableCell>{farmer.address || 'N/A'}</TableCell>
                    <TableCell>₹{farmer.pricePerLiter}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(farmer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(farmer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingFarmer} onOpenChange={() => setEditingFarmer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Farmer</DialogTitle>
            <DialogDescription>Update farmer details and pricing information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Farmer Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter farmer name"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter address"
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price per Liter (₹)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.50"
                value={formData.pricePerLiter}
                onChange={(e) => setFormData({...formData, pricePerLiter: parseFloat(e.target.value)})}
                placeholder="30.00"
              />
            </div>
            <Button type="submit" className="w-full">Update Farmer</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmerManagement;
