import React from 'react';
import { Coffee, Sparkles, Milk, Leaf } from 'lucide-react';
import { Category } from '../../types';

interface CategoryFilterProps {
  categories: Array<Category | 'Tất cả'>;
  activeCategory: Category | 'Tất cả';
  onCategoryChange: (category: Category | 'Tất cả') => void;
}

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case Category.COFFEE: return <Coffee size={14} />;
    case Category.SPECIALTY: return <Sparkles size={14} />;
    case Category.MILK_TEA: return <Milk size={14} />;
    case Category.HEALTHY: return <Leaf size={14} />;
    default: return null;
  }
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold transition-all ${
            activeCategory === cat
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {cat !== 'Tất cả' && getCategoryIcon(cat)}
          {cat}
        </button>
      ))}
    </div>
  );
};
