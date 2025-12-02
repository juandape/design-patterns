export const SliderField = ({ label, ...rest }: { label: string }) => (
  <div>
    <label>{label}</label>
    <input type='range' {...rest} />
  </div>
);
