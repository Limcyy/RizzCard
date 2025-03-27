import PropTypes from 'prop-types'
import './Card.css'

function Card({ title, image, isDragging, className }) {
  return (
    <div className={`card ${isDragging ? 'grabbing' : ''} ${className || ''}`}>
      <h2>{title}</h2>
      <div className='deviding-line'></div>
      <img src={image} alt="emoji" />
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isDragging: PropTypes.bool,
  className: PropTypes.string
}

export default Card