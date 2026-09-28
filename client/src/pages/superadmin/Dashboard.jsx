import React, { useState } from 'react';
import { useSuperAdminStore } from '../../store/superAdminStore';
import { Building2, ShoppingCart, Users, TrendingUp, Download, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend } from 'recharts';

const mockRevenueData = {
  today: [{ name: '8 AM', revenue: 10000 }, { name: '12 PM', revenue: 45000 }, { name: '4 PM', revenue: 30000 }, { name: '8 PM', revenue: 65000 }],
  thisWeek: [{ name: 'Mon', revenue: 150000 }, { name: 'Tue', revenue: 120000 }, { name: 'Wed', revenue: 180000 }, { name: 'Thu', revenue: 140000 }, { name: 'Fri', revenue: 210000 }, { name: 'Sat', revenue: 300000 }, { name: 'Sun', revenue: 320000 }],
  thisMonth: [{ name: 'Week 1', revenue: 800000 }, { name: 'Week 2', revenue: 950000 }, { name: 'Week 3', revenue: 700000 }, { name: 'Week 4', revenue: 1100000 }]
};

const mockActivityData = [
  { name: 'Mon', activeCarts: 120, appDownloads: 45 },
  { name: 'Tue', activeCarts: 98, appDownloads: 30 },
  { name: 'Wed', activeCarts: 140, appDownloads: 65 },
  { name: 'Thu', activeCarts: 110, appDownloads: 40 },
  { name: 'Fri', activeCarts: 180, appDownloads: 85 },
  { name: 'Sat', activeCarts: 250, appDownloads: 120 },
  { name: 'Sun', activeCarts: 280, appDownloads: 150 },
];

const Dashboard = () => {
  const { malls, carts } = useSuperAdminStore();
  const [dateRange, setDateRange] = useState('thisWeek'); // today, thisWeek, thisMonth

  const totalMalls = malls.length;
  const totalCarts = carts.length;
  const activeCarts = carts.filter(c => c.status === 'in-use').length || Math.floor(totalCarts * 0.4); // Mock active ratio
  const totalRevenue = malls.reduce((sum, mall) => sum + mall.totalSales, 0);
  const totalDownloads = 12450; // Mock total registrations

  const statCards = [
    { title: 'Total Revenue', value: `₹${(totalRevenue/100000).toFixed(1)}L`, icon: TrendingUp, color: 'bg-emerald-500' },
    { title: 'Active vs Total Carts', value: `${activeCarts} / ${totalCarts}`, icon: ShoppingCart, color: 'bg-indigo-500' },
    { title: 'App Downloads', value: totalDownloads.toLocaleString(), icon: Users, color: 'bg-violet-500' },
    { title: 'Partner Malls', value: totalMalls, icon: Building2, color: 'bg-blue-500' },
  ];

  const handleExport = () => {
    // Mock CSV generation
    const csvContent = "data:text/csv;charset=utf-8,Date,Revenue,ActiveCarts,Downloads\n" + 
      mockActivityData.map(e => `${e.name},${e.activeCarts*1000},${e.activeCarts},${e.appDownloads}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smartcart_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Analytics & Reports</h2>
          <p className="text-sm text-slate-500 mt-1">Monitor cross-mall performance and app metrics.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-sm`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Total Revenue (Cross-Mall)</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueData[dateRange]}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carts vs Downloads Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Metrics</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockActivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="activeCarts" name="Active Carts" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="appDownloads" name="App Downloads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
