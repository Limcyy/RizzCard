import { useEffect, useState, useRef, useCallback } from 'react'
import './App.css'
import shyEmoji from './assets/shy-emoji.png'

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
      velocity.current = (currentX - lastX.current) / elapsed + 100
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
      boundedTranslate = maxTranslate + (translate - maxTranslate) * 0.01 
    } else if (translate < minTranslate) {
      boundedTranslate = minTranslate + (translate - minTranslate) * 0.01 
    }
    
    setCurrentTranslate(boundedTranslate)
    
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${boundedTranslate}%)`
    }
  }, [isDragging, startX, prevTranslate, cards.length])
  
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    
    setIsDragging(false)
    document.body.classList.remove('dragging')
    
    const cardWidth = 100;
    const currentPosition = -currentTranslate / cardWidth;
    let targetIndex = currentCardIndex;
    const moveThreshold = 0.15;
    const positionDiff = currentPosition - currentCardIndex;
    
    if (positionDiff > moveThreshold) {
      targetIndex = Math.min(cards.length - 1, currentCardIndex + 1);
    } else if (positionDiff < -moveThreshold) {
      targetIndex = Math.max(0, currentCardIndex - 1);
    }
    
    targetIndex = Math.min(Math.max(0, targetIndex), cards.length - 1);
    setCurrentCardIndex(targetIndex);
    
    const newTranslate = -targetIndex * cardWidth;
    setPrevTranslate(newTranslate);
    setCurrentTranslate(newTranslate);
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
      sliderRef.current.style.transform = `translateX(${newTranslate}%)`;
    }
  }, [isDragging, currentTranslate, currentCardIndex, cards.length]);
  
  // Add global event listeners for dragging outside the card
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) handleDragMove(e)
    }
    
    const handleGlobalMouseUp = () => {
      if (isDragging) handleDragEnd()
    }
    
    const handleGlobalTouchMove = (e) => {
      if (isDragging) handleDragMove(e)
    }
    
    const handleGlobalTouchEnd = () => {
      if (isDragging) handleDragEnd()
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
    const newTranslate = -index * 100
    setPrevTranslate(newTranslate)
    setCurrentTranslate(newTranslate)
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
      sliderRef.current.style.transform = `translateX(${newTranslate}%)`
    }
  }
  
  // Update transform when current card index changes via dots
  useEffect(() => {
    setPrevTranslate(-currentCardIndex * 100)
    setCurrentTranslate(-currentCardIndex * 100)
  }, [currentCardIndex])
  
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
        
        {completed && (
          <div className="completion-actions">
            <button className="restart-button" onClick={resetCards}>
              Restart
            </button>
            <button className="share-button" onClick={() => alert('Share functionality coming soon!')}>
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
