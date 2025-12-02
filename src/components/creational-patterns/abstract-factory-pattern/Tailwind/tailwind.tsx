import {
  UIButton,
  Button,
  UICard,
  Card,
  UIFactory,
} from '../types/abstract.types';

class TailwindUIButton implements UIButton {
  render({ label, onClick }: Button) {
    return (
      <button
        onClick={onClick}
        className='p-2 bg-red-600 text-white rounded transition duration-300 ease-in-out hover:bg-red-800'
      >
        {label}
      </button>
    );
  }
}

class TailwindUICard implements UICard {
  render({ title, children }: Card) {
    return (
      <div className='p-4 bg-white rounded shadow-md text-blue-900'>
        <h2 className='text-xl font-semibold mb-2'>{title}</h2>
        <div>{children}</div>
      </div>
    );
  }
}

export class TailwindUIFactory implements UIFactory {
  createButton(): UIButton {
    return new TailwindUIButton();
  }

  createCard(): UICard {
    return new TailwindUICard();
  }
}
