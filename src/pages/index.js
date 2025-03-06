// pages/index.js
import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(1000);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('https://fakestoreapi.com/products');
    setProducts(response.data);
    setFilteredProducts(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get('https://fakestoreapi.com/products/categories');
    setCategories(['all', ...response.data]);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterProducts(category, priceRange);
  };

  const handlePriceChange = (event) => {
    const price = event.target.value;
    setPriceRange(price);
    filterProducts(selectedCategory, price);
  };

  const filterProducts = (category, price) => {
    let filtered = products;
    if (category !== 'all') {
      filtered = filtered.filter((product) => product.category === category);
    }
    filtered = filtered.filter((product) => product.price <= price);
    setFilteredProducts(filtered);
  };

  return (
    <div className="container">
      <h1>Welcome to E-Commerce</h1>
      <div className="filters">
        <label>
          Category:
          <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price Range: ${priceRange}
          <input
            type="range"
            min="1"
            max="1000"
            value={priceRange}
            onChange={handlePriceChange}
          />
        </label>
      </div>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} passHref>
            <div className="product-card">
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}