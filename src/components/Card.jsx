import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import './Card.css'
import cardShine from '../assets/card-shine.png'

function Card({ title, image, isDragging, className, button, button2, link, action, onNextCard }) {
  const [touched, setTouched] = useState(false);
  
  // Prevent default drag behavior for images
  const preventDrag = (e) => {
    e.preventDefault();
    return false;
  }

  // Debugging function - uncomment if needed
  // const logEvent = (name, e) => {
  //   console.log(`${name} event triggered on ${e.target.className}`);
  // }

  // Handle direct navigation attempt
  const handleDirectTouch = (e) => {
    if (e) {
      e.preventDefault(); // Prevent default touch behavior
      e.stopPropagation(); // Stop event bubbling
    }
    
    // Check if we're dragging
    if (isDragging) return;
    
    // If we have an action function, execute it
    if (action) {
      action();
      return;
    }
    
    // Otherwise, handle link navigation
    setTouched(true);
    
    // Get the dynamic link from props, or use fallback
    const targetLink = link || 'https://instagram.com/_adam_rana_';
    
    // Try multiple approaches in sequence
    try {
      // Method 1: Direct location change
      window.location.href = targetLink;
    } catch (err) {
      console.error('Navigation failed:', err);
    }
    
    // Reset touched state after 2 seconds
    setTimeout(() => {
      setTouched(false);
    }, 2000);
  };

  // Handle advancing to next card
  const handleNextCard = (e) => {
    if (e) {
      e.preventDefault(); // Prevent default touch behavior
      e.stopPropagation();
    }
    
    if (isDragging) return;
    if (onNextCard) onNextCard();
  };

  // Extract just the domain for display purposes
  const getDisplayLink = () => {
    if (!link) return '@_adam_rana_';
    try {
      const url = new URL(link);
      return url.hostname.replace('www.', '');
    } catch {
      return link;
    }
  };

  return (
    <div className={`card ${isDragging ? 'grabbing' : ''} ${className || ''}`}>
      {touched && (
        <div className="touch-indicator">
          Opening {getDisplayLink()}...
          <br/>
          If nothing happens, try searching for the username
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
      
      {/* Handle two-button case */}
      {button && button2 && (
        <>
          <button 
            className='card-button yes-button'
            onClick={handleNextCard}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNextCard();
            }}
            type="button"
            style={{
              userSelect: 'none',
              touchAction: 'manipulation',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              cursor: 'pointer'
            }}
          >
            {button}
          </button>
          <button 
            className='card-button no-button'
            onClick={handleDirectTouch}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDirectTouch();
            }}
            type="button"
            style={{
              userSelect: 'none',
              touchAction: 'manipulation',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              cursor: 'pointer'
            }}
          >
            {button2}
          </button>
        </>
      )}
      
      {/* Handle single button case */}
      {button && button !== "null" && !button2 && (
        <button 
          className='card-button'
          onClick={handleDirectTouch}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDirectTouch();
          }}
          type="button"
          style={{
            userSelect: 'none',
            touchAction: 'manipulation',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            cursor: 'pointer'
          }}
        >
          {button}
        </button>
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
  button2: PropTypes.string,
  link: PropTypes.string,
  action: PropTypes.func,
  onNextCard: PropTypes.func
}

export default Card