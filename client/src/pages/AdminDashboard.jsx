import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, ShoppingCart, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalCarts: 0, totalRevenue: 0 });

  useEffect(() => {
    // In a real app, you'd fetch these from a /api/admin/stats endpoint
    // For now, we'll just fetch product count as a mock
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({
          totalProducts: res.data.products.length, // Simplified
          totalCarts: 24, // Mock
          totalRevenue: 1543.50 // Mock
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Carts', value: stats.totalCarts, icon: ShoppingCart, color: 'bg-green-500' },
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
              <div className={`${stat.color} p-4 rounded-lg text-white shadow-md`}>
                <Icon size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-bold text-dark">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
         <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
         <p className="text-gray-500 italic">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
