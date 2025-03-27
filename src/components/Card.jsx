import PropTypes from 'prop-types'
import './Card.css'
import cardShine from '../assets/card-shine.png'

function Card({ title, image, isDragging, className, button }) {
  return (
    <div className={`card ${isDragging ? 'grabbing' : ''} ${className || ''}`}>
      <img className='card-shine' src={cardShine} alt="card shine" />
      <h2>{title}</h2>
      <div className='deviding-line'></div>
      <img src={image} alt="emoji" />
      {button && button !== "null" && <button onClick={handleButtonClick} className='card-button'>{button}</button>}
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isDragging: PropTypes.bool,
  className: PropTypes.string,
  button: PropTypes.string
}

function handleButtonClick() {
  window.open('https://www.instagram.com');
}

export default Card