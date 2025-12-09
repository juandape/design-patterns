# State Pattern (Patrón Estado)

## Explicación Sencilla

El patrón State permite que un objeto cambie su comportamiento cuando su estado interno cambia. Es como si el objeto cambiara de clase.

**Analogía:** Un reproductor de música tiene diferentes estados:

- **Pausado:** Si presionas play → reproduce
- **Reproduciendo:** Si presionas pause → pausa
- **Detenido:** Si presionas play → reproduce desde el inicio

Cada estado tiene comportamientos diferentes para las mismas acciones.

## Uso en React

En React, este patrón es útil para:

- **Flujos de formularios** - Wizard con múltiples pasos
- **Estados de pedidos** - Pendiente → Procesando → Enviado → Entregado
- **Máquinas de estado** - Autenticación, juegos, workflows
- **Componentes con comportamiento dinámico** - Diferentes acciones según el estado
- **Procesos de varios pasos** - Checkout, onboarding, etc.

## Ejercicio Implementado

### Sistema de Seguimiento de Pedidos

Se implementó un seguidor de pedidos donde cada estado tiene transiciones específicas.

**Componentes principales:**

1. **Order** - Clase contexto

   - Mantiene el estado actual del pedido
   - Delega acciones (`next()`, `prev()`, `getStatus()`) al estado actual
   - Permite cambiar de estado con `setState()`

2. **PendingState** - Estado inicial

   - `next()` → Cambia a ProcessingState
   - `prev()` → No hace nada (es el primer estado)
   - `getStatus()` → "Pending"

3. **ProcessingState** - Estado de procesamiento

   - `next()` → Cambia a ShippedState
   - `prev()` → Regresa a PendingState
   - `getStatus()` → "Processing"

4. **ShippedState** - Estado de envío

   - `next()` → Cambia a DeliveredState
   - `prev()` → Regresa a ProcessingState
   - `getStatus()` → "Shipped"

5. **DeliveredState** - Estado final

   - `next()` → No hace nada (es el último estado)
   - `prev()` → Regresa a ShippedState
   - `getStatus()` → "Delivered"

6. **OrderTracker** - Componente React
   - Crea una instancia de Order con estado inicial
   - Botones "Next" y "Previous" para cambiar estados
   - Muestra el estado actual del pedido

**Flujo:**

```
Pending → Processing → Shipped → Delivered
```

Cada transición es manejada por el estado correspondiente, no por el contexto.

**Ventajas:**

- Cada estado encapsula su propio comportamiento
- Fácil agregar nuevos estados
- Las transiciones están claramente definidas
- Código más limpio que múltiples `if/else`
- Cumple con el principio Open/Closed
