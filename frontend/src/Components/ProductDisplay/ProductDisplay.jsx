import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log('ProductDisplay - useEffect - product:', product);
    if (Array.isArray(product.images) && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  if (!product || typeof product !== 'object') {
    console.error('ProductDisplay - Product is undefined or not an object.');
    return null;
  }

  const { images, name, old_price, new_price, category, id } = product;

  const handleSizeClick = (size) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const handleThumbnailMouseEnter = (image) => {
    setSelectedImage(image);
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    console.log('ID:', id);
    console.log('Selected Size:', selectedSize);
    if (selectedSize) {
      addToCart(id, selectedSize);  
    } else {
      console.error('Selecione um tamanho antes de adicionar ao carrinho.');
    }
  };
  
  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {Array.isArray(images) && images.length > 0 ? (
            images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product${index}`}
                onClick={() => handleThumbnailClick(image)}
                onMouseEnter={() => handleThumbnailMouseEnter(image)}
                className={`thumbnail ${selectedImage === image ? 'selected' : ''}`}
              />
            ))
          ) : (
            <img src="default-image-url" alt="Default" />
          )}
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={selectedImage || "default-image-url"} 
            alt="main-product"
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${old_price}</div>
          <div className="productdisplay-right-price-new">${new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn
          as an undershirt or outer garment.
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {sizes.map((size) => (
              <div
                key={size}
                onClick={() => handleSizeClick(size)}
                className={`size-button ${selectedSize === size ? 'selected' : ''}`}
              >
                {size}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleAddToCart}>ADD TO CART</button>

        <p className="productdisplay-right-category">
          <span>Category :</span> {category}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
