import React from 'react';
import { ShoppingCart, ClipboardList, BarChart3, UtensilsCrossed } from 'lucide-react';
import { AdminTab } from '../../hooks/useAdminTabs';

interface BottomNavigationProps {
  activeView: 'customer' | 'admin';
  adminTab: AdminTab;
  onViewChange: (view: 'customer' | 'admin') => void;
  onAdminTabChange: (tab: AdminTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeView,
  adminTab,
  onViewChange,
  onAdminTabChange
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[180] bg-white/90 backdrop-blur-xl border-t border-indigo-100 px-6 py-4 flex justify-around items-center shadow-lg shadow-indigo-900/5">
      <button
        onClick={() => onViewChange('customer')}
        className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${
          activeView === 'customer' ? 'text-indigo-700' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        {activeView === 'customer' && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full"></div>
        )}
        <ShoppingCart size={24} strokeWidth={activeView === 'customer' ? 2.5 : 2} />
        <span className="text-xs font-bold">Thực đơn</span>
      </button>

      <div className="w-px h-8 bg-gray-200"></div>

      <button
        onClick={() => {
          onViewChange('admin');
          if (adminTab === 'revenue' || adminTab === 'menu') onAdminTabChange('active');
        }}
        className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${
          activeView === 'admin' && adminTab !== 'revenue' && adminTab !== 'menu' ? 'text-indigo-700' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        {activeView === 'admin' && adminTab !== 'revenue' && adminTab !== 'menu' && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full"></div>
        )}
        <ClipboardList size={24} strokeWidth={activeView === 'admin' && adminTab !== 'revenue' && adminTab !== 'menu' ? 2.5 : 2} />
        <span className="text-xs font-bold">Đơn hàng</span>
      </button>

      <div className="w-px h-8 bg-gray-200"></div>

      <button
        onClick={() => {
          onViewChange('admin');
          onAdminTabChange('revenue');
        }}
        className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${
          activeView === 'admin' && adminTab === 'revenue' ? 'text-indigo-700' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        {activeView === 'admin' && adminTab === 'revenue' && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full"></div>
        )}
        <BarChart3 size={24} strokeWidth={activeView === 'admin' && adminTab === 'revenue' ? 2.5 : 2} />
        <span className="text-xs font-bold">Doanh thu</span>
      </button>

      <div className="w-px h-8 bg-gray-200"></div>

      <button
        onClick={() => {
          onViewChange('admin');
          onAdminTabChange('menu');
        }}
        className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${
          activeView === 'admin' && adminTab === 'menu' ? 'text-indigo-700' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        {activeView === 'admin' && adminTab === 'menu' && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full"></div>
        )}
        <UtensilsCrossed size={24} strokeWidth={activeView === 'admin' && adminTab === 'menu' ? 2.5 : 2} />
        <span className="text-xs font-bold">Thực đơn</span>
      </button>
    </nav>
  );
};
