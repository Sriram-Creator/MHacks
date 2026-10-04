import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import {
  createSeedThreads,
  lastWeekBox,
  mockOrders,
  type BoxCadence,
  type ChatMessage,
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
  threads: Record<string, ChatMessage[]>;
  sendChatMessage: (makerId: string, text: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('buyer');
  const [state, setState] = useState<AppState>('MI');
  const [boxItems, setBoxItems] = useState<BoxItem[]>([]);
  const [boxCadence, setBoxCadence] = useState<BoxCadence>('one-time');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>(createSeedThreads);

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

  const sendChatMessage = useCallback((makerId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const message: ChatMessage = {
      id: `msg-${makerId}-${Date.now()}`,
      from: 'buyer',
      text: trimmed,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setThreads((current) => ({
      ...current,
      [makerId]: [...(current[makerId] ?? []), message],
    }));
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
      threads,
      sendChatMessage,
    }),
    [
      mode,
      state,
      boxItems,
      boxCadence,
      addToBox,
      updateBoxQuantity,
      repeatLastWeek,
      orders,
      placeOrder,
      threads,
      sendChatMessage,
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
