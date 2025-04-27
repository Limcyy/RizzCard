import PropTypes from 'prop-types'
import { useState } from 'react'
import './Card.css'
import cardShine from '../assets/card-shine.png'

function Card({ title, image, isDragging, className, button, button2, link, action, onNextCard }) {
  const [touched, setTouched] = useState(false);
  
  // Prevent default drag behavior for images
  const preventDrag = (e) => {
    e.preventDefault();
    return false;
  }

  // Handle direct navigation attempt
  const handleDirectTouch = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Stop event bubbling
    
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
      
      // Method 2: Timeout fallback (if method 1 fails)
      setTimeout(() => {
        window.open(targetLink, '_system');
      }, 100);
      
      // Method 3: Last resort
      setTimeout(() => {
        const linkElement = document.createElement('a');
        linkElement.href = targetLink;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        linkElement.click();
      }, 200);
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
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation();
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
          <div 
            className='card-button yes-button'
            onClick={handleNextCard}
            onTouchStart={(e) => {
              e.preventDefault();
              handleNextCard(e);
            }}
          >
            {button}
          </div>
          <div 
            className='card-button no-button'
            onClick={handleDirectTouch}
            onTouchStart={(e) => {
              e.preventDefault();
              handleDirectTouch(e);
            }}
          >
            {button2}
          </div>
        </>
      )}
      
      {/* Handle single button case */}
      {button && button !== "null" && !button2 && (
        <div 
          className='card-button'
          onClick={handleDirectTouch}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirectTouch(e);
          }}
          style={{userSelect: 'none', touchAction: 'manipulation'}}
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
  button2: PropTypes.string,
  link: PropTypes.string,
  action: PropTypes.func,
  onNextCard: PropTypes.func
}

export default Card