import { ReactNode } from 'react';
import { useModal } from '../hooks/useModal.hook';

export const ModalTrigger = ({ children }: { children: ReactNode }) => {
  const { openModal } = useModal();

  return <button onClick={openModal}>{children}</button>;
};
