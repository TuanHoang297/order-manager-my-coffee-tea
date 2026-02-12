import React from 'react';
import { ShoppingCart, ClipboardList, BarChart3 } from 'lucide-react';
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
  const isManagementTab = adminTab === 'active' || adminTab === 'completed' || adminTab === 'menu';
  
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
        <span className="text-xs font-bold">Đặt món</span>
      </button>

      <div className="w-px h-8 bg-gray-200"></div>

      <button
        onClick={() => {
          onViewChange('admin');
          if (adminTab === 'revenue') onAdminTabChange('active');
        }}
        className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${
          activeView === 'admin' && isManagementTab ? 'text-indigo-700' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        {activeView === 'admin' && isManagementTab && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full"></div>
        )}
        <ClipboardList size={24} strokeWidth={activeView === 'admin' && isManagementTab ? 2.5 : 2} />
        <span className="text-xs font-bold">Quản lý</span>
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
    </nav>
  );
};
