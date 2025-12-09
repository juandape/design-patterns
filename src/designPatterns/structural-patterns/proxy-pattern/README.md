# Proxy Pattern (Patrón Proxy)

## Explicación Sencilla

El patrón Proxy proporciona un sustituto o representante de otro objeto para controlar el acceso a él. El proxy actúa como intermediario, agregando funcionalidad adicional antes o después de delegar al objeto real.

**Analogía:** Es como un asistente personal de un CEO. En lugar de hablar directamente con el CEO, hablas con su asistente, quien decide si el CEO debe atenderte, filtra peticiones, o las maneja él mismo.

## Uso en React

En React, este patrón es útil para:

- **Lazy loading** - Cargar recursos solo cuando se necesitan
- **Caching** - Almacenar resultados de operaciones costosas
- **Validación de acceso** - Controlar permisos antes de ejecutar
- **Logging/Analytics** - Registrar llamadas a servicios
- **Rate limiting** - Limitar frecuencia de peticiones

## Ejercicio Implementado

### Proxy de Servicio API con Caché

Se implementó un proxy que agrega caching a un servicio de API, evitando llamadas repetidas al servidor.

**Componentes principales:**

1. **UserService (Interfaz)** - Define el contrato

   ```typescript
   interface UserService {
     getUser(id: number): Promise<User>;
   }
   ```

2. **ApiService** - Servicio real que hace llamadas HTTP

   - Implementa `UserService`
   - Hace peticiones reales a la API
   - Simula latencia de red
   - Es el objeto "real" que el proxy representa

3. **ProxyService** - Proxy con caché

   - Implementa la misma interfaz `UserService`
   - Contiene una referencia al servicio real
   - Mantiene un caché de resultados
   - Funcionalidades adicionales:
     - **Caching:** Si el usuario ya fue consultado, lo retorna del caché
     - **Logging:** Registra cada petición
     - **Lazy loading:** Solo consulta la API si no está en caché

4. **Client** - Cliente que usa el servicio
   - No sabe si está usando el servicio real o el proxy
   - Usa la misma interfaz en ambos casos
   - Obtiene mejoras de rendimiento transparentemente

**Flujo:**

```
Cliente → Proxy → Servicio Real → API
           ↑
        Caché
```

**Ejemplo de uso:**

```typescript
// Sin proxy (lento)
const apiService = new ApiService();
await apiService.getUser(1); // Llamada a API (500ms)
await apiService.getUser(1); // Llamada a API (500ms) - repetida!
await apiService.getUser(1); // Llamada a API (500ms) - repetida!

// Con proxy (rápido)
const proxyService = new ProxyService(apiService);
await proxyService.getUser(1); // Llamada a API (500ms)
await proxyService.getUser(1); // Desde caché (instantáneo!)
await proxyService.getUser(1); // Desde caché (instantáneo!)
```

**Tipos de Proxy:**

1. **Virtual Proxy** - Retrasa la creación de objetos costosos
2. **Protection Proxy** - Controla acceso basado en permisos
3. **Remote Proxy** - Representa objetos en diferentes espacios de direcciones
4. **Smart Proxy** - Agrega funcionalidad adicional (logging, caching, etc.)

En este ejercicio implementamos un **Smart Proxy** con caching.

**Ventajas:**

- Control sobre el acceso al objeto real
- Agrega funcionalidad sin modificar el objeto original
- Optimización transparente (el cliente no nota la diferencia)
- Lazy initialization cuando sea necesario
- Protección del objeto real
- Logging y auditoría centralizada
- Cumple con el principio Open/Closed
