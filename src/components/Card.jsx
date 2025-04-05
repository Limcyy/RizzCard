import PropTypes from 'prop-types'
import { useState } from 'react'
import './Card.css'
import cardShine from '../assets/card-shine.png'

function Card({ title, image, isDragging, className, button, link }) {
  // Prevent default drag behavior for images
  const preventDrag = (e) => {
    e.preventDefault()
    return false
  }

  const handleButtonClick = () => {
    console.log(link)
    window.open(link, '_blank')
  }


  return (
    <div className={`card ${isDragging ? 'grabbing' : ''} ${className || ''}`}>
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
        <button 
          onClick={handleButtonClick}
          onTouchStart={() => window.open('https://www.instagram.com/_adam_rana_?igsh=Y2lndjEycnQ1bGVv&utm_source=qr')}
          className='card-button'
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
  link: PropTypes.string
}

export default Card