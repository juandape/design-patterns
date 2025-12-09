# Decorator Pattern (Patrón Decorador)

## Explicación Sencilla

El patrón Decorator permite agregar funcionalidades a un objeto dinámicamente sin modificar su estructura. Los decoradores "envuelven" el objeto original añadiendo comportamiento antes o después de delegar al objeto envuelto.

**Analogía:** Es como vestirse. Empiezas con ropa básica (objeto base) y le agregas accesorios (decoradores): un reloj, una chaqueta, lentes, etc. Cada accesorio añade algo sin cambiar la ropa base.

## Uso en React

En React, este patrón es útil para:

- **HOCs (Higher-Order Components)** - Componentes que envuelven otros
- **Middlewares** - Agregar logging, caching, validación
- **Pipelines de procesamiento** - Transformaciones en cadena
- **Notificaciones con múltiples canales** - Agregar canales dinámicamente
- **Features flags** - Activar/desactivar funcionalidades

## Ejercicio Implementado

### Sistema de Notificaciones con Decoradores

Se implementó un sistema donde se puede agregar funcionalidades a las notificaciones (email, SMS, logging) de forma dinámica.

**Componentes principales:**

1. **Notification (Interfaz)** - Define el contrato

   ```typescript
   interface Notification {
     send(message: string): void;
   }
   ```

2. **BaseNotification** - Implementación base

   - Funcionalidad básica de notificación
   - Solo muestra el mensaje en consola
   - Punto de partida para decoradores

3. **EmailDecorator** - Decorador para email

   - Envuelve una notificación existente
   - Agrega funcionalidad de envío por email
   - Llama al componente envuelto después

4. **SMSDecorator** - Decorador para SMS

   - Envuelve una notificación existente
   - Agrega funcionalidad de envío por SMS
   - Llama al componente envuelto después

5. **LoggingDecorator** - Decorador para logging

   - Envuelve una notificación existente
   - Agrega registro de logs
   - Llama al componente envuelto después

6. **NotificationService** - Servicio que usa decoradores
   - Construye la cadena de decoradores dinámicamente
   - Permite combinar múltiples decoradores
   - Delega al objeto decorado

**Flujo:**

1. Se crea una notificación base
2. Se envuelve con decoradores según sea necesario
3. Cada decorador agrega su funcionalidad
4. Al llamar `send()`, se ejecutan todos los decoradores en orden
5. Finalmente se ejecuta la notificación base

**Ejemplo de uso:**

```typescript
// Notificación simple
let notification = new BaseNotification();
notification.send("Hello");
// Output: "Notification: Hello"

// Agregar email
notification = new EmailDecorator(notification);
notification.send("Hello");
// Output:
// "Sending email: Hello"
// "Notification: Hello"

// Agregar SMS y logging
notification = new SMSDecorator(notification);
notification = new LoggingDecorator(notification);
notification.send("Hello");
// Output:
// "Logging: Hello"
// "Sending SMS: Hello"
// "Sending email: Hello"
// "Notification: Hello"
```

**Ventajas:**

- Agrega responsabilidades sin modificar el objeto original
- Más flexible que la herencia
- Puedes combinar decoradores de diferentes formas
- Agregar/quitar funcionalidades en tiempo de ejecución
- Cumple con el principio Single Responsibility
- Cumple con el principio Open/Closed
- Fácil testear cada decorador independientemente
