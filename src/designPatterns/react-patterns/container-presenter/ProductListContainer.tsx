import { useState, useEffect } from 'react'
import { ProductList } from './ProductList'


export const ProductListContainer = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from an API or other data source
    const fetchProducts = async () => {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleSelect = (productId: number) => {
    // Handle product selection logic here
    console.log('Selected product ID:', productId);
  };

  return <ProductList products={products} onSelect={handleSelect} />;
};