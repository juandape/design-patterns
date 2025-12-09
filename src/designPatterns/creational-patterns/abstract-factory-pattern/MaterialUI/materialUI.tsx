import {
  Button,
  Card,
  UIButton,
  UICard,
  UIFactory,
} from '../types/abstract.types';

class MaterialUIButton implements UIButton {
  render({ label, onClick }: Button) {
    return (
      <button
        onClick={onClick}
        className='p-2 bg-blue-600 text-white rounded transition duration-300 ease-in-out hover:bg-blue-800'
      >
        {label}
      </button>
    );
  }
}
class MaterialUICard implements UICard {
  render({ title, children }: Card) {
    return (
      <div className='p-4 bg-white rounded shadow-md'>
        <h2 className='text-xl font-semibold mb-2 text-green-700'>{title}</h2>
        <div>{children}</div>
      </div>
    );
  }
}

export class MaterialUIFactory implements UIFactory {
  createButton(): UIButton {
    return new MaterialUIButton();
  }

  createCard(): UICard {
    return new MaterialUICard();
  }
}
