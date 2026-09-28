import { create } from 'zustand';

// Mock Offers
const initialOffers = [
  {
    id: 'o1',
    title: 'Diwali Mega Sale',
    type: 'festival',
    discountPercentage: 15,
    applicableTo: ['Groceries', 'Snacks'],
    status: 'active'
  },
  {
    id: 'o2',
    title: 'Buy 1 Get 1 Free',
    type: 'bogo',
    productBarcode: '8901452136547', // Assuming this is Amul Butter
    status: 'active'
  }
];

export const useOfferStore = create((set) => ({
  offers: initialOffers,
  
  addOffer: (offer) => set((state) => ({
    offers: [{ ...offer, id: `o${Date.now()}`, status: 'active' }, ...state.offers]
  })),

  deleteOffer: (id) => set((state) => ({
    offers: state.offers.filter(o => o.id !== id)
  })),

  toggleOfferStatus: (id) => set((state) => ({
    offers: state.offers.map(o => o.id === id ? { ...o, status: o.status === 'active' ? 'inactive' : 'active' } : o)
  }))
}));
