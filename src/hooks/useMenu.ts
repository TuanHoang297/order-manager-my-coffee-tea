import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import {
  saveMenuItem,
  subscribeToMenu,
  updateMenuItem,
  deleteMenuItem,
  initializeMenu
} from '../services/firebase/menuService';
import { MENU_ITEMS } from '../constants';

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS); // Start with default menu
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToMenu((items) => {
      if (items.length === 0 && !isInitialized) {
        // Initialize with default menu
        initializeMenu(MENU_ITEMS).then(() => {
          setIsInitialized(true);
        });
      } else if (items.length > 0) {
        setMenuItems(items);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [isInitialized]);

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    const newId = Date.now().toString();
    const newItem: MenuItem = { ...item, id: newId };
    await saveMenuItem(newItem);
  };

  const updateItem = async (item: MenuItem) => {
    await updateMenuItem(item);
  };

  const deleteItem = async (itemId: string) => {
    await deleteMenuItem(itemId);
  };

  return {
    menuItems,
    isLoading,
    addMenuItem,
    updateItem,
    deleteItem
  };
};
