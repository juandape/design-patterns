export const EmailField = ({ label, ...rest }: { label: string }) => (
  <div>
    <label>{label}</label>
    <input type='email' {...rest} />
  </div>
);
