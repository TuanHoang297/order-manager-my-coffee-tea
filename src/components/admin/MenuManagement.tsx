import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { MenuItem, Category } from '../../types';

interface MenuManagementProps {
  menuItems: MenuItem[];
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
}

export const MenuManagement: React.FC<MenuManagementProps> = ({
  menuItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: Category.COFFEE
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.price) return;

    if (editingId) {
      onUpdateItem({
        id: editingId,
        name: formData.name,
        price: parseInt(formData.price),
        category: formData.category
      });
      setEditingId(null);
    } else {
      onAddItem({
        name: formData.name,
        price: parseInt(formData.price),
        category: formData.category
      });
      setIsAdding(false);
    }

    setFormData({ name: '', price: '', category: Category.COFFEE });
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', price: '', category: Category.COFFEE });
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Quản lý thực đơn</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Thêm món
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white border border-indigo-300 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-gray-900">{editingId ? 'Sửa món' : 'Thêm món mới'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Tên món"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <input
              type="number"
              placeholder="Giá (đ)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <Save size={18} />
              Lưu
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{category} ({(items as MenuItem[]).length})</h3>
            <div className="space-y-2">
              {(items as MenuItem[]).map(item => (
                <div
                  key={item.id}
                  className={`bg-white border rounded-lg p-3 flex items-center justify-between ${editingId === item.id ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200'
                    }`}
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price.toLocaleString()}đ</p>
                  </div>
                  {!isAdding && !editingId && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 active:scale-95 transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Xóa món "${item.name}"?`)) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 active:scale-95 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
