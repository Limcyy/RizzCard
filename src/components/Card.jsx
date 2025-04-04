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

  const [count, setCount] = useState(0)

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
      <p>count: {count}</p>
      <div className='deviding-line'></div>
      <img 
        src={image} 
        alt="emoji" 
        draggable="false" 
        onDragStart={preventDrag}
      />
      {button && button !== "null" && (
        <a 
          onClick={() => setCount(count + 1)}
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
          target="_blank" 
          rel="noopener noreferrer" 
          className='card-button'
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