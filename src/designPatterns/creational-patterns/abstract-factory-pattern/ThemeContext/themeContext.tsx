'use client';

import { ReactNode, useState, createContext, useContext, useMemo } from 'react';
import { ThemeContextType, UIFactory } from '../types/abstract.types';
import { MaterialUIFactory } from '../MaterialUI/materialUI';
import { TailwindUIFactory } from '../Tailwind/tailwind';

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [factory, setFactory] = useState<UIFactory>(new MaterialUIFactory());

  const toggleTheme = () => {
    setFactory((prevFactory) =>
      prevFactory instanceof MaterialUIFactory
        ? new TailwindUIFactory()
        : new MaterialUIFactory()
    );
  };

  const value = useMemo<ThemeContextType>(() => ({ factory, toggleTheme }), [factory]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () =>
  useContext(ThemeContext) as unknown as {
    factory: UIFactory;
    toggleTheme: () => void;
  };
