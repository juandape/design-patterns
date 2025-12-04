# Compound Components Pattern (Patrón de Componentes Compuestos)

## Explicación Sencilla

El patrón Compound Components permite crear componentes que trabajan juntos compartiendo estado implícito. Es como una "familia" de componentes que se comunican entre sí automáticamente.

**Analogía:** Es como las piezas de un rompecabezas. Cada pieza funciona de forma independiente, pero juntas forman una imagen completa. No necesitas indicarle a cada pieza dónde va, ellas "saben" cómo trabajar juntas.

## Uso en React

En React, este patrón es muy útil para:

- **Componentes de UI complejos** - Modals, Dropdowns, Tabs, Accordions
- **Formularios flexibles** - Grupos de campos relacionados
- **Layouts configurables** - Componentes que se adaptan según sus hijos
- **APIs declarativas** - Interfaces intuitivas y legibles
- **Componentes reutilizables** - Máxima flexibilidad de composición

## Ejercicio Implementado

### Modal con Componentes Compuestos

Se implementó un sistema de modal donde diferentes partes (trigger, contenido, close) trabajan juntas sin pasar props explícitamente.

**Componentes principales:**

1. **ModalContext** - Contexto compartido

   - Estado: `isOpen` (boolean)
   - Funciones: `open()`, `close()`, `toggle()`
   - Compartido implícitamente entre todos los componentes hijos

2. **ModalProvider** - Proveedor del contexto

   - Maneja el estado del modal
   - Envuelve todos los componentes del modal
   - Proporciona el contexto a los hijos

3. **Modal** - Componente padre (compound component)

   - Subcomponentes estáticos:
     - `Modal.Trigger` - Botón para abrir el modal
     - `Modal.Content` - Contenido del modal
     - `Modal.Close` - Botón para cerrar el modal
   - No pasa props explícitas a los hijos
   - Los hijos acceden al contexto automáticamente

4. **Modal.Trigger** - Componente trigger

   - Usa `useModal()` para acceder al contexto
   - Llama a `open()` al hacer click
   - Puede ser cualquier elemento (button, div, etc.)

5. **Modal.Content** - Componente de contenido

   - Se muestra solo cuando `isOpen === true`
   - Renderiza un overlay y el contenido
   - Puede contener cualquier cosa

6. **Modal.Close** - Componente close
   - Usa `useModal()` para acceder al contexto
   - Llama a `close()` al hacer click
   - Generalmente un botón con "X"

**Uso del patrón:**

```tsx
<Modal>
  <Modal.Trigger>
    <button>Open Modal</button>
  </Modal.Trigger>

  <Modal.Content>
    <h2>Modal Title</h2>
    <p>Modal content goes here...</p>

    <Modal.Close>
      <button>Close</button>
    </Modal.Close>
  </Modal.Content>
</Modal>
```

**Flujo:**

1. `Modal` envuelve todo en un `ModalProvider`
2. Usuario hace click en `Modal.Trigger`
3. El trigger llama a `open()` del contexto
4. `Modal.Content` detecta el cambio de `isOpen` y se muestra
5. Usuario hace click en `Modal.Close`
6. El close llama a `close()` del contexto
7. `Modal.Content` se oculta

**Ventajas:**

- API declarativa y fácil de entender
- Flexibilidad total en la composición
- Estado compartido implícito (sin prop drilling)
- Componentes altamente reutilizables
- Separación de responsabilidades clara
- Fácil de extender con nuevos subcomponentes
- Código más limpio y mantenible
- Patrones similares a HTML nativo (como `<select>` y `<option>`)

**Comparación:**

❌ **Sin Compound Components:**

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  trigger={<button>Open</button>}
  content={<div>Content</div>}
  closeButton={<button>Close</button>}
/>
```

✅ **Con Compound Components:**

```tsx
<Modal>
  <Modal.Trigger><button>Open</button></Modal.Trigger>
  <Modal.Content><div>Content</div></Modal.Content>
  <Modal.Close><button>Close</button></Modal.Close>
</Modal>
```

Mucho más legible, flexible y escalable.
