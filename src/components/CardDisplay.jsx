import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import ProgressDots from './ProgressDots'
import { AdamCards, KrystofCards, FilipCards } from '../data/cardData.js'
import './Card.css'

function CardDisplay({ personName }) {
  // Get the correct card data based on the personName
  const getCardData = () => {
    switch(personName) {
      case 'Adam':
        return AdamCards
      case 'Krystof':
        return KrystofCards
      case 'Filip':
        return FilipCards
      // Add cases for other people
      default:
        return AdamCards // Fallback to Adam's cards
    }
  }
  
  const cardData = getCardData()
  const [activeIndex, setActiveIndex] = useState(0)
  const [startPos, setStartPos] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef(null)
  
  // Used to track swipe distance
  const dragOffset = useRef(0)

  // Clean up all drag states
  const resetDragState = () => {
    setIsDragging(false)
    document.body.classList.remove('dragging')
    dragOffset.current = 0
    setCurrentTranslate(0)
    
    // Reset card styles
    if (sliderRef.current) {
      const cards = sliderRef.current.querySelectorAll('.card')
      cards.forEach(card => {
        card.classList.remove('swiping')
        card.classList.remove('grabbing')
        card.style.transform = ''
      })
    }
  }

  // Handle dragging to swipe cards
  const handleDragStart = (e) => {
    // Don't prevent default for mouse events
    if (e.type === 'touchstart') {
      e.preventDefault()
    }
    
    setIsDragging(true)
    document.body.classList.add('dragging')
    
    // Capture start position
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
    setStartPos(clientX)
    dragOffset.current = 0
    
    // Add swiping and grabbing class to the active card
    if (sliderRef.current) {
      const activeCard = sliderRef.current.querySelector('.card.active')
      if (activeCard) {
        activeCard.classList.add('swiping')
        activeCard.classList.add('grabbing')
      }
    }
  }

  const handleDragMove = (e) => {
    if (!isDragging) return
    
    // Calculate distance moved
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
    const diff = clientX - startPos
    dragOffset.current = diff // Store the current offset
    
    // Only allow swiping if within valid index range
    if ((activeIndex === 0 && diff > 0) || 
        (activeIndex === cardData.length - 1 && diff < 0)) {
      return
    }
    
    setCurrentTranslate(diff)
    
    // Update active card appearance during drag
    if (sliderRef.current) {
      const activeCard = sliderRef.current.querySelector('.card.active')
      if (activeCard) {
        // Apply drag movement with rotation
        const rotationAngle = diff * 0.05
        // Base transform for active card
        const baseTransform = "translateX(-20%) scale(1.02)";
        // Apply additional transform for dragging
        activeCard.style.transform = `${baseTransform} translateX(${diff}px) rotate(${rotationAngle}deg)`
      }
    }
  }

  const handleDragEnd = (e) => {
    if (!isDragging) return
    
    // Get the final offset value from the ref before resetting
    const finalOffset = dragOffset.current
    
    // Reset all drag-related states
    resetDragState()
    
    // Make swiping more sensitive - 10px threshold
    if (finalOffset < -10 && activeIndex < cardData.length - 1) {
      setActiveIndex(activeIndex + 1)
    } else if (finalOffset > 10 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }

  // Add event listeners
  useEffect(() => {
    const slider = sliderRef.current
    
    if (slider) {
      // Directly attach to active card instead of slider
      const handleMouseDown = (e) => {
        // Only process if clicking on the active card
        if (e.target.closest('.card.active')) {
          handleDragStart(e)
        }
      }
      
      slider.addEventListener('mousedown', handleMouseDown)
      slider.addEventListener('touchstart', handleMouseDown, { passive: false })
      
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('touchmove', handleDragMove, { passive: true })
      
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('mouseleave', handleDragEnd)
      window.addEventListener('touchend', handleDragEnd)
      window.addEventListener('touchcancel', handleDragEnd)
    }
    
    // Clean up function
    return () => {
      if (slider) {
        slider.removeEventListener('mousedown', handleDragStart)
        slider.removeEventListener('touchstart', handleDragStart)
      }
      
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('mouseleave', handleDragEnd)
      window.removeEventListener('touchend', handleDragEnd)
      window.removeEventListener('touchcancel', handleDragEnd)
      
      // Ensure we clean up if component unmounts while dragging
      resetDragState()
    }
  }, [isDragging, activeIndex])
  
  // Ensure drag state is reset when card index changes
  useEffect(() => {
    resetDragState()
  }, [activeIndex])

  return (
    <>
      <div className="card-container">
        <div 
          className="card-slider" 
          ref={sliderRef}
        >
          {cardData.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              image={card.image}
              button={card.button}
              link={card.link}
              isDragging={isDragging}
              className={
                index === activeIndex
                  ? 'active'
                  : index === activeIndex + 1
                  ? 'next'
                  : 'prev'
              }
            />
          ))}
        </div>
      </div>
      <ProgressDots 
        totalDots={cardData.length} 
        activeDot={activeIndex} 
        onDotClick={setActiveIndex} 
      />
    </>
  )
}

CardDisplay.propTypes = {
  personName: PropTypes.string.isRequired
}

export default CardDisplay
