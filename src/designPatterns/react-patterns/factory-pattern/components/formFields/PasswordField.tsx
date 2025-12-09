export const PasswordField = ({ label, ...rest }: {label: string}) => (
  <div>
    <label>{label}</label>
    <input type='password' {...rest} />
  </div>
);