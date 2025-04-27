import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'
import './Card.css'
import cardShine from '../assets/card-shine.png'
import musicFile from '../assets/lofi.mp3'

function Card({ title, image, isDragging, className, button, button2, link, action, onNextCard }) {
  const [touched, setTouched] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  // Create a shared audio instance for the entire app
  useEffect(() => {
    // Check if audio already exists as a global object
    if (!window.cardAudio) {
      window.cardAudio = new Audio();
      
      // Set source with proper error handling
      try {
        // Log the actual path for debugging
        console.log("Attempting to load audio from:", musicFile);
        window.cardAudio.src = musicFile;
        
        // Add error event listener to catch loading failures
        window.cardAudio.addEventListener('error', (e) => {
          console.error("Audio loading error:", e);
          console.error("Error code:", window.cardAudio.error ? window.cardAudio.error.code : 'unknown');
          console.error("Error message:", window.cardAudio.error ? window.cardAudio.error.message : 'unknown');
        });
        
        window.cardAudio.volume = 1.0;  // Full volume
        window.cardAudio.preload = "auto"; // Preload the audio
        
        // Log audio element details for debugging
        console.log("Created audio element:", window.cardAudio);
      } catch (err) {
        console.error("Failed to create audio:", err);
      }
    }
    
    audioRef.current = window.cardAudio;
    
    // Add event listeners
    const handlePlay = () => {
      console.log("Audio started playing");
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      console.log("Audio paused");
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      console.log("Audio playback ended");
      setIsPlaying(false);
    };
    
    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);
    audioRef.current.addEventListener('ended', handleEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);
  
  // Local function to play music
  const playMusic = () => {
    console.log("Play music button clicked!");
    
    if (!audioRef.current) {
      console.error("Audio element not found");
      return;
    }
    
    try {
      if (isPlaying) {
        console.log("Attempting to pause audio...");
        audioRef.current.pause();
      } else {
        console.log("Attempting to play audio...");
        
        // Check if source is available
        if (!audioRef.current.src) {
          console.log("Audio source not set, trying to set it now");
          audioRef.current.src = musicFile;
        }
        
        // Force load the audio if not loaded
        try {
          audioRef.current.load();
        } catch (loadErr) {
          console.error("Error loading audio:", loadErr);
        }
        
        // Show a user feedback alert
        alert("Starting music playback... (Check your volume!)");
        
        // Play with user interaction
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio playback started successfully!');
            })
            .catch(error => {
              console.error('Playback failed:', error);
              alert("Couldn't play audio automatically. Please tap anywhere on the screen to enable sound.");
              
              // Create a more direct user interaction fallback
              const unlockAudio = () => {
                audioRef.current.play()
                  .then(() => console.log("Audio unlocked and playing"))
                  .catch(err => console.error("Still can't play audio:", err));
                document.body.removeEventListener('click', unlockAudio);
                document.body.removeEventListener('touchstart', unlockAudio);
              };
              
              document.body.addEventListener('click', unlockAudio);
              document.body.addEventListener('touchstart', unlockAudio);
            });
        }
      }
    } catch (err) {
      console.error('Audio playback error:', err);
      alert("There was an error playing the audio. Please check your device settings.");
    }
  };
  
  // Prevent default drag behavior for images
  const preventDrag = (e) => {
    e.preventDefault();
    return false;
  };

  // Handle direct navigation attempt
  const handleDirectTouch = (e) => {
    e.stopPropagation(); // Stop event bubbling
    
    // Check if we're dragging
    if (isDragging) return;
    
    // If action is playMusic, use our local playMusic function
    if (action && action.name === 'playMusic') {
      playMusic();
      return;
    }
    
    // If we have another action function, execute it
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
      
      {/* Show music playing indicator */}
      {isPlaying && (
        <div className="music-indicator">
          🎵 Music playing... 🎵
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
            onTouchStart={handleNextCard}
          >
            {button}
          </div>
          <div 
            className='card-button no-button'
            onClick={handleDirectTouch}
            onTouchStart={handleDirectTouch}
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
          onTouchStart={handleDirectTouch}
          style={{
            userSelect: 'none',
            backgroundColor: action && action.name === 'playMusic' 
              ? isPlaying ? '#ff6464' : '#1db954' // Spotify-like green when not playing, red when playing
              : '#000000'
          }}
        >
          {action && action.name === 'playMusic' 
            ? isPlaying ? 'Pause' : 'Play Music' 
            : button}
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