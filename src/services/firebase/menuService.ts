import { ref, set, onValue, push, update, remove } from 'firebase/database';
import { database } from './config';
import { MenuItem } from '../../types';

export const saveMenuItem = async (item: MenuItem): Promise<string> => {
  const menuRef = ref(database, `menu/${item.id}`);
  await set(menuRef, item);
  return item.id;
};

export const subscribeToMenu = (callback: (items: MenuItem[]) => void) => {
  const menuRef = ref(database, 'menu');
  
  return onValue(menuRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const itemsArray: MenuItem[] = Object.values(data);
      callback(itemsArray);
    } else {
      callback([]);
    }
  });
};

export const updateMenuItem = async (item: MenuItem): Promise<void> => {
  const menuRef = ref(database, `menu/${item.id}`);
  await update(menuRef, item);
};

export const deleteMenuItem = async (itemId: string): Promise<void> => {
  const menuRef = ref(database, `menu/${itemId}`);
  await remove(menuRef);
};

export const initializeMenu = async (items: MenuItem[]): Promise<void> => {
  const menuRef = ref(database, 'menu');
  const menuData = items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, MenuItem>);
  
  await set(menuRef, menuData);
};
