# Adapter Pattern (Patrón Adaptador) - React

## Explicación Sencilla

El patrón Adapter permite que interfaces incompatibles trabajen juntas. Actúa como un traductor entre dos interfaces diferentes.

**Analogía:** Es como un adaptador de enchufe cuando viajas a otro país. Tu dispositivo tiene un tipo de enchufe, pero el tomacorriente es diferente. El adaptador traduce entre ambos.

## Uso en React

En React, este patrón es muy útil para:

- **APIs de terceros** - Adaptar respuestas de APIs externas a tu formato interno
- **Migración de código** - Usar componentes legacy con nueva arquitectura
- **Integración de librerías** - Adaptar interfaces de librerías externas
- **Múltiples fuentes de datos** - Unificar formatos diferentes
- **Normalización de datos** - Convertir datos externos a formato consistente

## Ejercicio Implementado

### Adaptador de Órdenes de E-commerce

Se implementó un adaptador que transforma la respuesta de una API externa al formato que espera nuestra aplicación.

**Componentes principales:**

1. **OrderResponse** - Formato de la API externa

   ```typescript
   {
     order_id: string;
     customer_name: string;
     items_list: Array<{
       product_name: string;
       quantity: number;
       price: number;
     }>;
     total_amount: number;
     order_status: string;
   }
   ```

2. **Order** - Formato interno de nuestra app

   ```typescript
   {
     id: string;
     customerName: string;
     items: Array<{
       name: string;
       quantity: number;
       price: number;
     }>;
     total: number;
     status: string;
   }
   ```

3. **OrderAdapter** - Adaptador que transforma

   - Método `adapt(orderResponse)` que convierte el formato externo al interno
   - Mapea campos: `order_id` → `id`, `items_list` → `items`, etc.
   - Transforma arrays anidados manteniendo la estructura
   - Retorna un objeto `Order` consistente

4. **useOrder Hook** - Hook personalizado

   - Obtiene datos de la API
   - Usa el adaptador para transformar la respuesta
   - Retorna datos en formato interno
   - Maneja loading y errores

5. **OrderDetails** - Componente React
   - Usa el hook `useOrder` para obtener datos
   - Muestra la orden en formato consistente
   - No sabe nada sobre el formato de la API externa

**Flujo:**

```
API Externa → OrderResponse → Adapter → Order → Componente
(snake_case)                               (camelCase)
```

**Ejemplo de transformación:**

```typescript
// Respuesta de la API
const apiResponse = {
  order_id: "12345",
  customer_name: "John Doe",
  items_list: [
    { product_name: "Laptop", quantity: 1, price: 1200 }
  ],
  total_amount: 1200,
  order_status: "pending"
};

// Después del adaptador
const order = {
  id: "12345",
  customerName: "John Doe",
  items: [
    { name: "Laptop", quantity: 1, price: 1200 }
  ],
  total: 1200,
  status: "pending"
};
```

**Ventajas:**

- Desacoplamiento de APIs externas
- Fácil cambiar el proveedor de datos sin afectar componentes
- Formato consistente en toda la aplicación
- Facilita testing (mock del adaptador en lugar de la API)
- Punto único de transformación de datos
- Migración gradual de sistemas legacy
- Cumple con el principio Single Responsibility
