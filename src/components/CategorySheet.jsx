import { useEffect, useRef, useState } from 'react'
import contrastInner from '../assets/icons/sheet/contrast-inner.svg'
import volumeSpeaker from '../assets/icons/sheet/volume-speaker.svg'
import volumeWave1 from '../assets/icons/sheet/volume-wave1.svg'
import volumeWave2 from '../assets/icons/sheet/volume-wave2.svg'
import './CategorySheet.css'

const CLOSE_THRESHOLD = 120
const MIN_FONT_STEP = -3
const MAX_FONT_STEP = 3
const BASE_FONT_SIZE = 18
const FONT_STEP_SIZE = 3

function getVoicesAsync() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length) {
      resolve(voices)
      return
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices())
    }
  })
}

function pickBestHebrewVoice(voices) {
  const hebrew = voices.filter((v) => v.lang?.toLowerCase().startsWith('he'))
  if (hebrew.length === 0) return null
  // Network-backed voices (localService: false) are typically higher quality
  // than the device's built-in offline voice.
  return hebrew.find((v) => !v.localService) || hebrew[0]
}

export default function CategorySheet({ open, onClose, title, bodyText }) {
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [fontStep, setFontStep] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const startY = useRef(0)
  const volumeIconFilter = highContrast !== speaking ? 'invert(1)' : 'none'

  useEffect(() => {
    if (!open) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [open])

  useEffect(() => () => window.speechSynthesis.cancel(), [])

  const handleToggleSpeech = async () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const voices = await getVoicesAsync()
    const voice = pickBestHebrewVoice(voices)

    const utterance = new SpeechSynthesisUtterance(bodyText)
    utterance.lang = 'he-IL'
    utterance.rate = 0.92
    if (voice) utterance.voice = voice
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

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
        className={`category-sheet${open ? ' category-sheet--open' : ''}${highContrast ? ' category-sheet--high-contrast' : ''}`}
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
          <button
            type="button"
            className="category-sheet__control"
            onClick={() => setHighContrast((v) => !v)}
            aria-pressed={highContrast}
          >
            <span className="category-sheet__control-icon">
              <span className="contrast-icon" aria-hidden="true">
                <img src={contrastInner} alt="" className="contrast-icon__ring" />
                <span className="contrast-icon__fill" />
              </span>
            </span>
            <span className="category-sheet__control-label">ניגודיות</span>
          </button>

          <div className="category-sheet__font-toggle">
            <button
              type="button"
              className="category-sheet__font-btn"
              onClick={() => setFontStep((s) => Math.max(MIN_FONT_STEP, s - 1))}
              disabled={fontStep <= MIN_FONT_STEP}
              aria-label="הקטן טקסט"
            >
              א-
            </button>
            <span className="category-sheet__font-toggle-divider" />
            <button
              type="button"
              className="category-sheet__font-btn"
              onClick={() => setFontStep((s) => Math.min(MAX_FONT_STEP, s + 1))}
              disabled={fontStep >= MAX_FONT_STEP}
              aria-label="הגדל טקסט"
            >
              א+
            </button>
          </div>

          <button
            type="button"
            className={`category-sheet__control${speaking ? ' category-sheet__control--active' : ''}`}
            onClick={handleToggleSpeech}
            aria-pressed={speaking}
          >
            <span className="category-sheet__control-icon">
              <span className="volume-icon" aria-hidden="true" style={{ filter: volumeIconFilter }}>
                <img src={volumeSpeaker} alt="" className="volume-icon__speaker" />
                <img src={volumeWave1} alt="" className="volume-icon__wave1" />
                <img src={volumeWave2} alt="" className="volume-icon__wave2" />
              </span>
            </span>
            <span className="category-sheet__control-label">{speaking ? 'מקריא...' : 'השמעה'}</span>
          </button>
        </div>

        <div className="category-sheet__body">
          <p style={{ fontSize: `${BASE_FONT_SIZE + fontStep * FONT_STEP_SIZE}px` }}>{bodyText}</p>
        </div>
      </div>
    </>
  )
}
