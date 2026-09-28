import { create } from 'zustand';

export const useShoppingListStore = create((set) => ({
  lists: [
    {
      id: 'sl1',
      name: 'Weekend Groceries',
      createdAt: new Date().toISOString(),
      isCompleted: false,
      items: [
        { id: 'i1', name: 'Milk 1L', isPurchased: true },
        { id: 'i2', name: 'Eggs (Dozen)', isPurchased: false },
        { id: 'i3', name: 'Bread', isPurchased: false },
      ]
    }
  ],

  createList: (name) => set((state) => ({
    lists: [
      {
        id: `sl${Date.now()}`,
        name,
        createdAt: new Date().toISOString(),
        isCompleted: false,
        items: []
      },
      ...state.lists
    ]
  })),

  deleteList: (listId) => set((state) => ({
    lists: state.lists.filter(l => l.id !== listId)
  })),

  toggleListCompletion: (listId) => set((state) => ({
    lists: state.lists.map(l => 
      l.id === listId ? { ...l, isCompleted: !l.isCompleted } : l
    )
  })),

  addItemToList: (listId, itemName) => set((state) => ({
    lists: state.lists.map(l => 
      l.id === listId 
        ? { ...l, items: [...l.items, { id: `i${Date.now()}`, name: itemName, isPurchased: false }] }
        : l
    )
  })),

  removeItemFromList: (listId, itemId) => set((state) => ({
    lists: state.lists.map(l => 
      l.id === listId 
        ? { ...l, items: l.items.filter(i => i.id !== itemId) }
        : l
    )
  })),

  toggleItemPurchased: (listId, itemId) => set((state) => ({
    lists: state.lists.map(l => 
      l.id === listId 
        ? { 
            ...l, 
            items: l.items.map(i => i.id === itemId ? { ...i, isPurchased: !i.isPurchased } : i)
          }
        : l
    )
  }))
}));
