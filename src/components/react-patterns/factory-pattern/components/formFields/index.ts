import { CheckboxField } from './CheckboxField';
import { DateField } from './DateField';
import { EmailField } from './EmailField';
import { NumberField } from './NumberField';
import { PasswordField } from './PasswordField';
import { RadioField } from './RadioField';
import { SelectField } from './SelectField';
import { SliderField } from './SliderField';
import { SwitchField } from './SwitchField';
import { TextAreaField } from './TextAreaField';
import { TextField } from './TextField';

export const fieldFactory = {
  checkbox: CheckboxField,
  date: DateField,
  email: EmailField,
  number: NumberField,
  password: PasswordField,
  radio: RadioField,
  select: SelectField,
  slider: SliderField,
  switch: SwitchField,
  textarea: TextAreaField,
  text: TextField,
};
