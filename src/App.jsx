import { useEffect, useState, useRef, useCallback } from 'react'
import './App.css'
import shyEmoji from './assets/shy-emoji.png'
import cardBg from './assets/card-bg.png'

function App() {
  // Define cards directly rather than using undefined defaultCards
  const defaultCards = [
    {
      title: "Hey, I was basically too scared to talk to you, so I just gave you this card..",
      image: shyEmoji
    },
    {
      title: "I think you're really cool and I'd like to get to know you better...",
      image: shyEmoji
    },
    {
      title: "Maybe we could hang out sometime?",
      image: shyEmoji
    },
    {
      title: "I'd really like that!",
      image: shyEmoji
    },
    {
      title: "What do you say?",
      image: shyEmoji
    }
  ];
  
  const [cards, setCards] = useState(defaultCards)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [prevTranslate, setPrevTranslate] = useState(0)
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

  // Update initial position for the first slide
  useEffect(() => {
    // Set initial position to show the first card
    const initialTranslate = 0;
    setPrevTranslate(initialTranslate);
    setCurrentTranslate(initialTranslate);
    
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${initialTranslate}%)`;
    }
  }, []);
  
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
  
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    
    setIsDragging(false)
    document.body.classList.remove('dragging')
    
    // Exactly 100% width per card position
    const cardWidth = 100
    
    // Calculate target index based on current position
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
    
    // Calculate exact snap position
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
    const newTranslate = -currentCardIndex * 100
    setPrevTranslate(newTranslate)
    setCurrentTranslate(newTranslate)
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
            <div 
              key={index} 
              className={`card ${isDragging ? 'grabbing' : ''}`}
            >
              <h2>{card.title}</h2>
              <div className='deviding-line'></div>
              <img src={card.image} alt="emoji" />
            </div>
          ))}
        </div>
      </div>
      
      <div className='progress-dots'>
        {cards.map((_, index) => (
          <div 
            key={index} 
            className={`dot ${index === currentCardIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default App
