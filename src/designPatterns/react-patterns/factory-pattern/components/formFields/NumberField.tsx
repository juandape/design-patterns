export const NumberField = ({ label, ...rest }: { label: string }) => (
  <div>
    <label>{label}</label>
    <input type='number' {...rest} />
  </div>
);
