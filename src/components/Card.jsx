import PropTypes from 'prop-types'
import { useState } from 'react'
import './Card.css'
import cardShine from '../assets/card-shine.png'

function Card({ title, image, isDragging, className, button, link }) {
  const [touched, setTouched] = useState(false);
  
  // Prevent default drag behavior for images
  const preventDrag = (e) => {
    e.preventDefault();
    return false;
  }

  // Handle direct navigation attempt
  const handleDirectTouch = (e) => {
    e.stopPropagation(); // Stop event bubbling
    
    // Set touched state to show visual feedback
    setTouched(true);
    
    // Try multiple approaches in sequence
    try {
      // Method 1: Direct location change
      window.location.href = 'https://instagram.com/_adam_rana_';
      
      // Method 2: Timeout fallback (if method 1 fails)
      setTimeout(() => {
        window.open('https://instagram.com/_adam_rana_', '_system');
      }, 100);
      
      // Method 3: Last resort
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'https://instagram.com/_adam_rana_';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      }, 200);
    } catch (err) {
      console.error('Navigation failed:', err);
    }
    
    // Reset touched state after 2 seconds
    setTimeout(() => {
      setTouched(false);
    }, 2000);
  };

  return (
    <div className={`card ${isDragging ? 'grabbing' : ''} ${className || ''}`}>
      {touched && (
        <div className="touch-indicator">
          Opening Instagram...
          <br/>
          If nothing happens, search for @_adam_rana_
        </div>
      )}
      
      <img 
        className='card-shine' 
        src={cardShine} 
        alt="card shine" 
        draggable="false" 
        onDragStart={preventDrag}
      />
      <h2>{title}</h2>
      <div className='deviding-line'></div>
      <img 
        src={image} 
        alt="emoji" 
        draggable="false" 
        onDragStart={preventDrag}
      />
      {button && button !== "null" && (
        <div 
          className='card-button'
          onClick={handleDirectTouch}
          onTouchStart={handleDirectTouch}
          style={{userSelect: 'none'}}
        >
          {button}
        </div>
      )}
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isDragging: PropTypes.bool,
  className: PropTypes.string,
  button: PropTypes.string,
  link: PropTypes.string
}

export default Card