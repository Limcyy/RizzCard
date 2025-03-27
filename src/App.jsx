import { useEffect, useState, useRef, useCallback } from 'react'
import './App.css'
import Card from './components/Card'
import ProgressDots from './components/ProgressDots'
import { defaultCards } from './data/cardData'
import cardBg from './assets/card-bg.png'

function App() {
  const [cards, setCards] = useState(defaultCards)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [completed, setCompleted] = useState(false)
  const sliderRef = useRef(null)
  
  // For velocity tracking
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const velocity = useRef(0)
  
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // Add dynamic styling with the correct path
    document.documentElement.style.setProperty('--card-bg-image', `url(${cardBg})`);
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Check if user has reached the last card
  useEffect(() => {
    if (currentCardIndex === cards.length - 1) {
      const timer = setTimeout(() => {
        setCompleted(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    } else {
      setCompleted(false)
    }
  }, [currentCardIndex, cards.length])
  
  // Define handlers using useCallback to maintain reference stability
  const handleDragStart = useCallback((e) => {
    // Prevent default behavior that might cause movement
    e.preventDefault()
    
    setIsDragging(true)
    document.body.classList.add('dragging')
    
    // Get the clientX value correctly from either mouse or touch event
    const clientX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX
    setStartX(clientX)
    lastX.current = clientX
    lastTime.current = Date.now()
    velocity.current = 0
    
    // Find the active card but DON'T apply any transform yet
    if (sliderRef.current) {
      const activeCard = sliderRef.current.querySelector('.card.active');
      if (activeCard) {
        // Just add the swiping class to disable transitions
        // DO NOT set any transform here - this avoids the initial jump
        activeCard.classList.add('swiping');
      }
    }
  }, [])
  
  const handleDragMove = useCallback((e) => {
    if (!isDragging) return
    
    // Get current position
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX
    const diff = currentX - startX
    
    // Skip tiny movements to prevent unwanted shifts
    if (Math.abs(diff) < 2) return
    
    // Simple velocity calculation
    const now = Date.now()
    const elapsed = now - lastTime.current
    if (elapsed > 0) {
      velocity.current = (currentX - lastX.current) / elapsed
    }
    lastX.current = currentX
    lastTime.current = now
    
    if (sliderRef.current) {
      // Apply transform to active card
      const activeCard = sliderRef.current.querySelector('.card.active');
      if (activeCard) {
        // Calculate rotation and translation exactly based on drag distance
        const rotation = diff * 0.05; // Simple rotation factor
        const translateX = diff * 0.5; // Add some horizontal movement
        const opacity = Math.max(1 - Math.abs(diff) / 200, 0.3); // Fade out as swiped
        
        // Apply transform based only on drag distance
        activeCard.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`;
        activeCard.style.opacity = opacity;
      }
    }
  }, [isDragging, startX])
  
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    
    setIsDragging(false)
    document.body.classList.remove('dragging')
    
    const diff = lastX.current - startX
    
    // Simple threshold for card change
    const moveThreshold = 50
    
    let targetIndex = currentCardIndex
    if (diff < -moveThreshold) {
      // Moving left (to next card)
      targetIndex = Math.min(currentCardIndex + 1, cards.length - 1)
    } else if (diff > moveThreshold) {
      // Moving right (to previous card)
      targetIndex = Math.max(currentCardIndex - 1, 0)
    }
    
    // Reset the active card's transform
    if (sliderRef.current) {
      const activeCard = sliderRef.current.querySelector('.card.active');
      if (activeCard) {
        // Remove the inline styles first
        activeCard.style.transform = '';
        activeCard.style.opacity = '';
        
        // Remove the swiping class to allow transitions again
        activeCard.classList.remove('swiping');
      }
    }
    
    // Move to target card
    setCurrentCardIndex(targetIndex);
    
  }, [isDragging, startX, currentCardIndex, cards.length])
  
  // Add global event listeners for dragging outside the card
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleDragMove(e)
      }
    }
    
    const handleGlobalMouseUp = (e) => {
      if (isDragging) {
        handleDragEnd()
      }
    }
    
    const handleGlobalTouchMove = (e) => {
      if (isDragging) {
        handleDragMove(e)
      }
    }
    
    const handleGlobalTouchEnd = (e) => {
      if (isDragging) {
        handleDragEnd()
      }
    }
    
    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    window.addEventListener('touchend', handleGlobalTouchEnd)
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchmove', handleGlobalTouchMove)
      window.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])
  
  const handleDotClick = (index) => {
    setCurrentCardIndex(index)
  }
  
  return (
    <div className='main-page-wrapper'>
      <div className='card-container'>
        <div 
          ref={sliderRef}
          className='card-slider'
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          {cards.map((card, index) => (
            <Card 
              key={index}
              title={card.title}
              button={card.button}
              image={card.image}
              isDragging={isDragging && currentCardIndex === index}
              className={`card ${currentCardIndex === index ? 'active' : ''} 
                         ${index === currentCardIndex - 1 ? 'prev' : ''}
                         ${index === currentCardIndex + 1 ? 'next' : ''}`}
            />
          ))}
        </div>
      </div>
      
      <div className='controls-container'>
        <ProgressDots 
          totalDots={cards.length}
          activeDot={currentCardIndex}
          onDotClick={handleDotClick}
        />
      </div>
    </div>
  )
}

export default App
