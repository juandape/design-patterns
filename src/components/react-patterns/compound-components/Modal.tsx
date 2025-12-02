import { ModalClose, ModalContent, ModalTrigger } from './components';
import { ModalProvider } from './context';

type ModalComponent = typeof ModalProvider & {
  Trigger: typeof ModalTrigger;
  Close: typeof ModalClose;
  Content: typeof ModalContent;
};

export const Modal = ModalProvider as ModalComponent;

Modal.Trigger = ModalTrigger;
Modal.Close = ModalClose;
Modal.Content = ModalContent;
