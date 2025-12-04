# Render Props Pattern (Patrón de Render Props)

## Explicación Sencilla

El patrón Render Props es una técnica para compartir lógica entre componentes usando una prop cuyo valor es una función. El componente llama a esta función pasándole datos, y la función retorna qué renderizar.

**Analogía:** Es como un chef que te da los ingredientes preparados (datos) y tú decides cómo presentar el plato final. El chef hace el trabajo pesado, pero tú decides cómo se ve.

## Uso en React

En React, este patrón es útil para:

- **Compartir lógica sin HOCs** - Alternativa a Higher-Order Components
- **Máxima flexibilidad de renderizado** - El consumidor decide cómo renderizar
- **Componentes reutilizables** - Misma lógica, múltiples presentaciones
- **Inversión de control** - El padre controla el renderizado
- **Composición avanzada** - Combinar comportamientos

## Ejercicio Implementado

### Toggle con Render Props

Se implementó un componente Toggle que maneja el estado de encendido/apagado, pero permite al consumidor decidir cómo renderizarlo.

**Componente principal:**

```typescript
interface ToggleProps {
  children: (props: {
    on: boolean;
    toggle: () => void;
    setOn: (value: boolean) => void;
  }) => React.ReactNode;
}

function Toggle({ children }: ToggleProps) {
  const [on, setOn] = useState(false);

  const toggle = () => setOn(!on);

  return <>{children({ on, toggle, setOn })}</>;
}
```

**Ejemplos de uso:**

**1. Toggle simple:**

```tsx
<Toggle>
  {({ on, toggle }) => (
    <div>
      <p>The button is {on ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  )}
</Toggle>
```

**2. Switch visual:**

```tsx
<Toggle>
  {({ on, toggle }) => (
    <div className="flex items-center">
      <span className="mr-2">Dark Mode</span>
      <div
        onClick={toggle}
        className={`w-12 h-6 rounded-full ${
          on ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full bg-white transition-transform ${
            on ? 'transform translate-x-6' : ''
          }`}
        />
      </div>
    </div>
  )}
</Toggle>
```

**3. Modal controlado:**

```tsx
<Toggle>
  {({ on, toggle }) => (
    <>
      <button onClick={toggle}>Open Modal</button>
      {on && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={toggle}>Close</button>
        </div>
      )}
    </>
  )}
</Toggle>
```

**4. Dropdown menu:**

```tsx
<Toggle>
  {({ on, toggle, setOn }) => (
    <div className="dropdown">
      <button onClick={toggle}>Menu ▼</button>
      {on && (
        <ul className="menu">
          <li onClick={() => { handleAction1(); setOn(false); }}>
            Option 1
          </li>
          <li onClick={() => { handleAction2(); setOn(false); }}>
            Option 2
          </li>
        </ul>
      )}
    </div>
  )}
</Toggle>
```

**Flujo:**

1. Componente Toggle maneja el estado interno
2. Llama a la función `children` pasando el estado y funciones
3. La función retorna el JSX a renderizar
4. Toggle renderiza el resultado
5. Usuario interactúa → actualiza estado → re-renderiza

**Ventajas:**

- **Máxima flexibilidad:** El consumidor controla totalmente el renderizado
- **Reutilización de lógica:** Misma lógica, múltiples UIs
- **Composición:** Fácil combinar con otros patrones
- **Sin naming collisions:** No hay conflictos de props
- **TypeScript friendly:** Tipos claros para los parámetros
- **Inversion of Control:** El padre tiene el control

**Variantes del patrón:**

**1. Render Prop (función como prop):**

```tsx
<Toggle
  render={({ on, toggle }) => (
    <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
  )}
/>
```

**2. Children as function:**

```tsx
<Toggle>
  {({ on, toggle }) => (
    <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
  )}
</Toggle>
```

**3. Component injection:**

```tsx
<DataProvider
  component={DataDisplay}
  data={data}
/>
```

**Comparación con Custom Hooks:**

| Feature           | Render Props | Custom Hooks       |
| ----------------- | ------------ | ------------------ |
| Sintaxis          | JSX anidado  | Llamada de función |
| Legibilidad       | Media        | Alta               |
| Composición       | Anidamiento  | Lineal             |
| TypeScript        | Bueno        | Excelente          |
| Curva aprendizaje | Media        | Baja               |
| Uso actual        | Menos común  | Muy común          |

**Nota:** Desde React Hooks, los Custom Hooks son generalmente preferidos sobre Render Props por su sintaxis más limpia, pero Render Props sigue siendo útil en casos específicos.

**Cuándo usar Render Props:**
✅ Necesitas máxima flexibilidad de renderizado
✅ Componente usado con muchas variaciones visuales
✅ Quieres que el consumidor controle completamente la UI
✅ Compatibilidad con componentes de clase

**Cuándo usar Custom Hooks en su lugar:**
✅ Solo necesitas compartir lógica
✅ No requieres control de renderizado
✅ Quieres código más limpio
✅ Solo trabajas con componentes funcionales
