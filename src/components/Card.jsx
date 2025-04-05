import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import './Card.css'
import cardShine from '../assets/card-shine.png'

function Card({ title, image, isDragging, className, button, link }) {
  const [showInfo, setShowInfo] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  
  // Prevent default drag behavior for images
  const preventDrag = (e) => {
    e.preventDefault()
    return false
  }

  // Handle copying username to clipboard
  const copyToClipboard = () => {
    const username = '_adam_rana_';
    
    try {
      navigator.clipboard.writeText(username).then(() => {
        setCopyStatus('Username copied! Now open Instagram and search for it.');
        setTimeout(() => setCopyStatus(''), 3000);
      }).catch(err => {
        setCopyStatus('Failed to copy. Please manually type: _adam_rana_');
        console.error('Copy failed: ', err);
      });
    } catch (err) {
      setCopyStatus('Failed to copy. Please manually type: _adam_rana_');
      console.error('Copy failed: ', err);
    }
  };
  
  return (
    <div className={`card ${isDragging ? 'grabbing' : ''} ${className || ''}`}>
      {showInfo && (
        <div className="instagram-overlay">
          <div className="overlay-content">
            <p className="insta-header">Find me on Instagram</p>
            <p className="insta-handle">@_adam_rana_</p>
            
            {copyStatus && <p className="copy-status">{copyStatus}</p>}
            
            <div className="insta-buttons">
              <button onClick={copyToClipboard} className="copy-button">
                Copy Username
              </button>
              <button onClick={() => setShowInfo(false)} className="close-button">
                Close
              </button>
            </div>
          </div>
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
        <button 
          className='card-button'
          onClick={() => setShowInfo(true)}
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