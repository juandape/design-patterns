import { ReactNode } from 'react';
import { useModal } from '../hooks/useModal.hook';

export const ModalContent = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useModal();

  if (!isOpen) return null;

  return <div>{children}</div>;
};
