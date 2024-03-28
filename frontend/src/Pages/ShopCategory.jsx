import React, { useContext, useEffect, useState, useRef } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';

const ShopCategory = (props) => {
  const { allProducts, fetchProducts } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [visibleProducts, setVisibleProducts] = useState(20);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const sortRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (!allProducts || allProducts.length === 0) {
      fetchData();
    } else {
      const category = props.category.toLowerCase();
      const productsInCategory = allProducts.filter(item => item.category.toLowerCase() === category);
      setFilteredProducts(productsInCategory);
    }
  }, [allProducts, fetchProducts, props.category]);

  useEffect(() => {
    if (showSortOptions) {
      const handleOutsideClick = (event) => {
        if (sortRef.current && !sortRef.current.contains(event.target)) {
          setShowSortOptions(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideClick);

      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }
  }, [showSortOptions]);

  useEffect(() => {
    // Implemente a lógica de ordenação com base na opção selecionada (sortBy)
    // Use setFilteredProducts para atualizar a lista de produtos exibidos
    if (sortBy === '20') {
      setVisibleProducts(20);
    } else if (sortBy === '40') {
      setVisibleProducts(40);
    } else if (sortBy === '80') {
      setVisibleProducts(80);
    }
  }, [sortBy]);

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  const handleSortChange = (option) => {
    setSortBy(option);
    setShowSortOptions(false); // Fechar as opções após a seleção
  };

  const handleLoadMore = () => {
    setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 10);
  };

  if (!allProducts || !Array.isArray(allProducts)) {
    return (
      <div className='shop-category'>
        <p>Error loading products</p>
      </div>
    );
  }

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className='shopcategory-indexSort'>
        <p>
          <span>{`Showing 1-${Math.min(filteredProducts.length, visibleProducts)}`}</span> out of {allProducts.length} products
        </p>
        <div className="shopcategory-sort" ref={sortRef}>
          <div className="sort-header" onClick={toggleSortOptions}>
            Sort By <img src={dropdown_icon} alt="" />
          </div>
          {showSortOptions && (
            <div className="sort-options">
              <div onClick={() => handleSortChange('20')}>20</div>
              <div onClick={() => handleSortChange('40')}>40</div>
              <div onClick={() => handleSortChange('80')}>80</div>
            </div>
          )}
        </div>
      </div>
      <div className="shopcategory-products">
        {filteredProducts.slice(0, visibleProducts).map((product) => (
          <Item key={product.id} product={product} />
        ))}
      </div>
      <div className="shopcategory-loadmore" onClick={handleLoadMore}>
        Explore More
      </div>
    </div>
  );
};

export default ShopCategory;