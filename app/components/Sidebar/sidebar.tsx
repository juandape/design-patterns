'use client';

import Link from 'next/link';
import { useState } from 'react';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Behavioral Patterns', path: '/behavioral' },
  { name: 'Creational Patterns', path: '/creational' },
  { name: 'Strategy Patterns', path: 'strategy' },
  { name: 'Mastra Assistant', path: '/mastra' },
  { name: 'Redux Toolkit', path: '/redux' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden'
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        <div className='p-6'>
          <h2 className='text-2xl font-bold mb-6'>Exercises</h2>
          <nav>
            <ul className='space-y-2'>
              {pages.map((page) => (
                <li key={page.path}>
                  <Link
                    href={page.path}
                    className='block px-4 py-2 rounded hover:bg-gray-800 transition-colors'
                    onClick={() => setIsOpen(false)}
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
