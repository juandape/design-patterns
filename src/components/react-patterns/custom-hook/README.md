# Custom Hook Pattern (Patrón de Hook Personalizado)

## Explicación Sencilla

El patrón Custom Hook permite extraer lógica de componentes y reutilizarla en múltiples lugares. Es una función que usa hooks de React y puede ser compartida entre componentes.

**Analogía:** Es como tener una receta de cocina. En lugar de recordar todos los pasos cada vez que cocinas, tienes la receta escrita que puedes consultar y reutilizar cuantas veces quieras.

## Uso en React

En React, este patrón es útil para:

- **Reutilización de lógica** - Compartir comportamiento entre componentes
- **Separación de responsabilidades** - Componentes más limpios
- **Testing** - Testear lógica independientemente de la UI
- **Organización** - Código más mantenible
- **Encapsulación** - Ocultar complejidad interna

## Ejercicio Implementado

### Hook de Lista Filtrada

Se implementó un custom hook que maneja el estado y la lógica de filtrado de una lista, reutilizable en cualquier componente.

**Componentes principales:**

1. **useFilteredList** - Hook personalizado

   ```typescript
   function useFilteredList<T>(
     initialItems: T[],
     filterFn: (item: T, query: string) => boolean
   ) {
     const [items, setItems] = useState(initialItems);
     const [query, setQuery] = useState('');

     const filteredItems = useMemo(
       () => items.filter(item => filterFn(item, query)),
       [items, query, filterFn]
     );

     return {
       items,
       filteredItems,
       query,
       setQuery,
       addItem,
       removeItem,
       clearFilter
     };
   }
   ```

2. **FilteredList** - Componente que usa el hook
   - Usa `useFilteredList` para manejar la lista
   - Solo se enfoca en renderizar la UI
   - Toda la lógica está en el hook
   - Muy simple y fácil de leer

**Funcionalidades del hook:**

- `items` - Lista completa de items
- `filteredItems` - Lista filtrada según el query
- `query` - Texto de búsqueda actual
- `setQuery` - Actualizar el query de búsqueda
- `addItem` - Agregar un nuevo item
- `removeItem` - Eliminar un item
- `clearFilter` - Limpiar el filtro

**Ejemplo de uso:**

```tsx
function ProductList() {
  const {
    filteredItems,
    query,
    setQuery,
    addItem,
    removeItem
  } = useFilteredList(
    products,
    (product, query) =>
      product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products..."
      />

      {filteredItems.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onRemove={() => removeItem(product.id)}
        />
      ))}
    </div>
  );
}
```

**Reutilización en diferentes contextos:**

```tsx
// Lista de usuarios
function UserList() {
  const { filteredItems, query, setQuery } = useFilteredList(
    users,
    (user, query) =>
      user.name.includes(query) || user.email.includes(query)
  );
  // ... renderizado
}

// Lista de tareas
function TodoList() {
  const { filteredItems, query, setQuery } = useFilteredList(
    todos,
    (todo, query) =>
      todo.title.includes(query) && !todo.completed
  );
  // ... renderizado
}
```

**Ventajas:**

- **Reutilización:** Mismo hook en múltiples componentes
- **Limpieza:** Componentes solo se enfocan en UI
- **Testing:** Hook se puede testear independientemente
- **Mantenibilidad:** Lógica centralizada en un lugar
- **Composición:** Hooks se pueden combinar
- **TypeScript:** Tipo genérico para máxima flexibilidad
- **Performance:** Usa `useMemo` para optimizar filtrado

**Reglas de los Custom Hooks:**

1. **Nombre:** Debe empezar con "use" (useFilteredList, useAuth, etc.)
2. **Solo en componentes o hooks:** No en funciones regulares
3. **Top level:** No dentro de loops, condiciones o funciones anidadas
4. **Pueden usar otros hooks:** useState, useEffect, useContext, etc.

**Patrones comunes de Custom Hooks:**

- `useAuth()` - Manejo de autenticación
- `useFetch()` - Fetching de datos
- `useLocalStorage()` - Persistencia local
- `useDebounce()` - Debouncing de valores
- `useWindowSize()` - Dimensiones de ventana
- `useForm()` - Manejo de formularios

**Cuándo crear un Custom Hook:**
✅ Lógica compartida entre componentes
✅ Componentes muy complejos que necesitan limpieza
✅ Abstracción de APIs de terceros
✅ Lógica que se testea independientemente

**Cuándo NO crear un Custom Hook:**
❌ Lógica usada en un solo lugar
❌ Simplemente por "organización" sin reutilización
❌ Agregar complejidad innecesaria
