interface Product {
  id: number;
  title: string;
}

export const ProductList = ({
  products,
  onSelect,
}: {
  products: Product[],
  onSelect: (productId: number) => void,
}) => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <button type='button' onClick={() => onSelect(product.id)}>
            {product.title}
          </button>
        </li>
      ))}
    </ul>
  );
};
