# Bridge Pattern (Patrón Puente)

## Explicación Sencilla

El patrón Bridge separa una abstracción de su implementación, permitiendo que ambas varíen independientemente. Une dos jerarquías separadas a través de una "composición" en lugar de herencia.

**Analogía:** Es como un control remoto (abstracción) que puede funcionar con diferentes dispositivos (implementaciones): TV, aire acondicionado, proyector. El control remoto no cambia, pero puede trabajar con diferentes dispositivos.

## Uso en React

En React, este patrón es útil para:

- **Sistemas de notificaciones multi-canal** - Mismo mensaje por diferentes medios
- **Renderizado multi-plataforma** - Misma lógica en web, móvil, desktop
- **Temas personalizables** - Separar componentes de sus estilos
- **Exportadores de datos** - Mismos datos en diferentes formatos
- **Sistemas de logging** - Mismos logs a diferentes destinos

## Ejercicio Implementado

### Sistema de Notificaciones Multi-Canal

Se implementó un sistema donde diferentes tipos de notificaciones pueden enviarse a través de diferentes canales (Email, SMS, Push).

**Componentes principales:**

1. **NotificationChannel (Implementación)** - Interfaz para canales

   ```typescript
   interface NotificationChannel {
     send(message: string): void;
   }
   ```

2. **Canales concretos:**

   - **EmailChannel** - Envía por correo electrónico
   - **SMSChannel** - Envía por mensaje de texto
   - **PushChannel** - Envía notificación push

3. **Notifier (Abstracción)** - Clase base para notificadores

   - Contiene una referencia al canal (`channel`)
   - Método abstracto `notify(message)` que usa el canal
   - Los notificadores delegan el envío al canal

4. **Notificadores concretos:**
   - **BasicNotifier** - Notificación simple
   - **AlertNotifier** - Notificación urgente con prefijo "ALERT"
   - **SystemNotifier** - Notificación del sistema con timestamp

**Estructura:**

```
Abstracción (Notifier)        Implementación (Channel)
    |                              |
    |-- BasicNotifier              |-- EmailChannel
    |-- AlertNotifier              |-- SMSChannel
    |-- SystemNotifier             |-- PushChannel
```

**Flujo:**

1. Se crea un canal específico (Email, SMS, o Push)
2. Se crea un notificador con ese canal
3. El notificador procesa el mensaje (añade prefijos, timestamps, etc.)
4. El notificador delega el envío al canal
5. El canal envía el mensaje por su medio específico

**Ejemplo de uso:**

```typescript
// Notificación de alerta por email
const emailChannel = new EmailChannel();
const alertNotifier = new AlertNotifier(emailChannel);
alertNotifier.notify("Server down!");
// Envía: "ALERT: Server down!" por email

// Notificación del sistema por SMS
const smsChannel = new SMSChannel();
const systemNotifier = new SystemNotifier(smsChannel);
systemNotifier.notify("Backup completed");
// Envía: "[2024-12-04 10:30] Backup completed" por SMS

// Cambiar el canal sin cambiar el notificador
alertNotifier.channel = new PushChannel();
alertNotifier.notify("Critical update!");
// Ahora envía por push en lugar de email
```

**Ventajas:**

- Abstracción e implementación pueden evolucionar independientemente
- Evita explosión de clases (no necesitas AlertEmailNotifier, AlertSMSNotifier, etc.)
- Puedes cambiar el canal en tiempo de ejecución
- Fácil agregar nuevos tipos de notificaciones o canales
- Cumple con el principio Open/Closed
- Reduce el acoplamiento entre lógica de notificación y método de envío
- Más flexible que la herencia múltiple
