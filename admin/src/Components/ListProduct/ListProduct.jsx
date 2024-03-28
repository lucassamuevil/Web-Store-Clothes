import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to remove this product?');

      if (isConfirmed) {
        await fetch('http://localhost:4000/removeproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        });
        await fetchInfo();
      }
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <div key={index} className="listproduct-format-main listproduct-format">
            <div className="listproduct-product-icons">
              {product.images.map((image, imageIndex) => (
                <img key={imageIndex} src={image} alt={`Product ${imageIndex + 1}`} />
              ))}
            </div>
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img
              onClick={() => {
                removeProduct(product.id);
              }}
              className="listproduct-remove-icon"
              src={cross_icon}
              alt=""
            />
          </div>
        ))}
        <hr />
      </div>
    </div>
  );
};

export default ListProduct;
