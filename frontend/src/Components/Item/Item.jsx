import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
  const { id, name, images, new_price, old_price } = props.product || {};
  const imageUrl = images?.[0] || "caminho-da-imagem-padrao.jpg";

  return (
    <div className='item'>
      {id && (
        <Link to={`/product/${id}`}>
          <img onClick={() => window.scrollTo(0, 0)} src={imageUrl} alt={name} />
        </Link>
      )}
      <p>{name}</p>
      <div className="item-prices">
        <div className="item-price-new">
          ${new_price}
        </div>
        {old_price && (
          <div className="item-price-old">
            ${old_price}
          </div>
        )}
      </div>
    </div>
  );
}

export default Item;
