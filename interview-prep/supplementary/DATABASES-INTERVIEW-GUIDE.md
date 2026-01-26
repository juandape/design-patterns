# Bases de Datos - Guía Rápida para Entrevista EPAM

## 📚 1 Hora de Estudio - SQL y NoSQL

---

## 🎯 SQL (Bases de Datos Relacionales)

### ¿Qué es SQL?

**Analogía:** Una biblioteca organizada con fichas de catálogo.

- Libros = Filas (rows)
- Estantes = Tablas (tables)
- Fichas = Relaciones entre libros

---

## 1. SELECT - Leer Datos

```sql
-- Básico: Leer todo
SELECT * FROM usuarios;

-- Específico: Solo ciertas columnas
SELECT nombre, email FROM usuarios;

-- Con filtro (WHERE)
SELECT * FROM usuarios WHERE edad > 18;

-- Ordenar (ORDER BY)
SELECT * FROM usuarios ORDER BY edad DESC;

-- Limitar resultados
SELECT * FROM usuarios LIMIT 10;

-- Múltiples condiciones
SELECT * FROM usuarios
WHERE edad > 18 AND pais = 'México'
ORDER BY nombre;
```

**Analogía:** Es como buscar en Google con filtros.

---

## 2. PK y FK (Primary Key & Foreign Key)

### Primary Key (PK)

**Analogía:** Tu INE/DNI - Identifica ÚNICAMENTE a una persona.

```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY,           -- ✅ PK: Único, no nulo
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE     -- Único pero puede ser nulo
);

-- No puede haber dos usuarios con mismo id
```

### Foreign Key (FK)

**Analogía:** Tu número de empleado que te relaciona con tu empresa.

```sql
CREATE TABLE ordenes (
  id INT PRIMARY KEY,
  usuario_id INT,                          -- ✅ FK
  producto VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- usuario_id DEBE existir en tabla usuarios
-- Mantiene integridad referencial
```

**Resumen:**

- **PK** = Identificador único en TU tabla
- **FK** = Referencia al PK de OTRA tabla

---

## 3. JOINs - Unir Tablas

**Analogía:** Juntar piezas de un rompecabezas.

```sql
-- Datos de ejemplo:
-- usuarios:          ordenes:
-- id | nombre        id | usuario_id | producto
-- 1  | Juan          1  | 1          | Laptop
-- 2  | Ana           2  | 1          | Mouse
-- 3  | Pedro         3  | 2          | Teclado
```

### INNER JOIN (Solo coincidencias)

```sql
SELECT u.nombre, o.producto
FROM usuarios u
INNER JOIN ordenes o ON u.id = o.usuario_id;

-- Resultado:
-- nombre | producto
-- Juan   | Laptop
-- Juan   | Mouse
-- Ana    | Teclado
-- (Pedro no aparece - no tiene órdenes)
```

**Analogía:** Solo estudiantes que entregaron tarea.

### LEFT JOIN (Todos de la izquierda)

```sql
SELECT u.nombre, o.producto
FROM usuarios u
LEFT JOIN ordenes o ON u.id = o.usuario_id;

-- Resultado:
-- nombre | producto
-- Juan   | Laptop
-- Juan   | Mouse
-- Ana    | Teclado
-- Pedro  | NULL       ✅ Aparece aunque no tenga órdenes
```

**Analogía:** TODOS los estudiantes, incluso los que no entregaron tarea.

### RIGHT JOIN (Todos de la derecha)

```sql
SELECT u.nombre, o.producto
FROM usuarios u
RIGHT JOIN ordenes o ON u.id = o.usuario_id;

-- Igual que LEFT pero al revés
```

### FULL OUTER JOIN (Todos de ambos lados)

```sql
SELECT u.nombre, o.producto
FROM usuarios u
FULL OUTER JOIN ordenes o ON u.id = o.usuario_id;

-- Todos los usuarios + Todas las órdenes
-- Aunque no coincidan
```

**Truco para recordar:**

- **INNER** = Solo los que COINCIDEN (intersección ∩)
- **LEFT** = TODO de la izquierda + coincidencias
- **RIGHT** = TODO de la derecha + coincidencias
- **FULL** = TODO de ambos lados

---

## 4. Normalización de Datos

**Objetivo:** Eliminar redundancia (duplicación de datos).

**Analogía:** No repetir tu dirección en cada pedido, solo guardarla una vez.

### ❌ SIN Normalización (mal)

```sql
-- Tabla: ordenes
id | nombre_cliente | email_cliente     | producto | precio
1  | Juan          | juan@email.com    | Laptop   | 1000
2  | Juan          | juan@email.com    | Mouse    | 20
3  | Ana           | ana@email.com     | Teclado  | 50

-- ❌ Problemas:
-- - Datos de Juan duplicados
-- - Si Juan cambia email, hay que actualizar múltiples filas
-- - Desperdicio de espacio
```

### ✅ CON Normalización (bien)

```sql
-- Tabla: clientes
id | nombre | email
1  | Juan   | juan@email.com
2  | Ana    | ana@email.com

-- Tabla: ordenes
id | cliente_id | producto | precio
1  | 1         | Laptop   | 1000
2  | 1         | Mouse    | 20
3  | 2         | Teclado  | 50

-- ✅ Ventajas:
-- - Datos de clientes en UN solo lugar
-- - Cambiar email = actualizar UNA fila
-- - Ahorro de espacio
```

**Regla Simple:** Si la misma información se repite, probablemente necesitas otra tabla.

---

## 5. DML - Manipular Datos

```sql
-- INSERT - Crear
INSERT INTO usuarios (nombre, email, edad)
VALUES ('Juan', 'juan@email.com', 30);

INSERT INTO usuarios (nombre, email)
VALUES ('Ana', 'ana@email.com'),
       ('Pedro', 'pedro@email.com');  -- Múltiples filas

-- UPDATE - Modificar
UPDATE usuarios
SET edad = 31
WHERE id = 1;

UPDATE usuarios
SET pais = 'México'
WHERE edad > 18;

-- DELETE - Eliminar
DELETE FROM usuarios WHERE id = 1;

DELETE FROM usuarios WHERE edad < 18;

-- TRUNCATE - Eliminar TODO (más rápido que DELETE)
TRUNCATE TABLE usuarios;

-- MERGE - Insertar o actualizar (UPSERT)
MERGE INTO usuarios AS target
USING (VALUES (1, 'Juan', 'juan@new.com')) AS source (id, nombre, email)
ON target.id = source.id
WHEN MATCHED THEN
  UPDATE SET email = source.email
WHEN NOT MATCHED THEN
  INSERT (id, nombre, email) VALUES (source.id, source.nombre, source.email);
```

**Resumen:**

- **INSERT** = Agregar nuevos
- **UPDATE** = Modificar existentes
- **DELETE** = Borrar específicos
- **TRUNCATE** = Borrar todos (rápido)
- **MERGE** = Insertar o actualizar (upsert)

---

## 6. DDL - Definir Estructura

```sql
-- CREATE - Crear tabla
CREATE TABLE productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10, 2),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALTER - Modificar tabla existente
ALTER TABLE productos ADD COLUMN categoria VARCHAR(50);
ALTER TABLE productos DROP COLUMN stock;
ALTER TABLE productos MODIFY COLUMN precio DECIMAL(12, 2);
ALTER TABLE productos RENAME TO items;

-- DROP - Eliminar tabla
DROP TABLE productos;

-- DROP DATABASE - Eliminar base de datos completa
DROP DATABASE mi_tienda;
```

**Resumen:**

- **CREATE** = Crear estructura
- **ALTER** = Modificar estructura
- **DROP** = Eliminar estructura

---

## 7. Transactions & ACID

### Transaction

**Analogía:** Transferencia bancaria - TODO o NADA.

```sql
START TRANSACTION;

-- 1. Restar dinero de cuenta A
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;

-- 2. Sumar dinero a cuenta B
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;

-- ✅ Si todo está bien
COMMIT;

-- ❌ Si algo falla
ROLLBACK;
```

**Sin transactions:** Si falla paso 2, cuenta A perdió dinero sin que B lo reciba.

### ACID

**A**tomicity (Atomicidad)

- Todo o nada
- Si una parte falla, TODO se deshace

**C**onsistency (Consistencia)

- Datos siempre válidos
- No se rompen reglas (FK, PK, etc.)

**I**solation (Aislamiento)

- Transactions no se afectan entre sí
- Transaction A no ve cambios incompletos de Transaction B

**D**urability (Durabilidad)

- Una vez confirmado (COMMIT), datos persisten
- Aunque se caiga el servidor

**Truco:** **A**llan **C**ome **I**n **D**aily (mnemotécnico)

---

## 8. Tipos de Relaciones

### 1-to-1 (Uno a Uno)

**Analogía:** Una persona - Un pasaporte

```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY,
  nombre VARCHAR(100)
);

CREATE TABLE pasaportes (
  id INT PRIMARY KEY,
  numero VARCHAR(20),
  usuario_id INT UNIQUE,  -- ✅ UNIQUE garantiza 1-to-1
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Un usuario tiene UN pasaporte
-- Un pasaporte pertenece a UN usuario
```

### 1-to-Many (Uno a Muchos)

**Analogía:** Un cliente - Muchas órdenes

```sql
CREATE TABLE clientes (
  id INT PRIMARY KEY,
  nombre VARCHAR(100)
);

CREATE TABLE ordenes (
  id INT PRIMARY KEY,
  cliente_id INT,
  producto VARCHAR(100),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Un cliente puede tener MUCHAS órdenes
-- Una orden pertenece a UN cliente
```

### Many-to-Many (Muchos a Muchos)

**Analogía:** Estudiantes - Cursos (un estudiante en varios cursos, un curso con varios estudiantes)

```sql
CREATE TABLE estudiantes (
  id INT PRIMARY KEY,
  nombre VARCHAR(100)
);

CREATE TABLE cursos (
  id INT PRIMARY KEY,
  nombre VARCHAR(100)
);

-- ✅ Tabla intermedia (junction/pivot table)
CREATE TABLE inscripciones (
  estudiante_id INT,
  curso_id INT,
  fecha_inscripcion DATE,
  PRIMARY KEY (estudiante_id, curso_id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- Un estudiante → Muchos cursos
-- Un curso → Muchos estudiantes
```

---

## 9. Subqueries (Subconsultas)

### Devuelve UN valor

```sql
-- Encontrar usuarios mayores que el promedio
SELECT * FROM usuarios
WHERE edad > (SELECT AVG(edad) FROM usuarios);

-- Subconsulta devuelve: 28.5 (un solo valor)
```

### Devuelve VARIAS filas

```sql
-- Usuarios que han hecho órdenes
SELECT * FROM usuarios
WHERE id IN (SELECT DISTINCT usuario_id FROM ordenes);

-- Subconsulta devuelve: [1, 2, 5] (varios valores)
```

### Devuelve VARIAS columnas

```sql
-- Productos con precio máximo por categoría
SELECT p.*
FROM productos p
WHERE (categoria, precio) IN (
  SELECT categoria, MAX(precio)
  FROM productos
  GROUP BY categoria
);

-- Subconsulta devuelve: [('Electrónica', 1000), ('Ropa', 50)]
```

**Analogía:** Una pregunta dentro de otra pregunta.

---

## 10. ORM/ODM

**ORM** (Object-Relational Mapping) = Traducir objetos a SQL

**Analogía:** Traductor automático entre JavaScript y SQL.

```javascript
// ❌ SQL Manual
const result = await db.query(
  'SELECT * FROM usuarios WHERE edad > ?',
  [18]
);

// ✅ ORM (Sequelize, TypeORM, Prisma)
const usuarios = await User.findAll({
  where: { edad: { gt: 18 } }
});

// ✅ Ventajas:
// - No escribir SQL a mano
// - Type-safe (TypeScript)
// - Previene SQL injection
// - Abstracción de base de datos

// ❌ Desventajas:
// - Queries complejas son difíciles
// - Performance overhead
// - Menos control
```

---

## 🔥 NoSQL (MongoDB)

### ¿Qué es NoSQL?

**Analogía:** Cajón de documentos vs. Archivero con carpetas.

**SQL = Archivero ordenado** (tablas, filas, columnas)
**NoSQL = Cajón flexible** (documentos JSON)

---

## 1. Crear Collection

```javascript
// ✅ Implícito (se crea al insertar primer documento)
db.usuarios.insertOne({ nombre: "Juan", edad: 30 });

// ✅ Explícito
db.createCollection("usuarios");

// ✅ Con validación
db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      required: ["nombre", "email"],
      properties: {
        nombre: { bsonType: "string" },
        edad: { bsonType: "int", minimum: 0 }
      }
    }
  }
});
```

---

## 2. CRUD en MongoDB

### Insert (Crear)

```javascript
// Uno
db.usuarios.insertOne({
  nombre: "Juan",
  email: "juan@email.com",
  edad: 30,
  tags: ["developer", "javascript"]
});

// Muchos
db.usuarios.insertMany([
  { nombre: "Ana", edad: 28 },
  { nombre: "Pedro", edad: 35 }
]);
```

### Find (Leer)

```javascript
// Todos
db.usuarios.find();

// Con filtro
db.usuarios.find({ edad: { $gt: 25 } });  // Mayor que 25

// Uno solo
db.usuarios.findOne({ email: "juan@email.com" });

// Proyección (solo ciertas columnas)
db.usuarios.find(
  { edad: { $gt: 25 } },
  { nombre: 1, email: 1, _id: 0 }  // 1=incluir, 0=excluir
);

// Paginación
db.usuarios.find()
  .skip(20)   // Saltar 20
  .limit(10)  // Traer 10
  .sort({ edad: -1 });  // Ordenar por edad descendente
```

### Update (Actualizar)

```javascript
// Actualizar uno
db.usuarios.updateOne(
  { email: "juan@email.com" },
  { $set: { edad: 31 } }
);

// Actualizar muchos
db.usuarios.updateMany(
  { edad: { $lt: 18 } },
  { $set: { esMenor: true } }
);

// Upsert (update o insert)
db.usuarios.updateOne(
  { email: "nuevo@email.com" },
  { $set: { nombre: "Nuevo", edad: 25 } },
  { upsert: true }  // Si no existe, lo crea
);
```

### Delete (Eliminar)

```javascript
// Eliminar uno
db.usuarios.deleteOne({ email: "juan@email.com" });

// Eliminar muchos
db.usuarios.deleteMany({ edad: { $lt: 18 } });

// Eliminar todos
db.usuarios.deleteMany({});
```

---

## 3. Operadores de Comparación

```javascript
// Mayor que
db.usuarios.find({ edad: { $gt: 25 } });

// Mayor o igual
db.usuarios.find({ edad: { $gte: 25 } });

// Menor que
db.usuarios.find({ edad: { $lt: 30 } });

// Menor o igual
db.usuarios.find({ edad: { $lte: 30 } });

// No igual
db.usuarios.find({ status: { $ne: "inactivo" } });

// En array
db.usuarios.find({ edad: { $in: [25, 30, 35] } });

// No en array
db.usuarios.find({ edad: { $nin: [25, 30, 35] } });

// Existe
db.usuarios.find({ telefono: { $exists: true } });

// Array contiene
db.usuarios.find({ tags: "developer" });

// AND (implícito)
db.usuarios.find({ edad: { $gt: 25 }, pais: "México" });

// OR
db.usuarios.find({
  $or: [
    { edad: { $lt: 18 } },
    { edad: { $gt: 65 } }
  ]
});
```

**Truco:** `$gt` = Greater Than, `$lt` = Less Than

---

## 4. Indexes (Índices)

**Analogía:** Índice de un libro - Encontrar temas rápidamente.

```javascript
// ✅ SIN index: MongoDB escanea TODOS los documentos
db.usuarios.find({ email: "juan@email.com" });  // Lento con millones

// ✅ CON index: Acceso directo
db.usuarios.createIndex({ email: 1 });  // 1=ascendente, -1=descendente
db.usuarios.find({ email: "juan@email.com" });  // Rápido ⚡

// Index compuesto (múltiples campos)
db.usuarios.createIndex({ pais: 1, edad: -1 });

// Index único (no duplicados)
db.usuarios.createIndex({ email: 1 }, { unique: true });

// Ver indexes
db.usuarios.getIndexes();

// Eliminar index
db.usuarios.dropIndex("email_1");
```

**Cuándo usar:**

- ✅ Campos que usas frecuentemente en queries
- ✅ Campos en `sort()`
- ❌ Colecciones pequeñas (< 1000 docs)

---

## 5. Normalización vs Embedding

### Embedding (Embeber) - Denormalizado

**Analogía:** Guardar todo en una mochila.

```javascript
// ✅ TODO en un documento
{
  _id: 1,
  nombre: "Juan",
  email: "juan@email.com",
  direccion: {  // Embebido
    calle: "Main St",
    ciudad: "CDMX"
  },
  ordenes: [  // Array embebido
    { producto: "Laptop", precio: 1000 },
    { producto: "Mouse", precio: 20 }
  ]
}

// ✅ Ventaja: Una sola query
db.usuarios.findOne({ _id: 1 });  // Trae TODO

// ❌ Desventaja: Duplicación si se comparte
```

**Usar cuando:**

- Datos siempre se acceden juntos
- Relación 1-to-1 o 1-to-few
- Datos no cambian frecuentemente

### Referencias - Normalizado

**Analogía:** Guardar nota con ubicación del artículo.

```javascript
// usuarios collection
{
  _id: 1,
  nombre: "Juan",
  email: "juan@email.com"
}

// ordenes collection
{
  _id: 101,
  usuario_id: 1,  // Referencia
  producto: "Laptop",
  precio: 1000
}

// ❌ Necesitas JOIN ($lookup)
db.ordenes.aggregate([
  {
    $lookup: {
      from: "usuarios",
      localField: "usuario_id",
      foreignField: "_id",
      as: "usuario"
    }
  }
]);

// ✅ Ventaja: No duplicación
// ❌ Desventaja: Requiere JOIN (más lento)
```

**Usar cuando:**

- Datos se acceden por separado
- Relación many-to-many
- Datos cambian frecuentemente

---

## 6. $lookup (JOIN en MongoDB)

```javascript
// Ordenes con información de usuario
db.ordenes.aggregate([
  {
    $lookup: {
      from: "usuarios",           // Colección a unir
      localField: "usuario_id",   // Campo en ordenes
      foreignField: "_id",        // Campo en usuarios
      as: "infoUsuario"          // Nombre del resultado
    }
  }
]);

// Resultado:
{
  _id: 101,
  usuario_id: 1,
  producto: "Laptop",
  infoUsuario: [  // Array con usuario
    { _id: 1, nombre: "Juan", email: "juan@email.com" }
  ]
}

// Aplanar array ($unwind)
db.ordenes.aggregate([
  {
    $lookup: {
      from: "usuarios",
      localField: "usuario_id",
      foreignField: "_id",
      as: "usuario"
    }
  },
  { $unwind: "$usuario" }  // Convierte array a objeto
]);
```

---

## 7. Aggregation (Agrupar y Calcular)

**Analogía:** Hoja de Excel con fórmulas SUM, AVG, COUNT.

```javascript
// Contar usuarios por país
db.usuarios.aggregate([
  {
    $group: {
      _id: "$pais",              // Agrupar por
      total: { $sum: 1 },        // Contar
      edadPromedio: { $avg: "$edad" },
      edadMax: { $max: "$edad" },
      edadMin: { $min: "$edad" }
    }
  }
]);

// Resultado:
[
  { _id: "México", total: 150, edadPromedio: 28.5, edadMax: 65, edadMin: 18 },
  { _id: "USA", total: 200, edadPromedio: 32.1, edadMax: 70, edadMin: 20 }
]

// Pipeline completo
db.ordenes.aggregate([
  { $match: { status: "completada" } },      // 1. Filtrar
  { $group: {                                // 2. Agrupar
      _id: "$producto",
      totalVentas: { $sum: "$cantidad" }
    }
  },
  { $sort: { totalVentas: -1 } },            // 3. Ordenar
  { $limit: 10 }                             // 4. Top 10
]);
```

---

## 8. Sharding (Particionar Datos)

**Analogía:** Dividir biblioteca en múltiples edificios.

**¿Por qué?** Cuando datos son demasiados para un servidor.

```javascript
// Habilitar sharding
sh.enableSharding("miDB");

// Particionar colección por user_id
sh.shardCollection("miDB.usuarios", { user_id: 1 });

// MongoDB distribuye automáticamente:
// Servidor 1: usuarios con user_id 1-1000
// Servidor 2: usuarios con user_id 1001-2000
// Servidor 3: usuarios con user_id 2001-3000
```

---

## 9. Replication (Copias de Seguridad)

**Analogía:** Copias de respaldo de tu tesis en 3 USBs.

```
Primary (Escritura) ──┐
                      ├──► Datos replicados
Secondary (Lectura) ──┤
Secondary (Lectura) ──┘
```

**Beneficios:**

- ✅ Si Primary falla, Secondary se vuelve Primary
- ✅ Alta disponibilidad
- ✅ Leer de Secondaries (escalar lecturas)

---

## 10. Backup/Restore

```bash
# Backup completo
mongodump --db miDB --out /backup/

# Restore
mongorestore --db miDB /backup/miDB/

# Backup comprimido
mongodump --db miDB --archive=/backup/miDB.gz --gzip

# Restore comprimido
mongorestore --archive=/backup/miDB.gz --gzip
```

---

## 11. Redis (Caché)

**Analogía:** Notas post-it vs. buscar en archivero.

```javascript
// Sin caché (lento)
async function getUser(id) {
  return await db.usuarios.findOne({ _id: id });
  // Consulta a DB cada vez
}

// Con caché Redis (rápido)
async function getUser(id) {
  // 1. Buscar en caché
  let user = await redis.get(`user:${id}`);
  if (user) return JSON.parse(user);  // ⚡ Rápido

  // 2. No está en caché, buscar en DB
  user = await db.usuarios.findOne({ _id: id });

  // 3. Guardar en caché (1 hora)
  await redis.setEx(`user:${id}`, 3600, JSON.stringify(user));

  return user;
}

// Invalidar caché al actualizar
async function updateUser(id, data) {
  await db.usuarios.updateOne({ _id: id }, { $set: data });
  await redis.del(`user:${id}`);  // Borrar caché
}
```

**Usar cuando:**

- Datos que se leen frecuentemente
- Datos que no cambian mucho
- Queries costosas

---

## 12. ElasticSearch (Búsqueda)

**Analogía:** Google vs. buscar en archivos de Word.

**MongoDB text search = básico**
**ElasticSearch = avanzado (relevancia, typos, sinónimos)**

```javascript
// Búsqueda simple en MongoDB
db.articulos.find({ $text: { $search: "javascript" } });

// Búsqueda avanzada en ElasticSearch
await esClient.search({
  index: 'articulos',
  query: {
    multi_match: {
      query: "javascrip",  // ✅ Encuentra "javascript" (typo)
      fields: ['titulo^2', 'contenido'],  // Prioriza título
      fuzziness: "AUTO"  // Tolera errores
    }
  }
});
```

---

## 📊 SQL vs NoSQL - Comparación Rápida

| Aspecto           | SQL                                | NoSQL (MongoDB)                |
| ----------------- | ---------------------------------- | ------------------------------ |
| **Estructura**    | Tablas (filas/columnas)            | Documentos (JSON)              |
| **Schema**        | Fijo (predefinido)                 | Flexible (dinámico)            |
| **Relaciones**    | JOINs nativos                      | Embedding o $lookup            |
| **Escalabilidad** | Vertical (servidor más potente)    | Horizontal (más servidores)    |
| **ACID**          | ✅ Sí (siempre)                    | ⚠️ Limitado (en transacciones) |
| **Mejor para**    | Datos estructurados, transacciones | Datos variables, velocidad     |
| **Ejemplos**      | PostgreSQL, MySQL                  | MongoDB, DynamoDB              |

---

## 🎯 Tips para la Entrevista

### Preguntas Comunes

**1. ¿Cuándo usar SQL vs NoSQL?**

- **SQL:** Finanzas, inventario, datos estructurados
- **NoSQL:** Redes sociales, catálogos, logs

**2. ¿Qué es un JOIN?**

- Unir datos de múltiples tablas usando claves relacionadas

**3. ¿Qué es ACID?**

- **A**tomicity, **C**onsistency, **I**solation, **D**urability
- Garantías de transacciones

**4. ¿Embedding vs References en MongoDB?**

- **Embedding:** Datos juntos, acceso rápido
- **References:** Normalizado, menos duplicación

**5. ¿Por qué usar índices?**

- Búsqueda rápida, como índice de libro

**6. ¿Qué es sharding?**

- Dividir datos entre múltiples servidores

**7. ¿Para qué sirve Redis?**

- Caché en memoria para acceso ultra-rápido

---

## ⏰ Plan de Estudio (1 hora)

**Minutos 1-20:** SQL básico

- SELECT, WHERE, ORDER BY
- PK, FK
- JOINs (visualizar diagramas)
- INSERT, UPDATE, DELETE

**Minutos 21-40:** SQL avanzado + MongoDB

- ACID, Transactions
- Normalización
- MongoDB CRUD
- Operadores ($gt, $in, etc.)

**Minutos 41-60:** Conceptos avanzados

- Indexes
- Aggregation
- Sharding, Replication
- Redis, ElasticSearch

---

## 🚀 Ejercicios Mentales Rápidos

1. **Visualiza:** ¿Cómo harías JOIN entre `usuarios` y `ordenes`?
2. **Piensa:** ¿Cuándo usarías embedding vs references?
3. **Recuerda:** ACID = **A**llan **C**ome **I**n **D**aily
4. **Compara:** SQL JOINs vs MongoDB $lookup

---

## ✅ Checklist Final

Antes de la entrevista, asegúrate de poder explicar:

- [ ] Diferencia entre PK y FK
- [ ] Tipos de JOINs (INNER, LEFT, RIGHT, FULL)
- [ ] Qué es normalización (con ejemplo)
- [ ] Qué es ACID
- [ ] CRUD en MongoDB
- [ ] Embedding vs References
- [ ] Para qué sirven los índices
- [ ] Diferencia entre Sharding y Replication
- [ ] Cuándo usar Redis

---

**¡Buena suerte en tu entrevista en EPAM! 🎉**

_Recuerda: Es mejor entender los conceptos que memorizar sintaxis._
