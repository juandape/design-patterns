# Template Method Pattern (Patrón Método Plantilla)

## Explicación Sencilla

El patrón Template Method define el esqueleto de un algoritmo en una clase base, pero permite que las subclases sobrescriban ciertos pasos sin cambiar la estructura general del algoritmo.

**Analogía:** Es como una receta de cocina:

- **Pasos fijos:** Todos hacen lo mismo (precalentar horno, servir)
- **Pasos variables:** Cada quien los hace diferente (preparar ingredientes para pizza vs pasta)

## Uso en React

En React y JavaScript, este patrón es útil para:

- **Formularios con flujos similares** - Mismos pasos pero validaciones diferentes
- **Procesamiento de datos** - Pasos comunes pero transformaciones específicas
- **Generación de reportes** - Estructura común con contenido personalizado
- **Componentes con ciclos de vida similares** - Comportamientos personalizados
- **Exportadores** - Mismo proceso para diferentes formatos (PDF, Excel, CSV)

## Ejercicio Implementado

### Sistema de Generación de Reportes

Se implementó un generador de reportes donde todos los reportes siguen los mismos pasos, pero cada tipo genera contenido diferente.

**Componentes principales:**

1. **ReportTemplate** - Clase abstracta base

   - `generateReport()` - Método plantilla (no se sobrescribe)
     - Orquesta los pasos: título → contenido → pie de página
   - `generateTitle()` - Método abstracto (debe implementarse)
   - `generateContent()` - Método abstracto (debe implementarse)
   - `generateFooter()` - Método con implementación por defecto
     - Puede sobrescribirse si es necesario
     - Por defecto muestra la fecha de generación

2. **SalesReport** - Reporte de ventas

   - `generateTitle()` → "=== Sales Report ==="
   - `generateContent()` → Muestra el total de ventas
   - Recibe el monto de ventas en el constructor

3. **UserReport** - Reporte de usuarios

   - `generateTitle()` → "=== User Report ==="
   - `generateContent()` → Muestra el número de usuarios
   - Recibe el número de usuarios en el constructor

4. **ReportGenerator** - Componente React
   - Inputs para ingresar datos (ventas y usuarios)
   - Botones para generar cada tipo de reporte
   - Muestra el reporte generado en formato de texto

**Flujo:**

1. Usuario ingresa datos (ventas o usuarios)
2. Presiona el botón correspondiente
3. Se crea una instancia del reporte específico
4. Se llama a `generateReport()` que ejecuta la plantilla
5. El resultado se muestra en pantalla

**Ventajas:**

- Reutilización de código: estructura común
- Consistencia: todos los reportes tienen el mismo formato
- Fácil agregar nuevos tipos de reportes
- Los pasos fijos no pueden ser alterados accidentalmente
- Cumple con el principio DRY (Don't Repeat Yourself)
