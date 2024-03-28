import React from 'react'
import './Hero.css'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
          <h2>FRESH ARRIVALS ONLY</h2>
          <br /><br />
        <div>
           <div className="hand-hand-icon">
          
           </div>
              <p>Diverse Collections</p>
              <p>For Everyone</p>
        </div>

          <div className="hero-latest-btn">
               <div>
              <button>Latest Collection
              <img src={arrow_icon} alt="" />
              </button>
              </div>
          </div>
      </div>

      <div className="hero-right"></div>
      <img src={hero_image} alt="" />

    </div>
  )
}

export default Hero;
