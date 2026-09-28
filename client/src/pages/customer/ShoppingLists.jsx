import React, { useState } from 'react';
import { useShoppingListStore } from '../../store/shoppingListStore';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, MoreVertical, X } from 'lucide-react';

const ShoppingLists = () => {
  const { lists, createList, deleteList, toggleListCompletion, addItemToList, removeItemFromList, toggleItemPurchased } = useShoppingListStore();
  const [newListName, setNewListName] = useState('');
  const [activeListId, setActiveListId] = useState(lists[0]?.id || null);
  const [newItemName, setNewItemName] = useState('');

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList(newListName.trim());
      setNewListName('');
      // Optimistically assume the new list is the first one in the store now
      // A better approach would be returning the ID, but for mock purposes we'll just set it
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemName.trim() && activeListId) {
      addItemToList(activeListId, newItemName.trim());
      setNewItemName('');
    }
  };

  const activeList = lists.find(l => l.id === activeListId);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Shopping Lists</h2>
          <p className="text-slate-500 text-sm mt-1">Organize your shopping before you visit the mall.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Sidebar: List of Lists */}
        <div className="md:col-span-1 space-y-4">
          <form onSubmit={handleCreateList} className="flex gap-2">
            <input 
              type="text" 
              placeholder="New list name..." 
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button 
              type="submit"
              disabled={!newListName.trim()}
              className="p-2.5 bg-indigo-600 text-white rounded-xl disabled:bg-indigo-300 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-2">
            {lists.map(list => {
              const completedCount = list.items.filter(i => i.isPurchased).length;
              const totalCount = list.items.length;
              
              return (
                <div 
                  key={list.id}
                  onClick={() => setActiveListId(list.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    activeListId === list.id 
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-500' 
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold ${list.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {list.name}
                    </h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">
                      {completedCount} / {totalCount} items
                    </span>
                    {list.isCompleted ? (
                      <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>
                    ) : (
                      <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">In Progress</span>
                    )}
                  </div>
                </div>
              );
            })}
            
            {lists.length === 0 && (
              <div className="text-center p-8 bg-white border border-slate-200 border-dashed rounded-xl">
                <ListTodo className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No shopping lists yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Area: Active List Items */}
        <div className="md:col-span-2">
          {activeList ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{activeList.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Created {new Date(activeList.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => toggleListCompletion(activeList.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    activeList.isCompleted 
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-300' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {activeList.isCompleted ? 'Reopen List' : 'Mark as Completed'}
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleAddItem} className="relative mb-6">
                  <input 
                    type="text" 
                    placeholder="Add an item to this list..." 
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    disabled={activeList.isCompleted}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={!newItemName.trim() || activeList.isCompleted}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-100 text-indigo-600 rounded-lg disabled:opacity-50 hover:bg-indigo-200 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </form>

                <div className="space-y-3">
                  {activeList.items.map(item => (
                    <div 
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        item.isPurchased 
                          ? 'bg-slate-50 border-slate-200' 
                          : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'
                      }`}
                    >
                      <div 
                        className="flex items-center flex-1 cursor-pointer"
                        onClick={() => toggleItemPurchased(activeList.id, item.id)}
                      >
                        {item.isPurchased ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300 flex-shrink-0" />
                        )}
                        <span className={`ml-4 font-medium ${item.isPurchased ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {item.name}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeItemFromList(activeList.id, item.id)}
                        className="text-slate-400 hover:text-red-500 p-2 ml-4"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {activeList.items.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      Your list is empty. Add items you need to buy.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
              <ListTodo className="w-12 h-12 mb-4 text-slate-300" />
              <p>Select a list from the sidebar or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingLists;
