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
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none'
    }
    
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
    
    const scrollMultiplier = 0.3
    const translate = prevTranslate + (diff * scrollMultiplier)
    
    const cardWidthWithGap = 100
    const maxTranslate = 0
    const minTranslate = -(cards.length - 1) * cardWidthWithGap
    
    let boundedTranslate = translate
    if (translate > maxTranslate) {
      boundedTranslate = maxTranslate + (translate - maxTranslate) * 0.05
    } else if (translate < minTranslate) {
      boundedTranslate = minTranslate + (translate - minTranslate) * 0.05
    }
    
    setCurrentTranslate(boundedTranslate)
    
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${boundedTranslate}%)`
    }
  }, [isDragging, startX, prevTranslate, cards.length])
  
  // Update initial position for the first slide
  useEffect(() => {
    // Set initial position to show the first card
    const initialTranslate = 0; // Changed from 100 to 0 to make first card visible
    setPrevTranslate(initialTranslate);
    setCurrentTranslate(initialTranslate);
    
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${initialTranslate}%)`;
    }
  }, []);

  // Update transform when current card index changes via dots
  useEffect(() => {
    const newTranslate = -currentCardIndex * 100; // Removed the +100 offset
    setPrevTranslate(newTranslate);
    setCurrentTranslate(newTranslate);
  }, [currentCardIndex]);
  
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    
    setIsDragging(false)
    document.body.classList.remove('dragging')
    
    // Exactly 100% width per card position
    const cardWidth = 100
    
    // Calculate target index based on current position - remove the 100 offset
    const normalizedPosition = -currentTranslate / cardWidth
    
    // Direction-based snapping with threshold
    const moveThreshold = 0.15
    
    let targetIndex
    if (normalizedPosition > currentCardIndex + moveThreshold) {
      // Moving left (to next card)
      targetIndex = currentCardIndex + 1
    } else if (normalizedPosition < currentCardIndex - moveThreshold) {
      // Moving right (to previous card)
      targetIndex = currentCardIndex - 1
    } else {
      // Not enough movement, snap back
      targetIndex = currentCardIndex
    }
    
    // Ensure we stay within bounds
    targetIndex = Math.min(Math.max(0, targetIndex), cards.length - 1)
    setCurrentCardIndex(targetIndex)
    
    // Calculate exact snap position without the +100 offset
    const newTranslate = -targetIndex * cardWidth
    setPrevTranslate(newTranslate)
    setCurrentTranslate(newTranslate)
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
      sliderRef.current.style.transform = `translateX(${newTranslate}%)`
    }
  }, [isDragging, currentTranslate, currentCardIndex, cards.length])
  
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
    const newTranslate = -index * 100  // Removed the +100 offset
    setPrevTranslate(newTranslate)
    setCurrentTranslate(newTranslate)
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
      sliderRef.current.style.transform = `translateX(${newTranslate}%)`
    }
  }
  
  const resetCards = () => {
    setCurrentCardIndex(0)
    const newTranslate = 100 // First card position with offset
    setPrevTranslate(newTranslate)
    setCurrentTranslate(newTranslate)
    setCompleted(false)
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
      sliderRef.current.style.transform = `translateX(${newTranslate}%)`
    }
  }
  
  return (
    <div className='main-page-wrapper'>
      <div className='card-container'>
        <div 
          ref={sliderRef}
          className='card-slider'
          style={{ transform: `translateX(${-currentCardIndex * 100}%)` }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          {cards.map((card, index) => (
            <Card 
              key={index}
              title={card.title}
              image={card.image}
              isDragging={isDragging}
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
