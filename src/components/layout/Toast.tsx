import React from 'react';
import { CheckCircle, X, MessageSquare } from 'lucide-react';
import { Toast as ToastType } from '../../types';

interface ToastProps {
  toasts: ToastType[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-lg border flex items-center gap-3 animate-in slide-in-from-right duration-300 ${
            toast.type === 'success' ? 'bg-white border-emerald-200 text-emerald-800' :
            toast.type === 'error' ? 'bg-white border-red-200 text-red-800' :
            'bg-white border-indigo-200 text-indigo-800'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="text-emerald-500 shrink-0" size={20} />}
          {toast.type === 'error' && <X className="text-red-500 shrink-0" size={20} />}
          {toast.type === 'info' && <MessageSquare className="text-indigo-500 shrink-0" size={20} />}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};
