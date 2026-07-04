import { useRef, useState } from 'react'
import { Volume2, Contrast } from 'lucide-react'
import './CategorySheet.css'

const CLOSE_THRESHOLD = 120

export default function CategorySheet({ open, onClose, title, bodyText }) {
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef(0)

  const handlePointerDown = (event) => {
    startY.current = event.clientY
    setDragging(true)
    event.target.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!dragging) return
    const delta = Math.max(0, event.clientY - startY.current)
    setDragY(delta)
  }

  const handlePointerUp = () => {
    if (!dragging) return
    setDragging(false)
    if (dragY > CLOSE_THRESHOLD) {
      onClose()
    }
    setDragY(0)
  }

  return (
    <>
      <div
        className={`category-sheet__backdrop${open ? ' category-sheet__backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`category-sheet${open ? ' category-sheet--open' : ''}`}
        style={dragging ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div
          className="category-sheet__handle-area"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="category-sheet__handle" />
          <h2 className="category-sheet__title">{title}</h2>
        </div>

        <div className="category-sheet__controls">
          <button type="button" className="category-sheet__control">
            <span className="category-sheet__control-icon">
              <Contrast size={28} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="category-sheet__control-label">ניגודיות</span>
          </button>

          <button type="button" className="category-sheet__font-toggle">
            <span>א-</span>
            <span className="category-sheet__font-toggle-divider" />
            <span>א+</span>
          </button>

          <button type="button" className="category-sheet__control">
            <span className="category-sheet__control-icon">
              <Volume2 size={28} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="category-sheet__control-label">השמעה</span>
          </button>
        </div>

        <div className="category-sheet__body">
          <p>{bodyText}</p>
        </div>
      </div>
    </>
  )
}
