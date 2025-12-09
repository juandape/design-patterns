export const DateField = ({ label, ...rest }: { label: string }) => (
  <div>
    <label>{label}</label>
    <input type='date' {...rest} />
  </div>
);
