import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    category: 'women',
    new_price: '',
    old_price: '',
  });

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);

    selectedImages.forEach((image) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader.result);
      };
      reader.readAsDataURL(image);
    });
  };

  const showAlertAndReload = () => {
    const isConfirmed = window.confirm('Upload bem-sucedido!');

    if (isConfirmed) {
      window.location.reload();
    }
  };

  const addProduct = async () => {
    try {
      if (
        !productDetails.name ||
        !productDetails.category ||
        !productDetails.new_price ||
        !productDetails.old_price ||
        images.length === 0
      ) {
        console.error('Por favor, preencha todos os campos e forneça pelo menos uma imagem.');
        return;
      }

      let formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      formData.append('name', productDetails.name);
      formData.append('category', productDetails.category);
      formData.append('new_price', productDetails.new_price);
      formData.append('old_price', productDetails.old_price);

      const response = await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Upload bem-sucedido!');
        showAlertAndReload();
      } else {
        console.error('Erro durante o upload:', response.status, response.statusText);
        const responseBody = await response.text();
        console.error('Resposta do servidor:', responseBody);
      }
    } catch (error) {
      console.error('Erro durante o upload:', error.message);
    }
  };

  return (
    <div>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder="Type here" />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p> Old Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder="Type here" />
        </div>
        <div className="addproduct-itemfield">
          <p> New Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder="Type here" />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input" className="image-upload-container">
          {images.length > 0 ? (
            images.map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} alt={`product-thumbnail-${index}`} className="uploaded-image" />
            ))
          ) : (
            <img src={upload_area} alt="addproduct-thumbnail-img" className="upload-area" />
          )}
        </label>
        <input onChange={imageHandler} type="file" name="images" id="file-input" multiple hidden />
      </div>
      <button onClick={addProduct} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
