import { create } from 'zustand';

// Mock Data
const initialProducts = [
  {
    id: 'p1',
    barcode: '8901030940141',
    name: 'Maggi 2-Minute Noodles',
    brand: 'Nestle',
    category: 'Groceries',
    price: 12,
    mrp: 14,
    gst: 5,
    stock: 150,
    unit: '140g',
    aisle: 'A1',
    expiryDate: '2027-12-31',
    discount: 14,
    weight: 140, // weight in grams
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 'p2',
    barcode: '8901452136547',
    name: 'Amul Butter',
    brand: 'Amul',
    category: 'Dairy',
    price: 54,
    mrp: 58,
    gst: 12,
    stock: 45,
    unit: '100g',
    aisle: 'D4',
    expiryDate: '2026-11-30',
    discount: 7,
    weight: 100, // weight in grams
    image: 'https://via.placeholder.com/150'
  }
];

export const useMallAdminStore = create((set) => ({
  products: initialProducts,

  addProduct: (product) => set((state) => ({
    products: [{ ...product, id: `p${Date.now()}` }, ...state.products]
  })),

  updateProduct: (id, updatedData) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updatedData } : p)
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),

  adjustStock: (id, amount) => set((state) => ({
    products: state.products.map(p => 
      p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p
    )
  })),

  importBulkProducts: (newProducts) => set((state) => ({
    products: [...newProducts, ...state.products]
  })),

  // Validates an EAN-13 barcode
  isValidEAN13: (barcode) => {
    if (!/^\d{13}$/.test(barcode)) return false;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(barcode[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(barcode[12]);
  }
}));
