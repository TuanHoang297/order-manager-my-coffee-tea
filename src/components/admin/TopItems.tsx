import React from 'react';
import { Flame } from 'lucide-react';

interface TopItem {
  name: string;
  count: number;
  revenue: number;
}

interface TopItemsProps {
  items: TopItem[];
  title: string;
  limit?: number;
  variant?: 'day' | 'alltime';
}

export const TopItems: React.FC<TopItemsProps> = ({
  items,
  title,
  limit = 5,
  variant = 'day'
}) => {
  if (items.length === 0) return null;

  const displayItems = items.slice(0, limit);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Flame className={variant === 'day' ? 'text-indigo-500' : 'text-gray-600'} size={16} />
        {title}
      </h3>
      <div className="space-y-2">
        {displayItems.map((item, index) => (
          <div key={item.name} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
              variant === 'day'
                ? index === 0 ? 'bg-indigo-500 text-white'
                  : index === 1 ? 'bg-indigo-400 text-white'
                  : index === 2 ? 'bg-indigo-300 text-white'
                  : 'bg-gray-200 text-gray-600'
                : index === 0 ? 'bg-gray-900 text-white'
                  : index === 1 ? 'bg-gray-700 text-white'
                  : index === 2 ? 'bg-gray-600 text-white'
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <p className="flex-1 text-gray-900 font-semibold text-sm">{item.name}</p>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{item.count} ly</p>
              <p className="text-xs text-gray-500">{item.revenue.toLocaleString()}đ</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
