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

  // Handle direct navigation attempt - SIMPLIFIED VERSION
  const handleDirectTouch = () => {
    // Don't handle if we're dragging
    if (isDragging) return;
    
    // Handle action function if available
    if (action) {
      action();
      return;
    }
    
    // Otherwise, handle navigation
    setTouched(true);
    
    // Get target link
    const targetLink = link || 'https://instagram.com/_adam_rana_';
    
    // Navigate directly - most reliable method
    window.open(targetLink, '_blank');
    
    // Reset state after delay
    setTimeout(() => setTouched(false), 2000);
  };

  // Handle advancing to next card - SIMPLIFIED VERSION
  const handleNextCard = () => {
    if (isDragging) return;
    if (onNextCard) onNextCard();
  };

  // Get display link
  const getDisplayLink = () => {
    if (!link) return '@_adam_rana_';
    try {
      const url = new URL(link);
      return url.hostname.replace('www.', '');
    } catch {
      return link;
    }
  };

  // Use useEffect to add a tap handler directly to the document
  useEffect(() => {
    // Only add these handlers if we're the active card
    if (!className || !className.includes('active')) return;
    
    // Remove any existing handlers first
    document.querySelectorAll('.mobile-tap-overlay').forEach(el => el.remove());
    
    // If we have buttons to handle
    if (button && (button !== "null" || button2)) {
      // Create overlay divs for better touch handling
      if (button2) {
        // Two button case
        const leftOverlay = document.createElement('div');
        leftOverlay.className = 'mobile-tap-overlay left-button-overlay';
        leftOverlay.style.cssText = `
          position: fixed !important;
          z-index: 999999 !important;
          bottom: 20% !important;
          left: 25% !important;
          width: 20% !important;
          height: 15% !important;
          background-color: rgba(76, 175, 80, 0.2) !important;
          border-radius: 15px !important;
        `;
        
        const rightOverlay = document.createElement('div');
        rightOverlay.className = 'mobile-tap-overlay right-button-overlay';
        rightOverlay.style.cssText = `
          position: fixed !important;
          z-index: 999999 !important;
          bottom: 20% !important;
          right: 25% !important;
          width: 20% !important;
          height: 15% !important;
          background-color: rgba(244, 67, 54, 0.2) !important;
          border-radius: 15px !important;
        `;
        
        // Add direct event handlers
        leftOverlay.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleNextCard();
        });
        
        rightOverlay.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDirectTouch();
        });
        
        document.body.appendChild(leftOverlay);
        document.body.appendChild(rightOverlay);
      } else if (button !== "null") {
        // Single button case
        const buttonOverlay = document.createElement('div');
        buttonOverlay.className = 'mobile-tap-overlay single-button-overlay';
        buttonOverlay.style.cssText = `
          position: fixed !important;
          z-index: 999999 !important;
          bottom: 20% !important;
          left: 40% !important;
          width: 20% !important;
          height: 15% !important;
          background-color: rgba(0, 0, 0, 0.2) !important;
          border-radius: 15px !important;
        `;
        
        buttonOverlay.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDirectTouch();
        });
        
        document.body.appendChild(buttonOverlay);
      }
    }
    
    return () => {
      // Clean up our overlays when component unmounts or changes
      document.querySelectorAll('.mobile-tap-overlay').forEach(el => el.remove());
    };
  }, [className, button, button2]);

  return (
    <div className={`card ${isDragging ? 'grabbing' : ''} ${className || ''}`}>
      {touched && (
        <div className="touch-indicator">
          Opening {getDisplayLink()}...
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
      
      {/* Two-button case */}
      {button && button2 && (
        <div className="two-button-container" style={{display: 'flex', width: '100%', justifyContent: 'space-around', padding: '0 15px', marginTop: '20px', zIndex: '9999 !important'}}>
          <a 
            href="#" 
            className='card-button yes-button'
            onClick={(e) => {
              e.preventDefault();
              handleNextCard();
            }}
            style={{
              display: 'block !important',
              width: '45% !important',
              padding: '12px !important',
              backgroundColor: '#4CAF50 !important',
              color: 'white !important',
              borderRadius: '15px !important',
              textAlign: 'center !important',
              fontWeight: 'bold !important',
              fontSize: '16px !important',
              textDecoration: 'none !important',
              position: 'relative !important',
              zIndex: '99999 !important',
              userSelect: 'none !important',
              WebkitUserSelect: 'none !important',
              touchAction: 'manipulation !important',
              cursor: 'pointer !important'
            }}
          >
            {button}
          </a>
          <a 
            href={link || "https://instagram.com/_adam_rana_"}
            className='card-button no-button'
            onClick={(e) => {
              e.preventDefault();
              handleDirectTouch();
            }}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block !important',
              width: '45% !important',
              padding: '12px !important',
              backgroundColor: '#F44336 !important',
              color: 'white !important',
              borderRadius: '15px !important',
              textAlign: 'center !important',
              fontWeight: 'bold !important',
              fontSize: '16px !important',
              textDecoration: 'none !important',
              position: 'relative !important',
              zIndex: '99999 !important',
              userSelect: 'none !important',
              WebkitUserSelect: 'none !important',
              touchAction: 'manipulation !important',
              cursor: 'pointer !important'
            }}
          >
            {button2}
          </a>
        </div>
      )}
      
      {/* Single button case */}
      {button && button !== "null" && !button2 && (
        <a 
          href={link || "https://instagram.com/_adam_rana_"}
          className='card-button'
          onClick={(e) => {
            e.preventDefault();
            handleDirectTouch();
          }}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block !important',
            width: '50% !important',
            padding: '12px !important',
            backgroundColor: '#000000 !important',
            color: 'white !important',
            borderRadius: '15px !important',
            textAlign: 'center !important',
            fontWeight: 'bold !important',
            fontSize: '16px !important',
            marginTop: '20px !important',
            textDecoration: 'none !important',
            position: 'relative !important',
            zIndex: '99999 !important',
            userSelect: 'none !important',
            WebkitUserSelect: 'none !important',
            touchAction: 'manipulation !important',
            cursor: 'pointer !important'
          }}
        >
          {button}
        </a>
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