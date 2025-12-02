import { fieldFactory } from '../formFields';

export interface FormField {
  type: keyof typeof fieldFactory;
  id: number;
  label: string;
  options?: string[];
  [key: string]: unknown;
}

interface FormRenderProps {
  schema: FormField[];
}
export const FormRender = ({ schema }: FormRenderProps) => {
  return (
    <form>
      {schema.map((field) => {
        const FieldComponent = fieldFactory[field.type];
        if (!FieldComponent) {
          return <p key={field.id}>Unsupported field type: {field.type}</p>;
        }
        const { type, options, id, ...rest } = field;
        return (
          <FieldComponent
            key={field.id}
            id={String(id)}
            options={options}
            {...rest}
          />
        );
      })}
    </form>
  );
};
