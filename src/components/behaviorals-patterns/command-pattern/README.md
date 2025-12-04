# Command Pattern (Patrón Comando)

## Explicación Sencilla

El patrón Command encapsula una acción (como "borrar", "guardar", "deshacer") dentro de un objeto. Esto permite pasar, guardar, deshacer o repetir acciones fácilmente.

**Analogía:** Es como tener un control remoto con botones. Cada botón encapsula una acción específica y puedes presionar "deshacer" para revertir la última acción.

## Uso en React

En React, este patrón es útil para:

- **Undo/Redo** - Deshacer y rehacer acciones en editores
- **Historial de acciones** - Mantener un registro de operaciones
- **Transacciones** - Agrupar múltiples operaciones
- **Macro commands** - Ejecutar múltiples comandos en secuencia
- **Separación de responsabilidades** - Desacoplar la UI de la lógica de negocio

## Ejercicio Implementado

### Sistema de Gestión de Tareas con Undo/Redo

Se implementó un gestor de tareas donde cada acción (agregar/eliminar) es un comando que puede deshacerse.

**Componentes principales:**

1. **TaskCommandBase** - Clase abstracta base

   - Define la estructura común para todos los comandos
   - Almacena la lista de tareas y la tarea específica
   - Los comandos concretos la extienden

2. **AddTaskCommand** - Comando para agregar tareas

   - `execute()` - Agrega una tarea a la lista
   - `undo()` - Elimina la última tarea agregada

3. **RemoveTaskCommand** - Comando para eliminar tareas

   - `execute()` - Elimina una tarea por índice
   - `undo()` - Restaura la tarea en su posición original

4. **useTaskManager** - Hook personalizado
   - Gestiona la lista de tareas
   - Mantiene dos stacks: `undoStack` y `redoStack`
   - Funciones para agregar, eliminar, deshacer y rehacer

**Flujo:**

1. Usuario agrega/elimina una tarea
2. Se crea un comando y se ejecuta
3. El comando se guarda en el stack de undo
4. Al presionar "Undo", se ejecuta el método `undo()` del último comando
5. Al presionar "Redo", se ejecuta el método `execute()` del comando deshecho

**Ventajas:**

- Historial completo de acciones
- Deshacer y rehacer ilimitados
- Fácil de extender con nuevos tipos de comandos
- Separación clara entre UI y lógica de negocio
