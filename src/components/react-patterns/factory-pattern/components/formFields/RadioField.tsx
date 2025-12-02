export const RadioField = ({
  label,
  id,
  name,
  options,
  ...rest
}: {
  label: string;
  id?: string;
  name?: string;
  options?: string[];
}) => (
  <div key={id} className='flex flex-col gap-1'>
    <label>{label}</label>

    <div>
      {options?.map((opt) => (
        <label key={opt}>
          <input type='radio' name={name} value={opt} />
          {opt}
        </label>
      ))}
    </div>
  </div>
);
