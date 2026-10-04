import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import {
  lastWeekBox,
  mockOrders,
  type BoxCadence,
  type Order,
  type PickupWindow,
} from '@/data/mock';

export type AppMode = 'buyer' | 'maker';
export type AppState = 'MI' | 'WY';

export type BoxItem = {
  itemId: string;
  quantity: number;
};

type AppContextValue = {
  isAuthenticated: boolean;
  authEmail: string | null;
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string) => void;
  signOut: () => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  state: AppState;
  setState: (state: AppState) => void;
  boxItems: BoxItem[];
  setBoxItems: (items: BoxItem[] | ((prev: BoxItem[]) => BoxItem[])) => void;
  boxCadence: BoxCadence;
  setBoxCadence: (cadence: BoxCadence) => void;
  addToBox: (itemId: string) => void;
  updateBoxQuantity: (itemId: string, quantity: number) => void;
  repeatLastWeek: () => void;
  orders: Order[];
  placeOrder: (spotId: string, window: PickupWindow, total: number) => Order;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Mock/local auth — no backend. Any non-empty credentials are accepted.
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>('buyer');
  const [state, setState] = useState<AppState>('MI');
  const [boxItems, setBoxItems] = useState<BoxItem[]>([]);
  const [boxCadence, setBoxCadence] = useState<BoxCadence>('one-time');
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const signIn = useCallback((email: string, _password: string) => {
    setAuthEmail(email.trim());
  }, []);

  const signUp = useCallback((email: string, _password: string) => {
    setAuthEmail(email.trim());
  }, []);

  const signOut = useCallback(() => {
    setAuthEmail(null);
  }, []);

  const addToBox = useCallback((itemId: string) => {
    setBoxItems((prev) => {
      const existing = prev.find((line) => line.itemId === itemId);
      if (existing) {
        return prev.map((line) =>
          line.itemId === itemId ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...prev, { itemId, quantity: 1 }];
    });
  }, []);

  const updateBoxQuantity = useCallback((itemId: string, quantity: number) => {
    setBoxItems((prev) => {
      if (quantity < 1) {
        return prev.filter((line) => line.itemId !== itemId);
      }
      return prev.map((line) => (line.itemId === itemId ? { ...line, quantity } : line));
    });
  }, []);

  const repeatLastWeek = useCallback(() => {
    setBoxItems(lastWeekBox.map((line) => ({ ...line })));
  }, []);

  const placeOrder = useCallback(
    (spotId: string, window: PickupWindow, total: number) => {
      const order: Order = {
        id: `order-${Date.now()}`,
        status: 'Confirmed',
        items: boxItems.map((line) => ({ ...line })),
        spotId,
        window,
        cadence: boxCadence,
        total,
      };
      setOrders((prev) => [order, ...prev]);
      setBoxItems([]);
      return order;
    },
    [boxCadence, boxItems],
  );

  const value = useMemo(
    () => ({
      isAuthenticated: authEmail !== null,
      authEmail,
      signIn,
      signUp,
      signOut,
      mode,
      setMode,
      state,
      setState,
      boxItems,
      setBoxItems,
      boxCadence,
      setBoxCadence,
      addToBox,
      updateBoxQuantity,
      repeatLastWeek,
      orders,
      placeOrder,
    }),
    [
      authEmail,
      signIn,
      signUp,
      signOut,
      mode,
      state,
      boxItems,
      boxCadence,
      addToBox,
      updateBoxQuantity,
      repeatLastWeek,
      orders,
      placeOrder,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
