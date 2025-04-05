import PropTypes from 'prop-types'
import { useState } from 'react'
import './Card.css'
import cardShine from '../assets/card-shine.png'

function Card({ title, image, isDragging, className, button, link }) {
  const [debugMessage, setDebugMessage] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Prevent default drag behavior for images
  const preventDrag = (e) => {
    e.preventDefault()
    return false
  }

  // Function to handle debugging touch events
  const handleTouch = () => {
    setShowDebug(true);
    setDebugMessage(`Touch detected at: ${new Date().toISOString()}`);
    
    // Show instructions
    setShowInstructions(true);
    
    // Hide debug after 3 seconds
    setTimeout(() => {
      setShowDebug(false);
      setShowInstructions(false);
    }, 5000);
  }

  return (
    <div className={`card ${isDragging ? 'grabbing' : ''} ${className || ''}`}>
      {/* Debug overlay */}
      {showDebug && (
        <div className="debug-overlay">
          <p>{debugMessage}</p>
        </div>
      )}
      
      {/* Instructions overlay */}
      {showInstructions && (
        <div className="instructions-overlay">
          <p>👇 Click and hold to copy my Instagram</p>
          <p>@_adam_rana_</p>
          <p>Or find me by username: _adam_rana_</p>
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
        <a 
          href="https://www.instagram.com/_adam_rana_"
          target="_blank"
          rel="noopener noreferrer"
          className='card-button'
          onClick={handleTouch}
          onTouchStart={handleTouch}
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
  link: PropTypes.string
}

export default Card