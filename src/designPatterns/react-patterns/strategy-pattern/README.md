# Strategy Pattern in React (Patrón Estrategia en React)

## Explicación Sencilla

El patrón Strategy define una familia de algoritmos, los encapsula y los hace intercambiables. Permite que el algoritmo varíe independientemente de los clientes que lo usan.

**Analogía:** Es como elegir un método de transporte para ir al trabajo: auto, bicicleta, metro. El objetivo es el mismo (llegar al trabajo), pero la estrategia cambia según tus necesidades del momento.

## Uso en React

En React, este patrón es útil para:

- **Validaciones dinámicas** - Diferentes reglas de validación
- **Métodos de pago** - PayPal, tarjeta, cripto
- **Ordenamiento/Filtrado** - Diferentes algoritmos de ordenamiento
- **Renderizado condicional** - Diferentes formas de mostrar datos
- **Autenticación** - Diferentes proveedores (Google, Facebook, Email)

## Ejercicios Implementados

### 1. Validador de Contraseñas con Estrategias

Sistema de validación de contraseñas donde se pueden aplicar diferentes estrategias de validación.

**Componentes principales:**

1. **PasswordStrategy (Interfaz)** - Define el contrato

   ```typescript
   interface PasswordStrategy {
     validate(password: string): boolean;
     getMessage(): string;
   }
   ```

2. **Estrategias concretas:**

   - **LengthStrategy** - Valida longitud mínima
   - **UppercaseStrategy** - Valida mayúsculas
   - **LowercaseStrategy** - Valida minúsculas
   - **NumberStrategy** - Valida números
   - **SpecialCharStrategy** - Valida caracteres especiales

3. **PasswordValidator** - Usa las estrategias

   ```typescript
   class PasswordValidator {
     private strategies: PasswordStrategy[] = [];

     addStrategy(strategy: PasswordStrategy) {
       this.strategies.push(strategy);
     }

     validate(password: string): ValidationResult {
       const errors = [];
       for (const strategy of this.strategies) {
         if (!strategy.validate(password)) {
           errors.push(strategy.getMessage());
         }
       }
       return { isValid: errors.length === 0, errors };
     }
   }
   ```

4. **PasswordForm** - Componente React
   - Input para la contraseña
   - Crea el validador con estrategias
   - Muestra errores de validación en tiempo real
   - Permite habilitar/deshabilitar estrategias

**Uso:**

```tsx
const validator = new PasswordValidator();
validator.addStrategy(new LengthStrategy(8));
validator.addStrategy(new UppercaseStrategy());
validator.addStrategy(new NumberStrategy());

const result = validator.validate("MyPass123");
// { isValid: true, errors: [] }
```

### 2. Procesador de Pagos con Estrategias

Sistema de checkout que soporta múltiples métodos de pago.

**Componentes principales:**

1. **PaymentStrategy (Interfaz)**

   ```typescript
   interface PaymentStrategy {
     pay(amount: number): Promise<PaymentResult>;
     getName(): string;
     getIcon(): string;
   }
   ```

2. **Estrategias de pago:**

   - **CreditCardStrategy** - Pago con tarjeta
   - **PayPalStrategy** - Pago con PayPal
   - **CryptoStrategy** - Pago con criptomonedas
   - **BankTransferStrategy** - Transferencia bancaria

3. **PaymentProcessor** - Procesa pagos

   ```typescript
   class PaymentProcessor {
     private strategy: PaymentStrategy;

     setStrategy(strategy: PaymentStrategy) {
       this.strategy = strategy;
     }

     async processPayment(amount: number) {
       return await this.strategy.pay(amount);
     }
   }
   ```

4. **Checkout** - Componente React
   - Selector de método de pago
   - Formularios específicos por método
   - Botón de pago que usa la estrategia seleccionada
   - Muestra resultado del pago

**Uso:**

```tsx
function Checkout() {
  const { setPaymentStrategy, processPayment } = usePaymentProcessor();
  const [selectedMethod, setSelectedMethod] = useState('card');

  const handlePaymentMethodChange = (method: string) => {
    setSelectedMethod(method);

    switch(method) {
      case 'card':
        setPaymentStrategy(new CreditCardStrategy());
        break;
      case 'paypal':
        setPaymentStrategy(new PayPalStrategy());
        break;
      case 'crypto':
        setPaymentStrategy(new CryptoStrategy());
        break;
    }
  };

  const handlePay = async () => {
    const result = await processPayment(totalAmount);
    // Manejar resultado
  };

  return (
    <div>
      <PaymentMethodSelector
        selected={selectedMethod}
        onChange={handlePaymentMethodChange}
      />
      <button onClick={handlePay}>Pay ${totalAmount}</button>
    </div>
  );
}
```

**Flujo:**

1. Usuario selecciona método de pago
2. Se establece la estrategia correspondiente
3. Usuario confirma el pago
4. El procesador ejecuta la estrategia actual
5. Se muestra el resultado

**Ventajas:**

- **Intercambiabilidad:** Cambiar algoritmos en tiempo de ejecución
- **Extensibilidad:** Fácil agregar nuevas estrategias
- **Separación de responsabilidades:** Cada estrategia es independiente
- **Testing:** Cada estrategia se testea individualmente
- **Eliminación de condicionales:** No más if/else gigantes
- **Cumple Open/Closed:** Abierto a extensión, cerrado a modificación

**Cuándo usar:**
✅ Múltiples algoritmos para la misma tarea
✅ Necesitas cambiar algoritmos dinámicamente
✅ Quieres evitar condicionales complejos
✅ Los algoritmos deben ser intercambiables

**Cuándo NO usar:**
❌ Solo hay 2 opciones simples (usa if/else)
❌ Los algoritmos no cambian en runtime
❌ Agregar complejidad innecesaria
❌ Las estrategias no comparten interfaz común
