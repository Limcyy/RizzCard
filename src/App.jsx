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
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [prevTranslate, setPrevTranslate] = useState(0)
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
    setIsDragging(true)
    document.body.classList.add('dragging')
    
    const clientX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX
    setStartX(clientX)
    lastX.current = clientX
    lastTime.current = Date.now()
    velocity.current = 0
    
    // Prevent default to avoid text selection during drag
    e.preventDefault()
  }, [])
  
  const handleDragMove = useCallback((e) => {
    if (!isDragging) return
    
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX
    const diff = currentX - startX
    
    // Calculate velocity
    const now = Date.now()
    const elapsed = now - lastTime.current
    if (elapsed > 0) {
      velocity.current = (currentX - lastX.current) / elapsed
    }
    lastX.current = currentX
    lastTime.current = now
    
    // If drag distance is significant, we'll handle it in drag end
    if (Math.abs(diff) > 50) {
      // Just track for drag end
    }
  }, [isDragging, startX])
  
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    
    setIsDragging(false)
    document.body.classList.remove('dragging')
    
    const diff = lastX.current - startX
    
    // Direction-based navigation
    const moveThreshold = 50
    
    let targetIndex = currentCardIndex
    if (diff < -moveThreshold) {
      // Moving left (to next card)
      targetIndex = Math.min(currentCardIndex + 1, cards.length - 1)
    } else if (diff > moveThreshold) {
      // Moving right (to previous card)
      targetIndex = Math.max(currentCardIndex - 1, 0)
    }
    
    // Move to target card
    setCurrentCardIndex(targetIndex)
    
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
              image={card.image}
              isDragging={isDragging && currentCardIndex === index}
              className={`card ${currentCardIndex === index ? 'active' : ''}`}
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
