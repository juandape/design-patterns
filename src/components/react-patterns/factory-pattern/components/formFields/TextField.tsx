export const TextField = ({ label, ...rest }: {label: string}) => (
  <div>
    <label>{label}</label>
    <input type='text' {...rest} />
  </div>
);
