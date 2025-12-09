# Mediator Pattern (Patrón Mediador)

## Explicación Sencilla

El patrón Mediator define un objeto que encapsula cómo un conjunto de objetos interactúan entre sí. En lugar de que los objetos se comuniquen directamente (lo que crea dependencias complicadas), todos se comunican a través del mediador.

**Analogía:** Es como un **controlador de tráfico aéreo**:

- Los aviones no se comunican directamente entre sí
- Todos hablan con la torre de control
- La torre coordina todo y evita colisiones

## Uso en React

En React, este patrón es útil para:

- **Chat rooms** - Usuarios que se envían mensajes a través de un servidor
- **Formularios complejos** - Campos que se afectan entre sí
- **Sistemas de notificaciones** - Componentes que notifican eventos a otros
- **Coordinación de componentes** - Sin prop drilling excesivo
- **Event buses** - Sistema centralizado de eventos

## Ejercicio Implementado

### Sistema de Chat Room

Se implementó un chat estilo WhatsApp donde varios usuarios pueden enviar mensajes, pero todos se comunican a través de un mediador (ChatRoom).

**Componentes principales:**

1. **User** - Interfaz para usuarios

   - `name` - Nombre del usuario
   - `send(message)` - Enviar un mensaje
   - `receive(message, from)` - Recibir un mensaje de otro usuario

2. **ChatRoom** - Mediador central

   - Mantiene la lista de usuarios registrados
   - `register(user)` - Agrega un usuario al chat
   - `sendMessage(message, from)` - Distribuye el mensaje a todos excepto al remitente
   - Coordina toda la comunicación entre usuarios

3. **ChatUser** - Implementación concreta de User

   - Recibe referencia al ChatRoom en el constructor
   - `send()` delega al mediador
   - `receive()` procesa mensajes recibidos mediante callback
   - No conoce a otros usuarios directamente

4. **ChatRoomComponent** - Componente React (estilo WhatsApp)
   - Selector para elegir el usuario activo
   - Input para escribir mensajes
   - Área de chat con burbujas de mensajes
   - Mensajes recibidos (izquierda, fondo blanco)
   - Mensajes enviados (derecha, fondo azul)
   - Diseño moderno con Tailwind CSS

**Flujo:**

1. Se crean usuarios (Alice, Bob, Charlie)
2. Todos se registran en el ChatRoom
3. Alice envía un mensaje a través del mediador
4. El mediador distribuye el mensaje a Bob y Charlie
5. Bob y Charlie reciben el mensaje en su interfaz
6. Los mensajes se visualizan en burbujas estilo WhatsApp

**Ventajas:**

- Desacoplamiento total: los usuarios no se conocen entre sí
- Fácil agregar/quitar usuarios sin afectar otros
- Lógica de comunicación centralizada
- Más fácil de mantener y testear
- Reduce la complejidad de las relaciones entre objetos
- Cumple con el principio Single Responsibility

**Características de la UI:**

- Diseño similar a WhatsApp
- Mensajes con burbujas diferenciadas
- Scroll automático en el área de chat
- Input con bordes redondeados
- Botón de envío moderno
- Separación visual clara entre mensajes enviados/recibidos
