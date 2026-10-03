import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

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
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('buyer');
  const [state, setState] = useState<AppState>('MI');
  const [boxItems, setBoxItems] = useState<BoxItem[]>([]);

  const value = useMemo(
    () => ({ mode, setMode, state, setState, boxItems, setBoxItems }),
    [mode, state, boxItems],
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
