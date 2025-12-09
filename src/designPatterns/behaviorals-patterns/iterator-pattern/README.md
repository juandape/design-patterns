# Iterator Pattern (Patrón Iterador)

## Explicación Sencilla

El patrón Iterator proporciona una forma de acceder secuencialmente a los elementos de una colección sin exponer su representación interna (array, objeto, árbol, etc.).

**Analogía:** Es como un libro con marcapáginas:

- Puedes pasar página por página sin saber cómo está organizado internamente
- Puedes ir hacia adelante o atrás
- No necesitas saber si es digital o físico

**Nota:** JavaScript ya tiene este patrón integrado con `for...of`, `Array.prototype[Symbol.iterator]` y Generators.

## Uso en React

En React, este patrón es útil para:

- **Navegación entre elementos** - Galerías de imágenes, carruseles
- **Paginación personalizada** - Control fino sobre la navegación
- **Playlists** - Reproducción secuencial con control
- **Recorrer estructuras complejas** - Árboles, grafos
- **Wizards/Formularios multipaso** - Navegar entre pasos

## Ejercicio Implementado

### Reproductor de Música con Playlist

Se implementó un iterador personalizado para navegar por una playlist de canciones.

**Componentes principales:**

1. **Song** - Tipo de datos

   ```typescript
   {
     id: number;
     title: string;
     artist: string;
   }
   ```

2. **Iterator<T>** - Interfaz genérica

   - `hasNext()` - Verifica si hay más elementos
   - `next()` - Avanza y retorna el siguiente elemento
   - `current()` - Obtiene el elemento actual sin avanzar
   - `previous()` - Retrocede al elemento anterior
   - `hasPrevious()` - Verifica si se puede retroceder
   - `reset()` - Vuelve al inicio

3. **PlaylistIterator** - Implementación concreta

   - Mantiene un array de canciones
   - Mantiene un índice de la posición actual
   - Implementa todos los métodos de navegación
   - Maneja los límites (inicio y final de la lista)

4. **MusicPlayer** - Componente React
   - Muestra la canción actual
   - Botones para navegar: Previous, Next, Reset
   - El botón Next se deshabilita cuando no hay más canciones
   - Indicador visual del estado de la playlist

**Flujo:**

1. Se crea el iterador con la lista de canciones
2. Usuario presiona "Next" → Se obtiene la siguiente canción
3. Usuario presiona "Previous" → Se retrocede a la canción anterior
4. Usuario presiona "Reset" → Vuelve al inicio de la playlist
5. El estado se actualiza y muestra la información de la canción

**Ventajas:**

- Encapsula la lógica de navegación
- Independiente de la estructura de datos interna
- Fácil cambiar el orden o agregar filtros
- Múltiples iteradores pueden recorrer la misma colección
- Cumple con el principio Single Responsibility
