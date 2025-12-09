export const CheckboxField = ({ label, ...rest }: { label: string }) => (
  <div>
    <label>{label}</label>
    <input type='checkbox' {...rest} />
  </div>
);
