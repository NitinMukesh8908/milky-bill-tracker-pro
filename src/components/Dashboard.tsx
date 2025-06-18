
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Milk, Users, TrendingUp, DollarSign } from 'lucide-react';
import { useDairyData } from '@/hooks/useDairyData';

const Dashboard = () => {
  const { farmers, productions, getTotalProduction, getTotalFarmers, getWeeklyProduction } = useDairyData();

  const totalProduction = getTotalProduction();
  const totalFarmers = getTotalFarmers();
  const weeklyProduction = getWeeklyProduction();
  const avgDailyProduction = weeklyProduction / 7;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Farmers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalFarmers}</div>
            <p className="text-xs text-blue-600 mt-1">Active farmers registered</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Production</CardTitle>
            <Milk className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{totalProduction.toFixed(1)} L</div>
            <p className="text-xs text-green-600 mt-1">All-time production</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Weekly Production</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{weeklyProduction.toFixed(1)} L</div>
            <p className="text-xs text-purple-600 mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{avgDailyProduction.toFixed(1)} L</div>
            <p className="text-xs text-orange-600 mt-1">Per day this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Productions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Milk className="h-5 w-5" />
            Recent Production Entries
          </CardTitle>
          <CardDescription>Latest milk production records</CardDescription>
        </CardHeader>
        <CardContent>
          {productions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No production records yet. Start by adding farmers and recording production.</p>
          ) : (
            <div className="space-y-3">
              {productions.slice(0, 5).map((production) => {
                const farmer = farmers.find(f => f.id === production.farmerId);
                return (
                  <div key={production.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Milk className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{farmer?.name || 'Unknown Farmer'}</p>
                        <p className="text-sm text-gray-500">{production.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{production.quantity} L</p>
                      <p className="text-sm text-gray-500">@ ₹{production.pricePerLiter}/L</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
