'use client';

import { useTheme } from './ThemeContext/themeContext';

export const AbstractFactoryComponent = () => {
  const { factory, toggleTheme } = useTheme();

  const Button = factory.createButton();
  const Card = factory.createCard();

  return (
    <div className='p-5 w-96'>
      <button
        onClick={toggleTheme}
        className='mb-5 text-blue-500 bg-amber-50 p-4 rounded-sm transition-colors duration-300 hover:bg-amber-100 cursor-pointer'
      >
        Toggle Theme
      </button>

      {Card.render({
        title: 'Main Panel',
        children: Button.render({
          label: 'Press',
          onClick: () => alert('Hello!'),
        }),
      })}
    </div>
  );
};
