import { ReactNode } from "react";
import { useModal } from "../hooks/useModal.hook";

export const ModalClose = ({children}: {children: ReactNode}) => {
  const { closeModal } = useModal();

  return <button onClick={closeModal}>{children}</button>;
};