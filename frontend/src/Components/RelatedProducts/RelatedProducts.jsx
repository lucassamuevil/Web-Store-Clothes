import React, { useContext } from 'react';
import './RelatedProducts.css';
import { ShopContext } from '../../Context/ShopContext';
import Item from '../Item/Item';

const RelatedProducts = () => {
  const { allProducts } = useContext(ShopContext);

  if (!allProducts || !Array.isArray(allProducts)) {
    return <p>Error loading products</p>;
  }

  // Lógica para obter produtos relacionados (por exemplo, produtos da mesma categoria)
  // Substitua essa lógica com base nas suas necessidades
  const relatedProducts = allProducts.slice(0, 4);

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts.map((item) => (
          <Item
            key={item.id}
            product={item}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
