import { createContext } from 'react';

type ModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
} | null;

export const ModalContext = createContext<ModalContextType>(null);
