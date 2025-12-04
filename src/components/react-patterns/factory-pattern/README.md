# Factory Pattern in React (Patrón Fábrica en React)

## Explicación Sencilla

El patrón Factory proporciona una interfaz para crear objetos sin especificar la clase exacta del objeto que se creará. En React, se usa para crear componentes dinámicamente basándose en parámetros.

**Analogía:** Es como un chef en un restaurante. Le dices qué plato quieres (tipo), y el chef decide qué ingredientes y técnicas usar para crearlo. No necesitas saber cómo se cocina, solo pides y recibes el plato.

## Uso en React

En React, este patrón es útil para:

- **Componentes dinámicos** - Renderizar diferentes componentes según el tipo
- **Formularios dinámicos** - Crear campos según configuración
- **Renderizado condicional** - Evitar múltiples if/else
- **Plugins/Extensiones** - Sistema extensible de componentes
- **Configuración basada en datos** - UI generada desde JSON/API

## Ejercicio Implementado

### Generador de Campos de Formulario

Se implementó una fábrica que crea diferentes tipos de campos de formulario dinámicamente basándose en una configuración.

**Componentes principales:**

1. **Campos disponibles:**

   - `TextField` - Input de texto simple
   - `EmailField` - Input tipo email con validación
   - `PasswordField` - Input tipo password
   - `NumberField` - Input numérico
   - `DateField` - Selector de fecha
   - `TextAreaField` - Área de texto multilinea
   - `SelectField` - Dropdown de opciones
   - `RadioField` - Botones de radio
   - `CheckboxField` - Checkbox
   - `SwitchField` - Toggle switch
   - `SliderField` - Slider numérico

2. **FormFieldFactory** - Función factory

   ```typescript
   function createFormField(config: FieldConfig) {
     switch (config.type) {
       case 'text':
         return <TextField {...config} />;
       case 'email':
         return <EmailField {...config} />;
       case 'password':
         return <PasswordField {...config} />;
       case 'number':
         return <NumberField {...config} />;
       // ... más casos
       default:
         return null;
     }
   }
   ```

3. **FormRender** - Componente que usa la factory
   - Recibe un array de configuraciones
   - Usa la factory para crear cada campo
   - Renderiza un formulario completo dinámicamente

**Configuración de ejemplo:**

```typescript
const formConfig = [
  {
    type: 'text',
    name: 'username',
    label: 'Username',
    placeholder: 'Enter username',
    required: true
  },
  {
    type: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'your@email.com',
    required: true
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    minLength: 8
  },
  {
    type: 'select',
    name: 'country',
    label: 'Country',
    options: ['USA', 'Canada', 'Mexico']
  },
  {
    type: 'slider',
    name: 'age',
    label: 'Age',
    min: 18,
    max: 100
  }
];
```

**Uso:**

```tsx
function App() {
  return (
    <FormRender config={formConfig} />
  );
}

// Resultado: Formulario completo generado dinámicamente
```

**Flujo:**

1. Se define la configuración del formulario (puede venir de API)
2. `FormRender` itera sobre la configuración
3. Para cada campo, llama a la factory con la config
4. La factory crea el componente apropiado
5. Se renderiza el formulario completo

**Ventajas:**

- **Flexibilidad:** Formularios configurables sin código nuevo
- **Escalabilidad:** Fácil agregar nuevos tipos de campos
- **Mantenibilidad:** Lógica de creación centralizada
- **Reutilización:** Misma factory para múltiples formularios
- **Configuración externa:** Formularios desde JSON/API
- **Menos código:** Evita múltiples if/else o switch en componentes

**Variantes del patrón:**

1. **Factory Function:**

   ```typescript
   function createField(type: string) {
     // retorna componente
   }
   ```

2. **Factory Object:**

   ```typescript
   const fieldFactory = {
     text: TextField,
     email: EmailField,
     password: PasswordField
   };

   const Component = fieldFactory[type];
   ```

3. **Factory Class:**
   ```typescript
   class FormFieldFactory {
     static create(config: FieldConfig) {
       // lógica de creación
     }
   }
   ```

**Casos de uso reales:**

- **Form builders** - Formularios dinámicos
- **Dashboard widgets** - Widgets configurables
- **Content management** - Bloques de contenido dinámicos
- **Plugin systems** - Sistema extensible
- **A/B testing** - Variantes de componentes

**Cuándo usar:**
✅ Múltiples tipos de componentes similares
✅ Creación basada en configuración
✅ Necesidad de extensibilidad
✅ Renderizado dinámico desde datos

**Cuándo NO usar:**
❌ Solo 2-3 tipos diferentes
❌ Lógica de creación muy simple
❌ Componentes muy diferentes entre sí
❌ Agregar complejidad innecesaria
