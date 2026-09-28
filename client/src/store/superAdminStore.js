import { create } from 'zustand';

// Mock initial data
const initialMalls = [
  { id: 'm1', name: 'Phoenix Marketcity', location: 'Mumbai', status: 'active', adminEmail: 'admin@phoenix.com', totalSales: 450000, carts: 12 },
  { id: 'm2', name: 'DLF Mall of India', location: 'Noida', status: 'active', adminEmail: 'admin@dlf.com', totalSales: 850000, carts: 25 },
  { id: 'm3', name: 'Inorbit Mall', location: 'Malad', status: 'suspended', adminEmail: 'admin@inorbit.com', totalSales: 120000, carts: 5 },
];

const initialCarts = [
  { id: 'c1', serialNumber: 'SC-1001', mallId: 'm1', status: 'active', battery: 85 },
  { id: 'c2', serialNumber: 'SC-1002', mallId: 'm1', status: 'active', battery: 92 },
  { id: 'c3', serialNumber: 'SC-1003', mallId: 'm2', status: 'maintenance', battery: 15 },
];

export const useSuperAdminStore = create((set) => ({
  malls: initialMalls,
  carts: initialCarts,

  // Mall Actions
  addMall: (mall) => set((state) => ({ 
    malls: [...state.malls, { ...mall, id: `m${Date.now()}`, totalSales: 0, carts: 0, status: 'active' }] 
  })),
  
  updateMall: (id, updatedData) => set((state) => ({
    malls: state.malls.map(m => m.id === id ? { ...m, ...updatedData } : m)
  })),
  
  deleteMall: (id) => set((state) => ({
    malls: state.malls.filter(m => m.id !== id),
    // Also remove carts associated with this mall
    carts: state.carts.filter(c => c.mallId !== id)
  })),
  
  toggleMallStatus: (id) => set((state) => ({
    malls: state.malls.map(m => m.id === id ? { ...m, status: m.status === 'active' ? 'suspended' : 'active' } : m)
  })),

  // Cart Actions
  addCart: (cart) => set((state) => ({
    carts: [...state.carts, { ...cart, id: `c${Date.now()}`, status: 'active', battery: 100 }],
    malls: state.malls.map(m => m.id === cart.mallId ? { ...m, carts: m.carts + 1 } : m)
  })),

  updateCartStatus: (id, status) => set((state) => ({
    carts: state.carts.map(c => c.id === id ? { ...c, status } : c)
  })),

  deleteCart: (id) => set((state) => {
    const cart = state.carts.find(c => c.id === id);
    if (!cart) return state;
    return {
      carts: state.carts.filter(c => c.id !== id),
      malls: state.malls.map(m => m.id === cart.mallId ? { ...m, carts: m.carts - 1 } : m)
    };
  })
}));
