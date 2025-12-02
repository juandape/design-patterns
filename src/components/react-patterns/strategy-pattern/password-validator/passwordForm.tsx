import { usePasswordValidation } from './hooks/usePasswordValidation.hook';

export const PasswordForm = () => {
  const { password, setPassword, results, isValid } = usePasswordValidation();

  return (
    <div>
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <ul>
        {results.map((result) => (
          <li key={result.message}>{result.message}</li>
        ))}
      </ul>

      <button disabled={!isValid}>Submit</button>
    </div>
  );
};
