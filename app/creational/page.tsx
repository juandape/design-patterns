import { AbstractFactoryComponent } from '@/src/designPatterns/creational-patterns/abstract-factory-pattern/abstractFactory';
import { ThemeProvider } from '@/src/designPatterns/creational-patterns/abstract-factory-pattern/ThemeContext/themeContext';
import { AuthTest } from '@/src/designPatterns/creational-patterns/singleton-pattern/authTest';

export default function ReduxPage() {
  return (
    <ThemeProvider>
      <div className='p-5 mt-5 w-1/2 bg-white text-black mx-auto'>
        <div className='mx-auto my-auto'>
          <AuthTest />
          <AbstractFactoryComponent />
        </div>
      </div>
    </ThemeProvider>
  );
}
