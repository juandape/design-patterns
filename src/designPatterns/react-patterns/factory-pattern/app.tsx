import { FormField, FormRender } from './components/formRender/FormRender';

export const App = () => {
  const form = [
    { id: 1, type: 'text', label: 'Name', placeholder: 'Your name' },
    { id: 2, type: 'email', label: 'Email' },
    { id: 3, type: 'password', label: 'Password' },
    { id: 4, type: 'number', label: 'Age' },
    { id: 5, type: 'select', label: 'Country', options: ['Colombia', 'México'] },
    { id: 6, type: 'date', label: 'Birthdate' },
    { id: 7, type: 'textarea', label: 'Comments' },
    { id: 8, type: 'checkbox', label: 'Accept Terms' },
    { id: 9, type: 'radio', label: 'Gender', name: 'gender', options: ['M', 'F'] },
    { id: 10, type: 'switch', label: 'Enable notifications' },
    { id: 11, type: 'slider', label: 'Volume', min: 0, max: 100 },
  ] satisfies FormField[];

  return <FormRender schema={form} />;
};
