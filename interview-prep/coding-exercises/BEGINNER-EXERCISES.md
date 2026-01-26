# JavaScript Exercises - Nivel Principiante a Intermedio

> 🎯 **Objetivo**: Construir confianza resolviendo problemas desde lo más básico hasta intermedio

> ⚠️ **IMPORTANTE**: El autocompletado está desactivado en este archivo para que practiques sin ayuda

---

## 📚 Cómo usar esta guía

1. **No veas la solución** hasta intentar por al menos 10 minutos
2. **Usa los hints** si te atascas
3. **Ejecuta el código** en la consola del navegador o Node.js
4. **Explica en voz alta** qué hace cada línea (práctica para la entrevista)

---

## 🚀 Dónde probar tu código

### Opción 1: Chrome DevTools (Más rápido) ⭐ RECOMENDADO

1. **Abre Chrome** (o cualquier navegador)
2. **Presiona F12** o clic derecho → "Inspect" → tab "Console"
3. **Copia tu función** en la consola
4. **Prueba con ejemplos**:

---

## NIVEL 1: Fundamentos (Arrays y Strings)

### Ejercicio 1.1: Suma de Array (5 minutos)

**Problema**: Escribe una función que sume todos los números de un array.

```javascript
// Ejemplo
console.log(sum([1, 2, 3, 4])); // 10
console.log(sum([10, 20])); // 30
console.log(sum([])); // 0
```

**Tu solución:**

```javascript
function sum(arr) {
  // Escribe tu código aquí
  return arr.reduce((acc, curr) => acc + curr, 0)
}
```

<details>
<summary>💡 Hint 1</summary>

Necesitas:

1. Una variable para acumular la suma (empieza en 0)
2. Un loop para recorrer el array
3. Sumar cada elemento a tu acumulador
</details>

<details>
<summary>💡 Hint 2</summary>

```javascript
function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    // ¿Qué hacer aquí?
  }
  return total;
}
```

</details>

<details>
<summary>✅ Solución</summary>

```javascript
// Solución 1: For loop tradicional
function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

// Solución 2: For...of (más moderno)
function sum(arr) {
  let total = 0;
  for (const num of arr) {
    total += num;
  }
  return total;
}

// Solución 3: Reduce (avanzado)
function sum(arr) {
  return arr.reduce((acc, num) => acc + num, 0);
}
```

**¿Por qué funciona?**

- Inicializamos `total` en 0 (caso de array vacío)
- Recorremos cada elemento del array
- Sumamos cada elemento al total
- Retornamos el total acumulado
</details>

---

### Ejercicio 1.2: Encontrar el Mayor (7 minutos)

**Problema**: Encuentra el número más grande en un array.

```javascript
// Ejemplo
console.log(findMax([1, 5, 3, 9, 2])); // 9
console.log(findMax([-1, -5, -3])); // -1
console.log(findMax([42])); // 42
```

**Tu solución:**

```javascript
function findMax(arr) {
  // Escribe tu código aquí
  return arr.reduce((acc, num) => num > acc ? num : acc, arr[0])
}
```

<details>
<summary>💡 Hint 1</summary>

Estrategia:

1. Asume que el primer elemento es el máximo
2. Recorre el array comparando cada elemento
3. Si encuentras uno mayor, actualiza el máximo
</details>

<details>
<summary>💡 Hint 2</summary>

```javascript
function findMax(arr) {
  let max = arr[0]; // Empieza con el primer elemento
  for (let i = 1; i < arr.length; i++) {
    if (/* ¿qué condición? */) {
      max = arr[i];
    }
  }
  return max;
}
```

</details>

<details>
<summary>✅ Solución</summary>

```javascript
// Solución 1: Loop manual
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// Solución 2: Math.max con spread
function findMax(arr) {
  return Math.max(...arr);
}

// Solución 3: Reduce
function findMax(arr) {
  return arr.reduce((max, num) => num > max ? num : max, arr[0]);
}
```

**Explicación**:

- Guardamos el primer elemento como máximo inicial
- Comparamos cada elemento siguiente con el máximo actual
- Si encontramos uno mayor, lo actualizamos
- Al final tenemos el valor más grande
</details>

---

### Ejercicio 1.3: Invertir String (8 minutos)

**Problema**: Invierte un string (sin usar `.reverse()`).

```javascript
// Ejemplo
console.log(reverseString('hello')); // 'olleh'
console.log(reverseString('world')); // 'dlrow'
console.log(reverseString('a')); // 'a'
```

**Tu solución:**

```javascript
function reverseString(str) {
  // Escribe tu código aquí
  return str.split('').reduce((acc, char)=> char + acc, '' )
}
```

<details>
<summary>💡 Hint 1</summary>

Opciones:

1. **Opción A**: Recorre el string de atrás hacia adelante y construye nuevo string
2. **Opción B**: Convierte a array, invierte, convierte de vuelta a string
</details>

<details>
<summary>💡 Hint 2</summary>

```javascript
// Opción A: Loop reverso
function reverseString(str) {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    // ¿Qué hacer con str[i]?
  }
  return result;
}

// Opción B: Array
function reverseString(str) {
  return str.split('')./* ¿qué método? */.join('');
}
```

</details>

<details>
<summary>✅ Solución</summary>

```javascript
// Solución 1: Loop reverso
function reverseString(str) {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}

// Solución 2: Array reverse
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Solución 3: Reduce
function reverseString(str) {
  return str.split('').reduce((reversed, char) => char + reversed, '');
}

// Solución 4: For...of
function reverseString(str) {
  let result = '';
  for (const char of str) {
    result = char + result; // Prepend cada carácter
  }
  return result;
}
```

**Explicación**:

- **Solución 1**: Recorremos desde el final (`str.length - 1`) hasta el inicio (`0`) y concatenamos
- **Solución 2**: Convertimos a array con `split('')`, usamos `reverse()`, volvemos a string con `join('')`
- **Solución 3**: Usamos reduce agregando cada carácter al inicio del acumulador
</details>

---

### Ejercicio 1.4: Contar Vocales (10 minutos)

**Problema**: Cuenta cuántas vocales (a, e, i, o, u) hay en un string.

```javascript
// Ejemplo
console.log(countVowels('hello')); // 2 (e, o)
console.log(countVowels('javascript')); // 3 (a, a, i)
console.log(countVowels('xyz')); // 0
```

**Tu solución:**

```javascript
function countVowels(str) {
  // Escribe tu código aquí
  const vowels = 'aeiou'
  let count = 0

  for(let char of str.toLowerCase()){
      if(vowels.includes(char)) count++
  }
  return count
}
```

<details>
<summary>💡 Hint 1</summary>

Pasos:

1. Convierte el string a minúsculas (para manejar 'A' y 'a' igual)
2. Crea un contador que empiece en 0
3. Recorre cada letra
4. Si la letra es vocal, incrementa el contador
</details>

<details>
<summary>💡 Hint 2</summary>

```javascript
function countVowels(str) {
  const vowels = 'aeiou';
  let count = 0;

  for (const char of str.toLowerCase()) {
    if (/* ¿cómo verificar si char está en vowels? */) {
      count++;
    }
  }

  return count;
}
```

</details>

<details>
<summary>✅ Solución</summary>

```javascript
// Solución 1: includes()
function countVowels(str) {
  const vowels = 'aeiou';
  let count = 0;

  for (const char of str.toLowerCase()) {
    if (vowels.includes(char)) {
      count++;
    }
  }

  return count;
}

// Solución 2: RegExp
function countVowels(str) {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

// Solución 3: Set para búsqueda más rápida
function countVowels(str) {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  let count = 0;

  for (const char of str.toLowerCase()) {
    if (vowels.has(char)) {
      count++;
    }
  }

  return count;
}
```

**Explicación**:

- Convertimos a minúsculas para simplificar (`toLowerCase()`)
- Verificamos cada carácter con `includes()` (o `has()` para Set)
- Incrementamos contador cuando encontramos vocal
- RegExp: `[aeiou]` busca cualquier vocal, `g` = global, `i` = case-insensitive
</details>

---

## NIVEL 2: Objetos y Métodos de Array

### Ejercicio 2.1: Filtrar Pares (8 minutos)

**Problema**: Retorna un nuevo array solo con los números pares.

```javascript
// Ejemplo
console.log(filterEvens([1, 2, 3, 4, 5, 6])); // [2, 4, 6]
console.log(filterEvens([1, 3, 5])); // []
console.log(filterEvens([10, 20, 30])); // [10, 20, 30]
```

**Tu solución:**

```javascript
function filterEvens(arr) {
  // Escribe tu código aquí
  return arr.filter(num=> num %2 === 0 ? num : null)
}
```

<details>
<summary>💡 Hint 1</summary>

¿Cómo saber si un número es par?

- Un número es par si `numero % 2 === 0`
- El operador `%` (módulo) da el residuo de una división
</details>

<details>
<summary>💡 Hint 2</summary>

```javascript
// Opción A: Loop manual
function filterEvens(arr) {
  const result = [];
  for (const num of arr) {
    if (/* ¿número es par? */) {
      result.push(num);
    }
  }
  return result;
}

// Opción B: Método de array
function filterEvens(arr) {
  return arr.filter(num => /* ¿condición? */);
}
```

</details>

<details>
<summary>✅ Solución</summary>

```javascript
// Solución 1: Loop manual
function filterEvens(arr) {
  const result = [];
  for (const num of arr) {
    if (num % 2 === 0) {
      result.push(num);
    }
  }
  return result;
}

// Solución 2: filter() (recomendado)
function filterEvens(arr) {
  return arr.filter(num => num % 2 === 0);
}
```

**Explicación**:

- `num % 2` da el residuo al dividir entre 2
- Si el residuo es 0, el número es par
- `filter()` crea un nuevo array con elementos que pasan la condición
</details>

---

### Ejercicio 2.2: Duplicar Valores (8 minutos)

**Problema**: Retorna un nuevo array con cada valor duplicado.

```javascript
// Ejemplo
console.log(double([1, 2, 3])); // [2, 4, 6]
console.log(double([10, 20])); // [20, 40]
console.log(double([])); // []
```

**Tu solución:**

```javascript
function double(arr) {
  // Escribe tu código aquí

return arr.map(num => num * 2)
}
```

<details>
<summary>💡 Hint</summary>

Necesitas **transformar** cada elemento.

- ¿Qué método de array transforma elementos? 🤔
</details>

<details>
<summary>✅ Solución</summary>

```javascript
// Solución 1: map()
function double(arr) {
  return arr.map(num => num * 2);
}

// Solución 2: Loop manual
function double(arr) {
  const result = [];
  for (const num of arr) {
    result.push(num * 2);
  }
  return result;
}
```

**Explicación**:

- `map()` transforma cada elemento y retorna nuevo array
- Multiplicamos cada número por 2
- El array original no se modifica (inmutabilidad)
</details>

---

### Ejercicio 2.3: Obtener Propiedades (10 minutos)

**Problema**: Dado un array de objetos, retorna un array solo con una propiedad específica.

```javascript
// Ejemplo
const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 }
];

console.log(getNames(users)); // ['Alice', 'Bob', 'Charlie']
```

**Tu solución:**

```javascript
function getNames(users) {
  // Escribe tu código aquí
  return users.map(user => user.name)
}
```

<details>
<summary>💡 Hint</summary>

Necesitas:

1. Transformar cada objeto a solo su propiedad `name`
2. ¿Qué método sirve para transformar arrays?
</details>

<details>
<summary>✅ Solución</summary>

```javascript
// Solución 1: map()
function getNames(users) {
  return users.map(user => user.name);
}

// Solución 2: Loop manual
function getNames(users) {
  const names = [];
  for (const user of users) {
    names.push(user.name);
  }
  return names;
}

// Bonus: Función genérica para cualquier propiedad
function pluck(arr, key) {
  return arr.map(obj => obj[key]);
}

// Uso:
pluck(users, 'name'); // ['Alice', 'Bob', 'Charlie']
pluck(users, 'age'); // [25, 30, 35]
```

**Explicación**:

- `map()` extrae la propiedad de cada objeto
- `user => user.name` es una arrow function que retorna solo el nombre
- Acceso a propiedades: `obj.property` o `obj['property']`
</details>

---

### Ejercicio 2.4: Buscar por ID (12 minutos)

**Problema**: Encuentra un usuario por su ID.

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

console.log(findById(users, 2)); // { id: 2, name: 'Bob' }
console.log(findById(users, 99)); // undefined
```

**Tu solución:**

```javascript
function findById(users, id) {
  // Escribe tu código aquí
  return users.find(user => user.id === id)
}
```

<details>
<summary>💡 Hint</summary>

Necesitas:

1. Buscar el **primer** objeto que cumpla una condición
2. ¿Qué método de array hace esto?
</details>

<details>
<summary>✅ Solución</summary>

```javascript
// Solución 1: find()
function findById(users, id) {
  return users.find(user => user.id === id);
}

// Solución 2: Loop manual
function findById(users, id) {
  for (const user of users) {
    if (user.id === id) {
      return user; // Retorna inmediatamente
    }
  }
  return undefined; // No encontrado
}
```

**Explicación**:

- `find()` retorna el **primer elemento** que cumple la condición
- Si no encuentra nada, retorna `undefined`
- La condición es `user.id === id` (comparación estricta)
</details>

---

## NIVEL 3: Closures y Funciones

### Ejercicio 3.1: Contador Simple (10 minutos)

**Problema**: Crea una función que retorne otra función. Cada vez que llames a la función retornada, debe incrementar y retornar un contador.

```javascript
// Ejemplo
const counter = createCounter();
counter(); // 1
counter(); // 2
counter(); // 3

const counter2 = createCounter();
counter2(); // 1 (nuevo contador independiente)
```

**Tu solución:**

```javascript
function createCounter() {
  // Escribe tu código aquí
  let count = 0
  return function(){
    return count++
  }
  return count
}
```

<details>
<summary>💡 Hint 1</summary>

Necesitas:

1. Una variable `count` que persista entre llamadas
2. Retornar una función que incremente y retorne `count`
3. Esto usa **closures** - la función interna recuerda variables de la función externa
</details>

<details>
<summary>💡 Hint 2</summary>

```javascript
function createCounter() {
  let count = 0; // Esta variable "vive" en el closure

  return function() {
    // ¿Qué hacer con count?
  };
}
```

</details>

<details>
<summary>✅ Solución</summary>

```javascript
function createCounter() {
  let count = 0;

  return function() {
    count++;
    return count;
  };
}

// Uso:
const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// Cada llamada a createCounter() crea un nuevo closure
const counter2 = createCounter();
console.log(counter2()); // 1 (independiente del primero)
```

**¿Por qué funciona?**

- `count` está en el scope de `createCounter()`
- La función retornada forma un **closure** - recuerda `count`
- Cada llamada a `createCounter()` crea un nuevo closure con su propio `count`
- `count` persiste entre llamadas a la función retornada

**Este patrón se usa en React:**

```javascript
// Similar a useState!
function useState(initialValue) {
  let state = initialValue;

  function setState(newValue) {
    state = newValue;
    // trigger re-render...
  }

  return [state, setState];
}
```

</details>

---

### Ejercicio 3.2: Multiplicador (12 minutos)

**Problema**: Crea una función que retorne otra función. La función retornada debe multiplicar su argumento por el valor guardado.

```javascript
// Ejemplo
const multiplyBy2 = createMultiplier(2);
multiplyBy2(5); // 10
multiplyBy2(10); // 20

const multiplyBy10 = createMultiplier(10);
multiplyBy10(5); // 50
```

**Tu solución:**

```javascript
function createMultiplier(multiplier) {
  // Escribe tu código aquí
  return function(num){
    return num * multiplier
  }
}
```

<details>
<summary>💡 Hint</summary>

Similar al ejercicio anterior:

1. `multiplier` se guarda en el closure
2. Retornas una función que recibe `num`
3. La función retornada multiplica `num * multiplier`
</details>

<details>
<summary>✅ Solución</summary>

```javascript
function createMultiplier(multiplier) {
  return function(num) {
    return num * multiplier;
  };
}

// Versión con arrow function (más concisa)
const createMultiplier = (multiplier) => (num) => num * multiplier;

// Uso:
const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

**Aplicación en React:**

```javascript
// Event handlers con closures
function TodoList() {
  const handleDelete = (id) => {
    return () => {
      deleteTodo(id); // id está en el closure
    };
  };

  return todos.map(todo => (
    <button onClick={handleDelete(todo.id)}>
      Delete
    </button>
  ));
}
```

</details>

---

## NIVEL 4: Promesas Básicas

### Ejercicio 4.1: Delay Simple (10 minutos)

**Problema**: Crea una función que retorne una Promise que se resuelva después de X milisegundos.

```javascript
// Ejemplo
console.log(delay(1000).then(() => console.log('1 segundo después')));
console.log(delay(2000).then(() => console.log('2 segundos después')));
```

**Tu solución:**

```javascript
function delay(ms) {
  // Escribe tu código aquí
  const response = new Promise((resolve)=>{
    setTimeout(resolve, ms)
  })
  return response.then(() => console.log('a second after'))
}
```

<details>
<summary>💡 Hint</summary>

Necesitas:

1. Retornar `new Promise((resolve, reject) => { ... })`
2. Usar `setTimeout` dentro de la Promise
3. Llamar a `resolve()` después del delay
</details>

<details>
<summary>✅ Solución</summary>

```javascript
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Uso con .then()
delay(1000).then(() => {
  console.log('Ejecutado después de 1 segundo');
});

// Uso con async/await
async function example() {
  console.log('Inicio');
  await delay(2000);
  console.log('2 segundos después');
}
```

**Explicación**:

- `new Promise()` crea una nueva promesa
- `resolve` es una función que marca la promesa como exitosa
- `setTimeout(resolve, ms)` llama a `resolve` después de `ms` milisegundos
- Cuando la promesa se resuelve, el `.then()` o `await` continúa
</details>

---

### Ejercicio 4.2: Fetch con Timeout (15 minutos)

**Problema**: Crea una función que haga fetch pero con un timeout. Si tarda más de X ms, rechaza la promesa.

```javascript
// Ejemplo
fetchWithTimeout('https://api.example.com/data', 3000)
  .then(data => console.log(data))
  .catch(err => console.error('Timeout o error'));
```

**Tu solución:**

```javascript
function fetchWithTimeout(url, timeout) {
  // Escribe tu código aquí
  const fetchPromise = fetch(url).then(res => res.json())
  const timePromise = new Promise((_, reject)=>{
    setTimeout(()=>{
      reject(new Error('Request timeout'))
    }, timeout)
  })
  return Promise.race([fetchPromise, timePromise])
}
```

<details>
<summary>💡 Hint 1</summary>

Estrategia:

1. Crea dos promesas: una para el fetch, otra para el timeout
2. Usa `Promise.race()` para ver cuál termina primero
3. Si el timeout termina primero, rechaza la promesa
</details>

<details>
<summary>💡 Hint 2</summary>

```javascript
function fetchWithTimeout(url, timeout) {
  const fetchPromise = fetch(url);

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeout);
  });

  return Promise.race([/* ¿qué promesas? */]);
}
```

</details>

<details>
<summary>✅ Solución</summary>

```javascript
function fetchWithTimeout(url, timeout) {
  // Promesa del fetch
  const fetchPromise = fetch(url).then(res => res.json());

  // Promesa del timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);
  });

  // Race: la que termine primero gana
  return Promise.race([fetchPromise, timeoutPromise]);
}

// Uso:
fetchWithTimeout('https://jsonplaceholder.typicode.com/todos/1', 3000)
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err.message));

// Versión con async/await
async function fetchWithTimeout(url, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}
```

**Explicación**:

- `Promise.race()` retorna la promesa que se resuelve/rechaza primero
- Si el fetch termina antes del timeout, retorna los datos
- Si el timeout termina primero, rechaza con error
- Versión con AbortController es más moderna y permite cancelar el fetch real
</details>

---

## 🎯 Próximos Pasos

Una vez domines estos ejercicios:

1. ✅ **Repite sin ver soluciones** - hasta que puedas hacerlos de memoria
2. ✅ **Explica en voz alta** - practica para la entrevista
3. ✅ **Modifica los ejercicios** - cambia requisitos, agrega features
4. ✅ **Pasa a PRACTICE-PROBLEMS.md** - ejercicios más avanzados (debounce, deep clone)

**Recuerda**: No importa si tardas más tiempo. Lo importante es **entender** cada línea de código.
