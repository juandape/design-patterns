# Redux Toolkit

## Explicación Sencilla

Redux Toolkit es la forma oficial y recomendada de escribir lógica de Redux. Simplifica la configuración del store, reduce el código repetitivo (boilerplate) y aplica las mejores prácticas automáticamente.

**Analogía:** Es como un banco central donde guardas todo tu dinero (estado global). Cualquier sucursal (componente) puede consultar el saldo o hacer transacciones, pero todas las operaciones pasan por el banco central para mantener un registro consistente.

## Conceptos Clave

### Store

El contenedor centralizado que almacena todo el estado de tu aplicación. Es la "única fuente de verdad".

### Slice

Una porción del estado global con su lógica relacionada (reducers y actions). Cada slice maneja una funcionalidad específica.

### Reducer

Función pura que determina cómo cambia el estado en respuesta a una acción. Recibe el estado actual y una acción, retorna el nuevo estado.

### Action

Objeto que describe un cambio que quieres hacer en el estado. Redux Toolkit los genera automáticamente.

### Dispatch

Función que envía (dispara) una acción al store para actualizar el estado.

### Selector

Función que extrae datos específicos del estado global. Usa `useSelector` para leerlos en componentes.

## Diferencias: Redux vs Redux Toolkit

| Redux Clásico           | Redux Toolkit               |
| ----------------------- | --------------------------- |
| 50+ líneas de código    | 15-20 líneas                |
| Switch/case en reducers | Objeto con funciones        |
| Action types manuales   | Autogenerados               |
| Spread operators (...)  | "Mutación" directa (Immer)  |
| 3+ paquetes a instalar  | 1 paquete todo-en-uno       |
| Configuración manual    | `configureStore` automático |

## Uso en React

Redux Toolkit es útil para:

- **Estado global compartido** - Datos que múltiples componentes necesitan
- **Estado complejo** - Datos con muchas actualizaciones y relaciones
- **Estado persistente** - Datos que deben sobrevivir navegación/recargas
- **Debugging** - Redux DevTools para ver historial de cambios
- **Testing** - Lógica de estado aislada y testeable

## Ejercicio Implementado

### Sistema de Gestión de Tareas (To-Do List)

Se implementó una aplicación de tareas donde los usuarios pueden agregar, eliminar y marcar tareas como completadas.

**Componentes principales:**

1. **tasksSlice.ts** - Slice de tareas

   - Define la interfaz `Task` (id, title, completed)
   - Estado inicial: array vacío de tareas
   - **Reducers:**
     - `addTask` - Agrega nueva tarea al estado
     - `removeTask` - Filtra y elimina tarea por id
     - `toggleTaskCompletion` - Cambia estado completed
   - Exporta actions y reducer automáticamente

2. **store.ts** - Configuración del store

   - Usa `configureStore` de Redux Toolkit
   - Registra el slice de tareas
   - Exporta tipos `RootState` y `AppDispatch` para TypeScript
   - Configura automáticamente DevTools y middleware

3. **hooks.ts** - Hooks tipados personalizados

   - `useAppDispatch` - Hook tipado para dispatch
   - `useAppSelector` - Hook tipado para seleccionar estado
   - Proporciona autocompletado completo en TypeScript

4. **ReduxProvider.tsx** - Proveedor de contexto

   - Client Component para Next.js
   - Envuelve la app con el Provider de react-redux
   - Hace el store disponible en toda la aplicación

5. **AddTasks.tsx** - Componente para agregar tareas

   - Formulario con input controlado
   - Genera id único con `Date.now()`
   - Despacha action `addTask` al submit
   - Limpia input después de agregar

6. **TasksList.tsx** - Componente de lista de tareas
   - Lee tareas del estado con `useAppSelector`
   - Mapea y renderiza cada tarea
   - Click en tarea: toggleTaskCompletion
   - Botón remove: removeTask
   - Estilo condicional según estado completed

**Flujo de datos:**

1. Usuario escribe título en input (estado local)
2. Al enviar form, dispatch(addTask) envía acción
3. Reducer procesa acción y actualiza estado global
4. useAppSelector detecta cambio y re-renderiza TasksList
5. Nueva tarea aparece en la lista automáticamente

**Ventajas:**

- Estado predecible y centralizado
- Fácil debugging con Redux DevTools
- Código más limpio que useState para estado complejo
- TypeScript proporciona seguridad de tipos
- Componentes desacoplados del estado
- Lógica de negocio separada de la UI
- Fácil agregar nuevas funcionalidades (filtros, edición, etc.)

## Flujo Completo de Redux

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ 1. dispatch(action)
       ▼
┌─────────────┐
│    Store    │
└──────┬──────┘
       │ 2. llama reducer
       ▼
┌─────────────┐
│   Reducer   │
└──────┬──────┘
       │ 3. retorna nuevo estado
       ▼
┌─────────────┐
│    Store    │ (actualizado)
└──────┬──────┘
       │ 4. notifica cambios
       ▼
┌─────────────┐
│  Component  │ (re-renderiza)
└─────────────┘
```

## Conceptos Avanzados

### 1. Persistencia con localStorage

**¿Qué es?**
Técnica para guardar el estado de Redux en el almacenamiento local del navegador, permitiendo que los datos persistan entre recargas de página y sesiones.

**Implementación:**

- **Hidratación inicial** - Cargar estado desde localStorage al inicializar
- **Middleware de sincronización** - Guardar automáticamente cada cambio
- **Manejo de errores** - Try/catch para casos donde localStorage no está disponible

**Beneficios:**

- Mejora la experiencia del usuario (datos no se pierden)
- Útil para preferencias, carritos de compra, sesiones
- No requiere backend para persistencia básica

### 2. Acciones Asíncronas (createAsyncThunk)

**¿Qué es?**
Función de Redux Toolkit para manejar operaciones asíncronas como llamadas API, con estados de loading, success y error incluidos.

**Casos de uso:**

- Fetch de datos desde APIs REST
- Operaciones con bases de datos
- Autenticación con tokens
- Subida de archivos

**Estados generados automáticamente:**

- `pending` - Mientras la operación está en progreso
- `fulfilled` - Cuando la operación fue exitosa
- `rejected` - Cuando ocurrió un error

**Ventajas:**

- Manejo automático de estados de carga
- Cancelación de peticiones
- Retry automático
- TypeScript completamente tipado

### 3. Múltiples Slices

**¿Qué es?**
Estrategia de organización donde divides tu estado global en múltiples slices independientes, cada uno manejando su propia funcionalidad.

**Ejemplo de estructura:**

```
store
├── tasksSlice (tareas)
├── usersSlice (usuarios)
├── authSlice (autenticación)
└── uiSlice (estado de UI)
```

**Beneficios:**

- Código más organizado y mantenible
- Separación de responsabilidades
- Fácil testing de funcionalidades aisladas
- Equipos pueden trabajar en slices diferentes

### 4. Redux DevTools

**¿Qué es?**
Extensión de navegador que permite inspeccionar, depurar y viajar en el tiempo a través de los estados de Redux.

**Características principales:**

- **Time-travel debugging** - Navega hacia adelante/atrás en el historial
- **Inspector de acciones** - Ve todas las acciones despachadas
- **State diff** - Compara estados antes/después de cada acción
- **Dispatch manual** - Prueba acciones directamente desde DevTools
- **Persistencia** - Exporta/importa estado para debugging

**Uso:**
Redux Toolkit lo configura automáticamente con `configureStore`. Solo necesitas instalar la extensión del navegador.

## Próximos Pasos de Aprendizaje

1. ✅ **Persistencia** - Guardar estado en localStorage
2. ✅ **Async Thunks** - Manejar llamadas API con `createAsyncThunk`
3. ✅ **Múltiples Slices** - Separar estado por funcionalidad
4. ✅ **Redux DevTools** - Explorar el historial de acciones en el navegador
5. **Selectors Memoizados** - Optimizar con `createSelector` de Reselect
6. **RTK Query** - Fetching y caching de datos simplificado
7. **Entity Adapter** - Normalización de datos para colecciones
