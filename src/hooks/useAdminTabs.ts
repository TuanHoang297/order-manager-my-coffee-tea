import { useState } from 'react';

export type AdminTab = 'active' | 'completed' | 'revenue';

export const useAdminTabs = () => {
  const [adminTab, setAdminTab] = useState<AdminTab>('active');
  const [revenueDate, setRevenueDate] = useState(new Date());

  return {
    adminTab,
    setAdminTab,
    revenueDate,
    setRevenueDate
  };
};
