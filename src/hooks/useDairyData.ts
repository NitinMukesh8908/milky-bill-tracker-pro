
import { useState, useEffect } from 'react';

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  address: string;
  pricePerLiter: number;
  createdAt: string;
}

export interface Production {
  id: string;
  farmerId: string;
  quantity: number;
  date: string;
  pricePerLiter: number;
  createdAt: string;
}

export interface BillingData {
  farmerName: string;
  farmerId: string;
  totalQuantity: number;
  totalAmount: number;
  entries: number;
}

export const useDairyData = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [productions, setProductions] = useState<Production[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFarmers = localStorage.getItem('dairy-farmers');
    const savedProductions = localStorage.getItem('dairy-productions');
    
    if (savedFarmers) {
      setFarmers(JSON.parse(savedFarmers));
    }
    
    if (savedProductions) {
      setProductions(JSON.parse(savedProductions));
    }
  }, []);

  // Save farmers to localStorage whenever farmers change
  useEffect(() => {
    localStorage.setItem('dairy-farmers', JSON.stringify(farmers));
  }, [farmers]);

  // Save productions to localStorage whenever productions change
  useEffect(() => {
    localStorage.setItem('dairy-productions', JSON.stringify(productions));
  }, [productions]);

  const addFarmer = (farmerData: Omit<Farmer, 'id' | 'createdAt'>) => {
    const newFarmer: Farmer = {
      ...farmerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setFarmers(prev => [...prev, newFarmer]);
  };

  const updateFarmer = (id: string, farmerData: Omit<Farmer, 'id' | 'createdAt'>) => {
    setFarmers(prev => prev.map(farmer => 
      farmer.id === id 
        ? { ...farmer, ...farmerData }
        : farmer
    ));
  };

  const deleteFarmer = (id: string) => {
    setFarmers(prev => prev.filter(farmer => farmer.id !== id));
    // Also remove all productions for this farmer
    setProductions(prev => prev.filter(production => production.farmerId !== id));
  };

  const addProduction = (productionData: Omit<Production, 'id' | 'createdAt'>) => {
    const newProduction: Production = {
      ...productionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProductions(prev => [newProduction, ...prev.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())]);
  };

  const getTotalProduction = () => {
    return productions.reduce((total, production) => total + production.quantity, 0);
  };

  const getTotalFarmers = () => {
    return farmers.length;
  };

  const getWeeklyProduction = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return productions
      .filter(production => new Date(production.date) >= oneWeekAgo)
      .reduce((total, production) => total + production.quantity, 0);
  };

  const getBillingData = (farmerId: string, period: string): BillingData[] => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'biweekly':
        startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    let filteredProductions = productions.filter(
      production => new Date(production.date) >= startDate
    );

    if (farmerId !== 'all') {
      filteredProductions = filteredProductions.filter(
        production => production.farmerId === farmerId
      );
    }

    // Group by farmer
    const farmerGroups = filteredProductions.reduce((groups, production) => {
      const farmer = farmers.find(f => f.id === production.farmerId);
      if (!farmer) return groups;

      if (!groups[production.farmerId]) {
        groups[production.farmerId] = {
          farmerName: farmer.name,
          farmerId: production.farmerId,
          totalQuantity: 0,
          totalAmount: 0,
          entries: 0
        };
      }

      groups[production.farmerId].totalQuantity += production.quantity;
      groups[production.farmerId].totalAmount += production.quantity * production.pricePerLiter;
      groups[production.farmerId].entries += 1;

      return groups;
    }, {} as Record<string, BillingData>);

    return Object.values(farmerGroups);
  };

  return {
    farmers,
    productions,
    addFarmer,
    updateFarmer,
    deleteFarmer,
    addProduction,
    getTotalProduction,
    getTotalFarmers,
    getWeeklyProduction,
    getBillingData
  };
};
