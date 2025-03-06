
import { useRouter } from 'next/router';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query; 
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
    setProduct(response.data);
    fetchRelatedProducts(response.data.category);
  };

  const fetchRelatedProducts = async (category) => {
    const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
    setRelatedProducts(response.data.filter((p) => p.id !== parseInt(id))); 
  };

  const addToCart = () => {
    alert(`Added ${quantity} ${product.title}(s) to cart!`);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <label>
        Quantity:
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>
      <button onClick={addToCart}>Add to Cart</button>

      <h2>Related Products</h2>
      <div className="related-products-grid">
        {relatedProducts.map((relatedProduct) => (
          <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`} passHref>
            <div className="related-product-card">
              <img src={relatedProduct.image} alt={relatedProduct.title} />
              <h3>{relatedProduct.title}</h3>
              <p>${relatedProduct.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}