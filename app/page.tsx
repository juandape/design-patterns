export default function Home() {
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='container mx-auto px-4 py-16'>
        <header className='text-center mb-16'>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            World Of React
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Playground for React development, design patterns, and state management.
          </p>
        </header>

        <div className='grid md:grid-cols-3 gap-8 mb-16'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow'>
            <div className='text-4xl mb-4'>🏗️</div>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
              Creational Patterns
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Singleton, Factory, Builder, Prototype and more
            </p>
            <a
              href='/creational'
              className='text-blue-600 dark:text-blue-400 hover:underline'
            >
              View patterns →
            </a>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow'>
            <div className='text-4xl mb-4'>🔧</div>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
              Mastra
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Mastra chatbot Assistant
            </p>
            <a
              href='/mastra'
              className='text-blue-600 dark:text-blue-400 hover:underline'
            >
              View example →
            </a>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow'>
            <div className='text-4xl mb-4'>⚡</div>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
              Behavioral Patterns
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Observer, Strategy, Command, State and more
            </p>
            <a
              href='/behavioral'
              className='text-blue-600 dark:text-blue-400 hover:underline'
            >
              View patterns →
            </a>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow'>
            <div className='text-4xl mb-4'>📐</div>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
              SOLID Principles
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Single Responsibility, Open/Closed, Liskov Substitution and more
            </p>
            <a
              href='/solid'
              className='text-blue-600 dark:text-blue-400 hover:underline'
            >
              View principles →
            </a>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow'>
            <div className='text-4xl mb-4'>⚛️</div>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
              React Patterns
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Compound Components, Render Props, HOC and more
            </p>
            <a
              href='/strategy'
              className='text-blue-600 dark:text-blue-400 hover:underline'
            >
              View patterns →
            </a>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow'>
            <div className='text-4xl mb-4'>🔄</div>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
              Redux Toolkit
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              State management using Redux Toolkit
            </p>
            <a
              href='/redux'
              className='text-blue-600 dark:text-blue-400 hover:underline'
            >
              View patterns →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
