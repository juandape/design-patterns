export const SelectField = ({ label, options = [], ...rest }: { label: string; options?: string[] }) => (
  <div>
    <label>{label}</label>
    <select {...rest}>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
