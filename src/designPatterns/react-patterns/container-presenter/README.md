# Container/Presenter Pattern (Patrón Contenedor/Presentador)

## Explicación Sencilla

El patrón Container/Presenter separa la lógica de negocio (container) de la presentación visual (presenter). Los contenedores manejan el "cómo funciona" mientras que los presentadores se enfocan en el "cómo se ve".

**Analogía:** Es como un ventrílocuo y su muñeco. El ventrílocuo (container) hace todo el trabajo pesado (voz, historia, timing), mientras que el muñeco (presenter) solo se ve bonito y muestra expresiones.

También conocido como: **Smart/Dumb Components** o **Stateful/Stateless Components**.

## Uso en React

En React, este patrón es útil para:

- **Separación de responsabilidades** - Lógica vs UI
- **Reutilización de UI** - Presenters pueden usarse con diferentes containers
- **Testing más fácil** - Testear lógica y UI por separado
- **Componentes puros** - Presenters son funciones puras
- **Mejor organización** - Código más mantenible

## Ejercicio Implementado

### Lista de Productos con Container/Presenter

Se implementó una lista de productos donde el container maneja la lógica y el presenter solo renderiza.

**Componentes principales:**

1. **ProductListContainer** - Componente Container (Smart)

   - **Responsabilidades:**
     - Maneja el estado (productos)
     - Obtiene datos (fetch, API calls)
     - Maneja la lógica de negocio
     - Maneja eventos (agregar, eliminar, filtrar)
   - **Características:**
     - Tiene hooks (`useState`, `useEffect`)
     - Conoce la fuente de datos
     - Pasa datos y callbacks al presenter
   - No tiene estilos ni JSX complejo

2. **ProductList** - Componente Presenter (Dumb)
   - **Responsabilidades:**
     - Recibe datos vía props
     - Renderiza la UI
     - Delega eventos al container (callbacks)
   - **Características:**
     - Componente puro (solo props → UI)
     - No tiene estado propio
     - No conoce de dónde vienen los datos
     - Solo estilos y presentación
   - Fácil de testear y reutilizar

**Estructura:**

```tsx
// Container (lógica)
function ProductListContainer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obtener productos de la API
    fetchProducts();
  }, []);

  const handleAddProduct = (product) => {
    setProducts([...products, product]);
  };

  const handleRemoveProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <ProductList
      products={products}
      loading={loading}
      onAddProduct={handleAddProduct}
      onRemoveProduct={handleRemoveProduct}
    />
  );
}

// Presenter (UI)
function ProductList({ products, loading, onAddProduct, onRemoveProduct }) {
  if (loading) return <Spinner />;

  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onRemove={() => onRemoveProduct(product.id)}
        />
      ))}
      <AddProductButton onClick={onAddProduct} />
    </div>
  );
}
```

**Flujo:**

1. Container monta y obtiene datos
2. Container pasa datos al Presenter
3. Presenter renderiza la UI
4. Usuario interactúa con la UI
5. Presenter llama a callbacks del Container
6. Container actualiza el estado
7. Presenter se re-renderiza con nuevos datos

**Ventajas:**

- **Separación clara de responsabilidades**
  - Container: lógica de negocio
  - Presenter: presentación visual
- **Reutilización:**
  - Mismo presenter con diferentes containers
  - Mismo container con diferentes presenters
- **Testing:**
  - Testear lógica sin renderizar UI
  - Testear UI con props mock
- **Mantenibilidad:**
  - Cambios en lógica no afectan UI
  - Cambios en UI no afectan lógica
- **Performance:**
  - Presenters puros son fáciles de optimizar con React.memo

**Cuándo usar:**
✅ Componentes con lógica compleja
✅ Necesidad de reutilizar UI
✅ Testing riguroso
✅ Múltiples fuentes de datos para la misma UI

**Cuándo NO usar:**
❌ Componentes muy simples
❌ Overhead innecesario
❌ Componentes únicos que no se reutilizarán
