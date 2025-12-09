# Prototype Pattern (Patrón Prototipo)

## Explicación Sencilla

El patrón Prototype permite crear nuevos objetos copiando un objeto existente (prototipo) en lugar de crearlos desde cero. Es útil cuando crear un objeto es costoso o complejo.

**Analogía:** Es como usar la función "Duplicar" en un documento. En lugar de crear un documento nuevo desde cero, copias uno existente y lo modificas.

## Uso en React

En React y JavaScript, este patrón es útil para:

- **Clonar configuraciones** - Copiar objetos de configuración complejos
- **Plantillas de datos** - Crear múltiples objetos similares con pequeñas variaciones
- **Estados iniciales** - Clonar estado base y modificarlo
- **Copiar objetos profundos** - Crear copias independientes de objetos anidados
- **Formularios con valores predefinidos** - Partir de una plantilla y personalizarla

## Ejercicio Implementado

### Sistema de Clonación de Usuarios

Se implementó un sistema donde se puede crear usuarios copiando un usuario base y modificando solo lo necesario.

**Componentes principales:**

1. **UserBase** - Clase prototipo base

   - Propiedades comunes: `name`, `email`, `role`, `permissions`
   - Método `clone()` que crea una copia independiente del objeto
   - Usa `Object.create()` y copia las propiedades
   - Permite clonar objetos complejos con configuraciones por defecto

2. **UserCreate** - Implementación de ejemplo
   - Crea un usuario base con configuración completa
   - Clona el usuario base múltiples veces
   - Modifica solo las propiedades necesarias en cada clon
   - Demuestra que los clones son independientes

**Flujo:**

1. Se crea un usuario base con todas las configuraciones
2. Se llama a `userBase.clone()` para crear una copia
3. Se modifican solo las propiedades específicas del clon
4. Cada clon es un objeto independiente
5. Cambios en un clon no afectan al original ni a otros clones

**Ejemplo de uso:**

```typescript
const adminBase = new UserBase('Admin', 'admin@example.com', 'admin', ['read', 'write', 'delete']);

// Crear nuevo admin clonando
const admin2 = adminBase.clone();
admin2.name = 'Super Admin';
admin2.email = 'superadmin@example.com';

// El original no se modifica
console.log(adminBase.name); // "Admin"
console.log(admin2.name); // "Super Admin"
```

**Ventajas:**

- Evita código repetitivo de inicialización
- Reduce la complejidad de crear objetos similares
- Mejora el rendimiento al evitar constructores pesados
- Facilita la creación de variaciones de objetos
- Oculta la complejidad de la construcción del objeto
- Permite agregar/eliminar objetos en tiempo de ejecución
