# Singleton Pattern (Patrón Singleton)

## Explicación Sencilla

El patrón Singleton garantiza que una clase tenga **una sola instancia** en toda la aplicación y proporciona un punto de acceso global a ella.

**Analogía:** Es como el presidente de un país. Solo puede haber un presidente a la vez, y todos saben cómo contactarlo (punto de acceso global).

## Uso en React

En React, este patrón es útil para:

- **Servicios de autenticación** - Una sola instancia del servicio de auth
- **Configuración global** - Settings compartidos en toda la app
- **Caché global** - Almacenamiento compartido de datos
- **Logger/Analytics** - Un único punto de registro
- **Conexiones a APIs** - Evitar múltiples instancias de clientes HTTP

## Ejercicio Implementado

### Sistema de Autenticación con Singleton

Se implementó un servicio de autenticación que garantiza una sola instancia en toda la aplicación.

**Componentes principales:**

1. **AuthService** - Servicio singleton

   - Constructor privado (no se puede instanciar desde fuera)
   - Propiedad estática `instance` para almacenar la única instancia
   - Método estático `getInstance()` que retorna siempre la misma instancia
   - Métodos de autenticación: `login()`, `logout()`, `isAuthenticated()`
   - Estado interno que se mantiene entre todos los componentes

2. **SimulateLogin** - Componente de demostración

   - Usa `AuthService.getInstance()` para obtener el servicio
   - Botones para login y logout
   - Muestra el estado de autenticación
   - Demuestra que todas las instancias comparten el mismo estado

3. **AuthTest** - Componente principal
   - Contiene múltiples instancias del componente `SimulateLogin`
   - Demuestra que todas usan el mismo servicio
   - Cambios en uno se reflejan en todos los demás

**Flujo:**

1. Primera llamada a `getInstance()` crea la instancia
2. Siguientes llamadas retornan la misma instancia
3. Usuario hace login en cualquier componente
4. El estado se actualiza en el servicio único
5. Todos los componentes ven el cambio inmediatamente

**Ventajas:**

- Control estricto sobre la instancia
- Ahorro de recursos (una sola instancia)
- Estado compartido garantizado
- Punto de acceso global consistente
- Evita problemas de sincronización
