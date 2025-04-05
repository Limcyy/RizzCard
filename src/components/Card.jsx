import PropTypes from 'prop-types'
import { useState } from 'react'
import './Card.css'
import cardShine from '../assets/card-shine.png'

function Card({ title, image, isDragging, className, button, link }) {
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Prevent default drag behavior for images
  const preventDrag = (e) => {
    e.preventDefault()
    return false
  }

  // Simply toggle instructions display
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  }

  return (
    <div className={`card ${isDragging ? 'grabbing' : ''} ${className || ''}`}>
      {/* Instructions overlay */}
      {showInstructions && (
        <div className="instructions-overlay">
          <p>Find me on Instagram:</p>
          <p style={{fontWeight: 'bold', fontSize: '16px', marginTop: '5px'}}>@_adam_rana_</p>
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
        <>
          {/* First button shows Instagram username */}
          <button className='card-button' onClick={toggleInstructions}>
            Show Instagram
          </button>
          
          {/* Hidden link that works for direct navigation */}
          <a 
            href="https://instagram.com/_adam_rana_" 
            className='instagram-link'
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Instagram
          </a>
        </>
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