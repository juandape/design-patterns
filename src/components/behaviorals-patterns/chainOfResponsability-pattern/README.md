# Chain of Responsibility Pattern (Patrón Cadena de Responsabilidad)

## Explicación Sencilla

El patrón Chain of Responsibility permite que varios objetos (handlers) tengan la oportunidad de procesar una solicitud. Cada handler decide si procesa la solicitud o la pasa al siguiente en la cadena.

**Analogía:** Es como una línea de atención al cliente: primero te atiende el operador básico, si no puede resolver tu problema, te pasa al supervisor, y si el supervisor no puede, te pasa al gerente.

## Uso en React

En React, este patrón es muy útil para:

- **Validaciones en cadena** - Validar formularios paso a paso
- **Middlewares** - Procesamiento de datos en etapas
- **Manejo de eventos** - Diferentes handlers para diferentes tipos de eventos
- **Autorización** - Verificar permisos en niveles
- **Procesamiento de errores** - Diferentes manejadores según el tipo de error

## Ejercicio Implementado

### Sistema de Validación de Contraseñas

Se implementó un validador de contraseñas donde diferentes validadores se encadenan para verificar requisitos específicos.

**Componentes principales:**

1. **BaseHandler** - Clase abstracta base

   - Implementa la lógica de encadenamiento
   - `setNext()` - Enlaza el siguiente handler
   - `handle()` - Pasa la solicitud al siguiente si existe

2. **LengthValidator** - Valida longitud mínima

   - Verifica que la contraseña tenga al menos 8 caracteres
   - Si no cumple, retorna error
   - Si cumple, pasa al siguiente validador

3. **UppercaseValidator** - Valida mayúsculas

   - Verifica que haya al menos una letra mayúscula
   - Usa expresión regular `/[A-Z]/`
   - Si no cumple, retorna error

4. **NumberValidator** - Valida números

   - Verifica que haya al menos un número
   - Usa expresión regular `/[0-9]/`
   - Si no cumple, retorna error

5. **PasswordValidator** - Componente React
   - Input para escribir la contraseña
   - Crea la cadena de validadores
   - Muestra mensajes de error o éxito en tiempo real

**Flujo:**

1. Se crea la cadena: Length → Uppercase → Number
2. Usuario escribe una contraseña
3. La contraseña pasa por cada validador
4. Si alguno falla, se muestra el error
5. Si todos pasan, se muestra "Contraseña válida"

**Ventajas:**

- Fácil agregar o quitar validadores
- Cada validador tiene una sola responsabilidad
- El orden de validación es flexible
- No hay acoplamiento entre validadores
