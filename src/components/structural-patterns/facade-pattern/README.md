# Facade Pattern (Patrón Fachada)

## Explicación Sencilla

El patrón Facade proporciona una interfaz simplificada para un conjunto complejo de subsistemas. Oculta la complejidad del sistema y proporciona una interfaz más fácil de usar.

**Analogía:** Es como el recepcionista de un hotel. En lugar de que tú llames directamente al servicio de limpieza, restaurante, mantenimiento, etc., solo hablas con el recepcionista y él coordina todo por ti.

## Uso en React

En React, este patrón es útil para:

- **APIs complejas** - Simplificar llamadas a múltiples endpoints
- **Bibliotecas de terceros** - Ocultar complejidad de librerías externas
- **Servicios del sistema** - Coordinar múltiples servicios internos
- **Inicialización compleja** - Simplificar setup de componentes
- **Operaciones multi-paso** - Unificar procesos complicados

## Ejercicio Implementado

### Facade de Gestión de Usuarios

Se implementó una fachada que simplifica la creación de usuarios, ocultando la complejidad de múltiples servicios (UserService, EmailService, LoggerService).

**Componentes principales:**

1. **UserService** - Servicio de usuarios

   - `createUser(user)` - Crea un usuario en la base de datos
   - Maneja validaciones y almacenamiento
   - Retorna el usuario creado

2. **EmailService** - Servicio de email

   - `sendWelcomeEmail(email, name)` - Envía email de bienvenida
   - Maneja templates y envío
   - Confirma el envío exitoso

3. **LoggerService** - Servicio de logging

   - `log(message)` - Registra eventos en el sistema
   - Guarda logs con timestamps
   - Útil para debugging y auditoría

4. **UserFacade** - Fachada que coordina todo
   - Única interfaz pública simple
   - Método `registerUser(name, email)` que:
     1. Crea el usuario con UserService
     2. Envía el email con EmailService
     3. Registra el evento con LoggerService
   - Oculta la complejidad de coordinar los tres servicios

**Sin Facade (Complejo):**

```typescript
// El cliente debe conocer y coordinar todos los servicios
const userService = new UserService();
const emailService = new EmailService();
const loggerService = new LoggerService();

const user = { name: 'John', email: 'john@example.com' };

// 1. Crear usuario
const createdUser = userService.createUser(user);

// 2. Enviar email
emailService.sendWelcomeEmail(user.email, user.name);

// 3. Registrar log
loggerService.log(`User ${user.name} registered`);
```

**Con Facade (Simple):**

```typescript
// El cliente solo usa la fachada
const userFacade = new UserFacade();

userFacade.registerUser('John', 'john@example.com');
// ¡Listo! La fachada coordina todo internamente
```

**Flujo:**

1. Cliente llama a `userFacade.registerUser()`
2. La fachada coordina los subsistemas:
   - Llama a UserService para crear el usuario
   - Llama a EmailService para enviar bienvenida
   - Llama a LoggerService para registrar el evento
3. Retorna el resultado al cliente
4. El cliente no necesita conocer los detalles internos

**Ventajas:**

- Interfaz simple para sistemas complejos
- Reduce dependencias del cliente con subsistemas
- Facilita el uso de bibliotecas complejas
- Punto único de entrada para funcionalidades relacionadas
- Fácil de testear (mock de la fachada en lugar de múltiples servicios)
- Promueve el bajo acoplamiento
- Permite cambiar la implementación interna sin afectar clientes
