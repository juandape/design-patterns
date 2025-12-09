# Builder Pattern (Patrón Constructor)

## Explicación Sencilla

El patrón Builder permite construir objetos complejos paso a paso. Separa la construcción de un objeto de su representación, permitiendo el mismo proceso de construcción crear diferentes representaciones.

**Analogía:** Es como pedir una hamburguesa en un restaurante. Puedes elegir el pan, la carne, los vegetales, salsas, etc., paso a paso hasta tener tu hamburguesa personalizada.

## Uso en React

En React y JavaScript, este patrón es útil para:

- **Construcción de queries complejas** - SQL, GraphQL, filtros
- **Generación de objetos de configuración** - Opciones complejas con valores por defecto
- **Construcción de requests HTTP** - Headers, params, body, etc.
- **Formularios dinámicos** - Construir formularios paso a paso
- **Objetos con muchas propiedades opcionales** - Evitar constructores con muchos parámetros

## Ejercicios Implementados

### 1. Query Builder (Constructor de Consultas SQL)

Permite construir consultas SQL de forma fluida y legible.

**Componentes principales:**

1. **QueryBuilder** - Constructor principal
   - Métodos encadenables: `select()`, `from()`, `where()`, `orderBy()`, `limit()`
   - Cada método retorna `this` para permitir encadenamiento
   - Método `build()` que genera la consulta SQL final
   - Validaciones internas para garantizar consultas correctas

**Ejemplo de uso:**

```typescript
const query = new QueryBuilder()
  .select(['name', 'email'])
  .from('users')
  .where('age > 18')
  .orderBy('name', 'ASC')
  .limit(10)
  .build();

// Resultado: "SELECT name, email FROM users WHERE age > 18 ORDER BY name ASC LIMIT 10"
```

### 2. Request Builder (Constructor de Peticiones HTTP)

Permite construir objetos de configuración para peticiones HTTP.

**Componentes principales:**

1. **RequestPayloadBuilder** - Constructor de payloads
   - Métodos para configurar: `setMethod()`, `setUrl()`, `setHeaders()`, `setBody()`
   - Permite agregar headers uno por uno o en lote
   - Método `build()` que retorna el objeto de configuración completo
   - Validaciones para asegurar que la petición sea válida

**Ejemplo de uso:**

```typescript
const request = new RequestPayloadBuilder()
  .setMethod('POST')
  .setUrl('https://api.example.com/users')
  .addHeader('Content-Type', 'application/json')
  .addHeader('Authorization', 'Bearer token123')
  .setBody({ name: 'John', email: 'john@example.com' })
  .build();
```

**Flujo general:**

1. Se crea una instancia del builder
2. Se llaman métodos encadenados para configurar
3. Cada método modifica el estado interno y retorna `this`
4. Se llama a `build()` para obtener el objeto final
5. El objeto está listo para usarse

**Ventajas:**

- Código más legible y autodocumentado
- Construcción paso a paso de objetos complejos
- Reutilización del builder para crear variaciones
- Evita constructores con muchos parámetros
- Validación en cada paso
- Encadenamiento fluido (fluent interface)
- Separación entre construcción y representación
