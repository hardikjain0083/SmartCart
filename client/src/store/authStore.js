import { create } from 'zustand';

// Mock data to simulate backend response
const MOCK_USERS = {
  'superadmin@smartcart.com': { role: 'superadmin', name: 'Super Admin', id: 'sa_1' },
  'malladmin@smartcart.com': { role: 'malladmin', name: 'Mall Admin', id: 'ma_1', mallId: 'mall_1' },
  'customer@smartcart.com': { role: 'customer', name: 'John Doe', id: 'cust_1', loyaltyPoints: 350 },
};

export const useAuthStore = create((set) => ({
  user: null, // { role, name, email, loyaltyPoints, ... }
  token: null,
  isAuthenticated: false,
  isGuest: false,
  
  updateLoyaltyPoints: (amount) => set((state) => ({
    user: state.user ? { ...state.user, loyaltyPoints: (state.user.loyaltyPoints || 0) + amount } : null
  })),

  login: async (email, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // In a real app, you'd verify password too. Here we just mock it.
    const mockUser = MOCK_USERS[email];
    if (!mockUser) {
      throw new Error('Invalid email or password');
    }
    
    const token = `mock-jwt-token-${mockUser.id}`;
    localStorage.setItem('auth-token', token);
    set({ user: { ...mockUser, email }, token, isAuthenticated: true, isGuest: false });
    return mockUser.role;
  },
  
  register: async (name, email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const token = `mock-jwt-token-new`;
    const newUser = { role: 'customer', name, email, id: `cust_${Date.now()}`, loyaltyPoints: 0 };
    localStorage.setItem('auth-token', token);
    set({ user: newUser, token, isAuthenticated: true, isGuest: false });
    return 'customer';
  },

  continueAsGuest: () => {
    set({ user: { role: 'customer', name: 'Guest User', id: 'guest', loyaltyPoints: 0 }, token: null, isAuthenticated: true, isGuest: true });
    return 'customer';
  },
  
  logout: () => {
    localStorage.removeItem('auth-token');
    set({ user: null, token: null, isAuthenticated: false, isGuest: false });
  },

  checkAuth: () => {
    // In a real app, you'd validate the token here.
    const token = localStorage.getItem('auth-token');
    // We'll leave it as null for default on load, unless we implement persistent mock auth.
  }
}));
