import PropTypes from 'prop-types'
import './ProgressDots.css'

function ProgressDots({ totalDots, activeDot, onDotClick }) {
  return (
    <div className='progress-dots'>
      {Array.from({ length: totalDots }).map((_, index) => (
        <div 
          key={index} 
          className={`dot ${index === activeDot ? 'active' : ''}`}
          onClick={() => onDotClick(index)}
        ></div>
      ))}
    </div>
  )
}

ProgressDots.propTypes = {
  totalDots: PropTypes.number.isRequired,
  activeDot: PropTypes.number.isRequired,
  onDotClick: PropTypes.func.isRequired
}

export default ProgressDots