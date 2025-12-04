# Context + Reducer Pattern (Patrón Contexto + Reductor)

## Explicación Sencilla

El patrón Context + Reducer combina el Context API de React con useReducer para manejar estado global complejo. Es como Redux pero integrado en React, sin librerías externas.

**Analogía:** Es como un banco. El contexto es el "acceso al banco" (todos pueden usar sus servicios), y el reducer es el "cajero automático" (procesa todas las transacciones de forma predecible y centralizada).

## Uso en React

En React, este patrón es útil para:

- **Estado global complejo** - Múltiples componentes necesitan acceso
- **Lógica de estado compartida** - Evitar prop drilling
- **Acciones predecibles** - Todas las actualizaciones pasan por el reducer
- **Aplicaciones medianas** - Cuando Context simple ya no es suficiente
- **Alternativa a Redux** - Sin dependencias externas

## Ejercicio Implementado

### Carrito de Compras con Context + Reducer

Se implementó un carrito de compras completo con manejo de estado global usando Context y Reducer.

**Componentes principales:**

1. **CartReducer** - Reductor que maneja las acciones

   ```typescript
   function cartReducer(state, action) {
     switch (action.type) {
       case 'ADD_ITEM':
         // Lógica para agregar item
       case 'REMOVE_ITEM':
         // Lógica para eliminar item
       case 'UPDATE_QUANTITY':
         // Lógica para actualizar cantidad
       case 'CLEAR_CART':
         // Lógica para vaciar carrito
       default:
         return state;
     }
   }
   ```

2. **CartContext** - Contexto que expone el estado y dispatch

   ```typescript
   const CartContext = createContext({
     state: initialState,
     dispatch: () => {}
   });
   ```

3. **CartProvider** - Proveedor que envuelve la app

   - Usa `useReducer` para manejar el estado
   - Proporciona `state` y `dispatch` a todos los hijos
   - Centraliza toda la lógica del carrito

4. **useCart Hook** - Hook personalizado

   - Consume el `CartContext`
   - Proporciona funciones helper:
     - `addItem(item)`
     - `removeItem(id)`
     - `updateQuantity(id, quantity)`
     - `clearCart()`
     - `getTotal()`
   - Encapsula el uso de dispatch

5. **CartDemo** - Componente principal
   - Lista de productos disponibles
   - Carrito con items agregados
   - Total del carrito
   - Usa `useCart()` para todas las operaciones

**Estructura de archivos:**

```
context-reducer/
├── context/
│   └── cartContext.tsx      # Definición del contexto
├── provider/
│   └── cartProvider.tsx     # Proveedor con reducer
├── reducer/
│   └── cartReducer.ts       # Lógica del reducer
├── hooks/
│   └── useCart.tsx          # Hook personalizado
├── types/
│   └── item.type.ts         # Tipos TypeScript
└── CartDemo.tsx             # Componente demo
```

**Flujo:**

```
Componente → useCart() → dispatch(action) → Reducer → Nuevo State → Re-render
```

**Ejemplo de uso:**

```tsx
function ProductList() {
  const { addItem, cart, getTotal } = useCart();

  return (
    <div>
      <button onClick={() => addItem({ id: 1, name: 'Laptop', price: 1200 })}>
        Add Laptop
      </button>

      <h3>Cart Items: {cart.items.length}</h3>
      <h3>Total: ${getTotal()}</h3>
    </div>
  );
}

// En App.tsx
function App() {
  return (
    <CartProvider>
      <ProductList />
      <Cart />
      <Checkout />
    </CartProvider>
  );
}
```

**Acciones disponibles:**

- `ADD_ITEM` - Agrega un item al carrito
- `REMOVE_ITEM` - Elimina un item del carrito
- `UPDATE_QUANTITY` - Actualiza la cantidad de un item
- `CLEAR_CART` - Vacía el carrito completamente

**Ventajas:**

- **Predecibilidad:** Todas las actualizaciones pasan por el reducer
- **Centralización:** Lógica de estado en un solo lugar
- **Escalabilidad:** Fácil agregar nuevas acciones
- **Testing:** Reducer es una función pura, fácil de testear
- **DevTools:** Compatible con React DevTools
- **TypeScript friendly:** Tipos para acciones y estado
- **Sin dependencias:** Solo React nativo

**Comparación con alternativas:**

| Feature           | useState | Context + Reducer | Redux  |
| ----------------- | -------- | ----------------- | ------ |
| Complejidad       | Baja     | Media             | Alta   |
| Estado global     | ❌       | ✅                | ✅     |
| DevTools          | ❌       | Limitado          | ✅     |
| Middleware        | ❌       | ❌                | ✅     |
| Curva aprendizaje | Baja     | Media             | Alta   |
| Bundle size       | 0 KB     | 0 KB              | ~10 KB |

**Cuándo usar:**
✅ Estado global complejo
✅ Múltiples componentes acceden al mismo estado
✅ Lógica de actualización compleja
✅ No quieres agregar Redux

**Cuándo NO usar:**
❌ Estado local simple
❌ Solo 2-3 componentes necesitan el estado
❌ No hay lógica compleja de actualización
