import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  
  addToCart: (product) => set((state) => {
    const existing = state.items.find(item => item.product.id === product.id);
    if (existing) {
      return {
        items: state.items.map(item => 
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      };
    }
    return { items: [...state.items, { product, qty: 1 }] };
  }),

  updateQty: (productId, qty) => set((state) => {
    if (qty <= 0) {
      return { items: state.items.filter(item => item.product.id !== productId) };
    }
    return {
      items: state.items.map(item => 
        item.product.id === productId ? { ...item, qty } : item
      )
    };
  }),

  removeFromCart: (productId) => set((state) => ({
    items: state.items.filter(item => item.product.id !== productId)
  })),

  clearCart: () => set({ items: [] }),

  // Computed properties
  getCartTotals: (offers = []) => {
    const { items } = get();
    let subtotal = 0;
    let totalSavings = 0;
    let totalGST = 0;
    let grandTotal = 0;

    const activeOffers = offers.filter(o => o.status === 'active');

    items.forEach(item => {
      const p = item.product;
      const basePrice = p.price;
      let finalPrice = basePrice * (1 - p.discount / 100);
      let savings = basePrice - finalPrice;
      let qtyToCharge = item.qty;

      // Apply BOGO
      const bogoOffer = activeOffers.find(o => o.type === 'bogo' && o.productBarcode === p.barcode);
      if (bogoOffer) {
        // If Buy 1 Get 1, you pay for Math.ceil(qty / 2)
        qtyToCharge = Math.ceil(item.qty / 2);
        const freeItems = item.qty - qtyToCharge;
        savings += (freeItems * finalPrice) / item.qty; // distribute savings
      }

      // Apply Festival/Category percentage discount
      const catOffer = activeOffers.find(o => o.type === 'festival' && o.applicableTo?.includes(p.category));
      if (catOffer) {
        const extraDiscount = finalPrice * (catOffer.discountPercentage / 100);
        finalPrice -= extraDiscount;
        savings += extraDiscount;
      }

      const itemSubtotal = finalPrice * qtyToCharge;
      const itemGST = itemSubtotal * (p.gst / 100);
      
      subtotal += basePrice * item.qty;
      totalSavings += savings * item.qty;
      totalGST += itemGST;
      grandTotal += itemSubtotal + itemGST;
    });

    return {
      itemCount: items.reduce((sum, item) => sum + item.qty, 0),
      subtotal,
      totalSavings,
      totalGST,
      grandTotal
    };
  }
}));
