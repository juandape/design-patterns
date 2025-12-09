# Abstract Factory Pattern (Patrón Fábrica Abstracta)

## Explicación Sencilla

El patrón Abstract Factory proporciona una interfaz para crear familias de objetos relacionados sin especificar sus clases concretas. Es como una "fábrica de fábricas".

**Analogía:** Es como elegir un tema para tu aplicación (oscuro/claro). Dependiendo del tema elegido, obtienes un conjunto completo de componentes (botones, inputs, cards) que comparten el mismo estilo.

## Uso en React

En React, este patrón es muy útil para:

- **Sistemas de temas** - Alternar entre diferentes sets de componentes con estilos diferentes
- **Multi-plataforma** - Componentes nativos vs web
- **Internacionalización** - Diferentes componentes según el idioma/región
- **A/B Testing** - Variantes de componentes para experimentación
- **White-label** - Diferentes versiones de la app para diferentes clientes

## Ejercicio Implementado

### Sistema de Temas UI (Material UI vs Tailwind)

Se implementó un sistema donde se puede alternar entre dos familias completas de componentes UI: Material UI y Tailwind.

**Componentes principales:**

1. **UIFactory (Interfaz Abstracta)** - Define la estructura

   ```typescript
   interface UIFactory {
     createButton(): ButtonComponent;
     createInput(): InputComponent;
     createCard(): CardComponent;
   }
   ```

2. **MaterialUIFactory** - Fábrica concreta para Material UI

   - `createButton()` → Retorna botón con estilos Material
   - `createInput()` → Retorna input con estilos Material
   - `createCard()` → Retorna card con estilos Material
   - Todos los componentes comparten el diseño Material

3. **TailwindFactory** - Fábrica concreta para Tailwind

   - `createButton()` → Retorna botón con clases Tailwind
   - `createInput()` → Retorna input con clases Tailwind
   - `createCard()` → Retorna card con clases Tailwind
   - Todos los componentes comparten el diseño Tailwind

4. **ThemeContext** - Context de React

   - Almacena la fábrica activa actual
   - Método `setFactory()` para cambiar entre temas
   - Provee la fábrica a todos los componentes hijos

5. **AbstractFactory** - Componente principal
   - Selector para elegir el tema (Material UI / Tailwind)
   - Al cambiar el selector, cambia la fábrica activa
   - Todos los componentes se actualizan automáticamente
   - Demuestra el uso de cada tipo de componente

**Flujo:**

1. Usuario selecciona un tema del dropdown
2. Se actualiza la fábrica en el contexto
3. Los componentes usan la fábrica para crear elementos
4. Toda la UI se actualiza con el nuevo tema
5. Todos los elementos mantienen consistencia visual

**Estructura de código:**

```typescript
// Obtener la fábrica del contexto
const factory = useTheme();

// Crear componentes usando la fábrica
const Button = factory.createButton();
const Input = factory.createInput();
const Card = factory.createCard();

// Renderizar
return (
  <>
    <Button>Click me</Button>
    <Input placeholder="Type..." />
    <Card>Content</Card>
  </>
);
```

**Ventajas:**

- Consistencia garantizada en toda la familia de componentes
- Fácil alternar entre temas completos
- Código desacoplado de implementaciones concretas
- Agregar nuevos temas sin modificar código existente
- Los componentes no necesitan saber qué tema están usando
- Cumple con el principio Open/Closed
- Facilita el testing con diferentes configuraciones
