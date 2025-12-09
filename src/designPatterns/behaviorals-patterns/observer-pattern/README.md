# Observer Pattern (Patrón Observador)

## Explicación Sencilla

El patrón Observer permite que un objeto (llamado "sujeto") notifique automáticamente a otros objetos (llamados "observadores") cuando algo cambia. Es como una lista de suscriptores: cuando ocurre un evento, todos los suscriptores reciben la noticia.

**Analogía:** Es como suscribirse a un canal de YouTube. Cuando el canal sube un nuevo video, todos los suscriptores reciben una notificación.

## Uso en React

En React, este patrón es muy útil para:

- **Sistemas de notificaciones** - Mostrar alertas o mensajes en múltiples componentes
- **Estado global** - Compartir información entre componentes sin prop drilling
- **Eventos personalizados** - Comunicación entre componentes no relacionados
- **Actualizaciones en tiempo real** - Chat, notificaciones push, etc.

## Ejercicio Implementado

### Sistema de Notificaciones

Se implementó un sistema donde varios componentes pueden suscribirse a notificaciones y recibirlas cuando se envían.

**Componentes principales:**

1. **NotificationService** - El sujeto que gestiona observadores

   - `subscribe()` - Agrega observadores a la lista
   - `unsubscribe()` - Elimina observadores de la lista
   - `notify()` - Envía mensajes a todos los observadores

2. **NotificationObserver** - Componente que se suscribe y muestra mensajes

   - Se suscribe al servicio cuando se monta
   - Se desuscribe cuando se desmonta
   - Actualiza su estado cuando recibe notificaciones

3. **NotificationSender** - Componente que envía notificaciones
   - Input para escribir mensajes personalizados
   - Botón para enviar notificaciones a todos los observadores

**Flujo:**

1. Los observadores se suscriben al servicio singleton
2. El sender envía un mensaje a través del servicio
3. Todos los observadores reciben y muestran el mensaje

**Ventajas:**

- Desacoplamiento: los observadores no conocen al emisor
- Escalabilidad: puedes agregar/quitar observadores fácilmente
- Reusabilidad: el servicio puede usarse en toda la aplicación
