import React from 'react';
import { Store } from 'lucide-react';

interface HeaderProps {
  storeName: string;
  address: string;
  isOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ storeName, address, isOpen }) => {
  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center overflow-hidden shadow-md">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{storeName}</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Store size={11} />
              {address}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          isOpen ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className={`text-xs font-semibold ${isOpen ? 'text-emerald-700' : 'text-gray-600'}`}>
            {isOpen ? 'Đang mở cửa' : 'Đã đóng cửa'}
          </span>
        </div>
      </div>
    </header>
  );
};
