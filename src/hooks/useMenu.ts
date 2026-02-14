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
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS); //  Start with default menu
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToMenu((items) => {
      if (items.length === 0 && !isInitialized) {
        // Initialize with default menu
        initializeMenu(MENU_ITEMS).then(() => {
          setIsInitialized(true);
          console.log('Menu initialized successfully');
        }).catch((error) => {
          console.error('Error initializing menu:', error);
        });
      } else if (items.length > 0) {
        setMenuItems(items);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [isInitialized]);

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const newId = Date.now().toString();
      const newItem: MenuItem = { ...item, id: newId };
      await saveMenuItem(newItem);
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };

  const updateItem = async (item: MenuItem) => {
    try {
      await updateMenuItem(item);
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await deleteMenuItem(itemId);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  return {
    menuItems,
    isLoading,
    addMenuItem,
    updateItem,
    deleteItem
  };
};
