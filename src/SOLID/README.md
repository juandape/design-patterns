# Principios SOLID

## Explicación Sencilla

SOLID son cinco principios de diseño de software orientado a objetos que te ayudan a escribir código más mantenible, flexible y escalable. Fueron introducidos por Robert C. Martin (Uncle Bob) y son considerados fundamentales para la programación profesional.

**Analogía:** Es como construir una casa con bloques LEGO. Cada principio te dice cómo organizar los bloques para que puedas agregar habitaciones nuevas, cambiar colores o reparar una pieza sin que toda la casa se derrumbe.

## Los 5 Principios

### 1. Single Responsibility Principle (SRP)

**"Una clase debe tener una única razón para cambiar"**

Cada módulo, función o clase debe tener una sola responsabilidad. Si un código hace muchas cosas, es difícil de mantener y testear.

**Analogía:** Un chef solo cocina, un mesero solo sirve, un cajero solo cobra. Cada uno tiene un rol específico.

**Beneficios:**

- Código más fácil de entender
- Cambios aislados (modificar email no afecta validación)
- Testing más simple
- Reutilización de código

### 2. Open/Closed Principle (OCP)

**"Abierto para extensión, cerrado para modificación"**

Debes poder agregar nueva funcionalidad sin modificar el código existente. Usa abstracciones e interfaces para lograr esto.

**Analogía:** Un enchufe USB permite conectar diferentes dispositivos (mouse, teclado, disco duro) sin modificar la computadora.

**Beneficios:**

- Agregar features sin romper código existente
- Reduce riesgo de bugs en producción
- Facilita la evolución del sistema
- Código más flexible y extensible

### 3. Liskov Substitution Principle (LSP)

**"Los objetos derivados deben poder sustituir a los base sin romper nada"**

Si tienes una función que espera un tipo, debería funcionar correctamente con cualquier subtipo sin sorpresas o comportamientos inesperados.

**Analogía:** Si tu aplicación espera un "vehículo", debería funcionar igual con un auto, moto o bicicleta sin requerir cambios.

**Beneficios:**

- Polimorfismo confiable
- Código más predecible
- Interfaces consistentes
- Facilita el testing con mocks

### 4. Interface Segregation Principle (ISP)

**"Los clientes no deben depender de interfaces que no usan"**

Es mejor tener muchas interfaces pequeñas y específicas que una interfaz gigante con métodos que no todos necesitan.

**Analogía:** Un control remoto con botones específicos es mejor que un botón gigante que hace todo. Cada botón tiene una función clara.

**Beneficios:**

- Bajo acoplamiento entre componentes
- Interfaces más claras y comprensibles
- Fácil implementación de nuevas funcionalidades
- Código más limpio y mantenible

### 5. Dependency Inversion Principle (DIP)

**"Depende de abstracciones, no de implementaciones concretas"**

Las clases de alto nivel no deben depender de clases de bajo nivel. Ambas deben depender de abstracciones (interfaces).

**Analogía:** Un televisor no está "pegado" a un canal específico. Tiene un puerto que acepta cualquier proveedor de contenido (Netflix, DirecTV, etc.).

**Beneficios:**

- Desacoplamiento de componentes
- Fácil cambio de implementaciones
- Testing simplificado con mocks
- Mayor flexibilidad del sistema

## Ejercicios Implementados

### 1. SRP - Sistema de Gestión de Usuarios

**Problema (Bad Example):**
Una clase `UserManager` que hace TODO: validar, guardar en BD, enviar emails, generar reportes, asignar tokens.

**Solución (Good Example):**

- `UserValidator.ts` - Solo validación
- `UserRepository.ts` - Solo persistencia
- `AuthService.ts` - Solo tokens y seguridad
- `EmailService.ts` - Solo envío de emails
- `ReportGenerator.ts` - Solo reportes
- `UserService.ts` - Orquestador que junta todo

**Resultado:** Cada responsabilidad en su lugar. Cambiar email no afecta validación.

---

### 2. OCP - Sistema de Procesamiento de Pagos

**Problema (Bad Example):**
Función con if-else para cada método de pago (tarjeta, PayPal, cripto). Agregar Google Pay requiere modificar la función.

**Solución (Good Example):**

- `PaymentMethod.ts` - Interfaz común
- `CreditCardPayment.ts` - Implementa la interfaz
- `PayPalPayment.ts` - Implementa la interfaz
- `CryptoPayment.ts` - Implementa la interfaz
- `PaymentProcessor.ts` - Usa la interfaz sin saber cuál es

**Resultado:** Agregar nuevo método de pago = solo crear nueva clase. Sin modificar `PaymentProcessor`.

---

### 3. LSP - Sistema de Transportes

**Problema (Bad Example):**
Función `calculateTripCost` con if-else para verificar el tipo de vehículo (auto, moto, bici).

**Solución (Good Example):**

- `Vehicle.ts` - Interfaz con `calculateTripCost()`
- `Car.ts` - Calcula su propio costo
- `Moto.ts` - Calcula su propio costo
- `Bike.ts` - Calcula su propio costo
- `TripCostCalculator.ts` - Confía en que el vehículo sabe calcular

**Resultado:** Cualquier vehículo puede sustituir a otro sin problemas. Sin checks de tipo.

---

### 4. ISP - Sistema de Trabajadores

**Problema (Bad Example):**
Interfaz gigante `IEmployee` con métodos que no todos usan: `work()`, `manage()`, `code()`, `takeBreak()`, `payTax()`. Robot implementa `takeBreak()` pero no tiene sentido.

**Solución (Good Example):**

- `IWorker` - Solo `work()`
- `IManager` - Solo `manage()`
- `ICoder` - Solo `code()`
- `IReporter` - Solo `reportProgress()`
- `IEmployee` - Solo `takeBreak()` y `payTax()`

Cada clase implementa solo las interfaces que necesita.

**Resultado:** Robot solo implementa `IWorker`. Developer implementa `IWorker`, `ICoder`, `IReporter`, `IEmployee`.

---

### 5. DIP - Sistema de Notificaciones

**Problema (Bad Example):**
`NotificationService` depende directamente de `EmailService`, `SMSService`, `PushService` (implementaciones concretas).

**Solución (Good Example):**

- `NotificationChannel.ts` - Tipo abstracto: función que envía mensajes
- `emailChannel` - Implementa NotificationChannel
- `smsChannel` - Implementa NotificationChannel
- `pushChannel` - Implementa NotificationChannel
- `NotificationService` - Depende de NotificationChannel (abstracción)

**Resultado:** Agregar Telegram = solo crear `telegramChannel`. Sin modificar `NotificationService`.

## Comparación: Antes vs Después

| Aspecto            | ❌ Sin SOLID                       | ✅ Con SOLID                      |
| ------------------ | ---------------------------------- | --------------------------------- |
| **Extensibilidad** | Modificar código existente         | Agregar nuevo código              |
| **Mantenibilidad** | Cambios afectan múltiples partes   | Cambios aislados                  |
| **Testing**        | Difícil, todo acoplado             | Fácil, componentes independientes |
| **Reutilización**  | Código duplicado                   | Componentes reutilizables         |
| **Comprensión**    | Difícil entender responsabilidades | Clara separación de conceptos     |
| **Riesgo de bugs** | Alto (cambios afectan todo)        | Bajo (cambios localizados)        |

## Flujo de Aplicación de SOLID

```
┌─────────────────────────────────────────────────┐
│  1. Identifica Responsabilidades (SRP)          │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  2. Define Abstracciones (OCP, DIP)             │
│     - Crea interfaces                           │
│     - Define contratos                          │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  3. Implementa Comportamientos (LSP)            │
│     - Cada implementación cumple contrato       │
│     - Sustituibles entre sí                     │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  4. Segrega Interfaces (ISP)                    │
│     - Divide interfaces grandes                 │
│     - Cada cliente usa solo lo que necesita     │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  5. Inyecta Dependencias (DIP)                  │
│     - Pasa abstracciones, no implementaciones   │
│     - Desacopla componentes                     │
└─────────────────────────────────────────────────┘
```

## Cuándo Aplicar SOLID

### ✅ Aplica SOLID cuando:

- Sistema complejo con múltiples responsabilidades
- Código que cambia frecuentemente
- Múltiples implementaciones de una funcionalidad
- Necesitas testear componentes aisladamente
- Trabajas en equipo
- Planeas escalar la aplicación

### ⚠️ No te obsesiones con SOLID cuando:

- Proyecto muy pequeño (script de una vez)
- Prototipo rápido o POC
- Código que nunca va a cambiar
- Over-engineering innecesario

## Conceptos Avanzados

### 1. Composición sobre Herencia

**¿Qué es?**
Preferir combinar objetos pequeños (composición) en lugar de crear jerarquías de clases complejas (herencia).

**Ventajas:**

- Mayor flexibilidad
- Menor acoplamiento
- Más fácil de testear
- Evita el problema del "diamante"

### 2. Inyección de Dependencias

**¿Qué es?**
Técnica donde pasas las dependencias desde afuera en lugar de crearlas dentro de la clase/función.

**Tipos:**

- **Constructor Injection** - Pasas dependencias al crear el objeto
- **Property Injection** - Asignas dependencias después de crear el objeto
- **Function Injection** - Pasas dependencias como parámetros

### 3. SOLID en Programación Funcional

**¿Es aplicable?**
¡Sí! SOLID no es solo para POO:

- **SRP** - Una función, una responsabilidad
- **OCP** - Funciones de orden superior permiten extensión
- **LSP** - Tipos y contratos consistentes
- **ISP** - Funciones pequeñas y específicas
- **DIP** - Inyección de funciones (callbacks, HOF)

### 4. Refactoring hacia SOLID

**Proceso gradual:**

1. Identifica "code smells" (código largo, duplicado, acoplado)
2. Extrae responsabilidades (SRP)
3. Define interfaces (OCP, ISP)
4. Invierte dependencias (DIP)
5. Valida sustituciones (LSP)

## Relación con Patrones de Diseño

SOLID es la base de muchos patrones:

| Patrón         | Principio SOLID |
| -------------- | --------------- |
| **Strategy**   | OCP, DIP        |
| **Factory**    | OCP, DIP        |
| **Observer**   | OCP             |
| **Decorator**  | OCP, LSP        |
| **Adapter**    | OCP, LSP        |
| **Facade**     | ISP, DIP        |
| **Repository** | SRP, DIP        |

## Próximos Pasos de Aprendizaje

1. ✅ **Dominar cada principio** - Practicar con ejemplos reales
2. ✅ **Aplicar en proyectos** - Refactorizar código existente
3. **Clean Code** - Principios de código limpio de Robert C. Martin
4. **Design Patterns** - Gang of Four patterns
5. **DDD** - Domain-Driven Design
6. **TDD** - Test-Driven Development
7. **Arquitectura Hexagonal** - Aplicar SOLID a nivel arquitectónico
8. **SOLID en diferentes lenguajes** - TypeScript, Python, Java, C#

## Errores Comunes

### ❌ Over-engineering

Aplicar SOLID excesivamente en código simple. No todo necesita 5 interfaces.

### ❌ Interfaces Vacías

Crear interfaces solo por crear, sin propósito real.

### ❌ Abstracciones Prematuras

Crear abstracciones antes de entender el problema real.

### ❌ Violación por Desconocimiento

No reconocer cuándo estás violando un principio.

## Recursos Adicionales

- **Libro:** "Clean Code" - Robert C. Martin
- **Libro:** "Clean Architecture" - Robert C. Martin
- **Artículo:** Principios SOLID explicados por Uncle Bob
- **Video:** SOLID Principles en YouTube
- **Práctica:** Kata de refactoring con SOLID

---

**Recuerda:** SOLID no son reglas estrictas, son **guías** que te ayudan a escribir mejor código. Úsalas con sentido común y experiencia. 🚀
