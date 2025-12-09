import { useState, useMemo } from 'react';
import {
  MinLengthStrategy,
  NumberStrategy,
  UppercaseStrategy,
  SpecialCharacterStrategy,
} from '../components/strategies/strategies';
import { PasswordValidator } from '../components/validator/passwordValidator';

export const usePasswordValidation = () => {
  const [password, setPassword] = useState('');

  const validator = useMemo(
    () =>
      new PasswordValidator([
        new MinLengthStrategy(8),
        new NumberStrategy(),
        new UppercaseStrategy(),
        new SpecialCharacterStrategy(),
      ]),
    []
  );

  const results = useMemo(
    () => validator.validate(password),
    [password, validator]
  );

  const isValid = results.every((result) => result.valid);

  return { password, setPassword, results, isValid };
};
