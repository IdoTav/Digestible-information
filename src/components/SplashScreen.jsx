import { useEffect, useRef, useState } from 'react'
import splashVideo from '../assets/splash.mp4'
import './SplashScreen.css'

const DISPLAY_MS = 5000
const FADE_MS = 500
const MAX_WAIT_MS = 3000

export default function SplashScreen({ onFinished }) {
  const [fading, setFading] = useState(false)
  const videoRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    let fadeTimer
    let doneTimer

    const startCountdown = () => {
      if (startedRef.current) return
      startedRef.current = true
      fadeTimer = setTimeout(() => setFading(true), DISPLAY_MS - FADE_MS)
      doneTimer = setTimeout(() => onFinished(), DISPLAY_MS)
    }

    // Safety net: if the video never fires 'playing' (slow network, unsupported
    // format, autoplay blocked, etc.), don't leave the user stuck on a blank screen.
    const fallbackTimer = setTimeout(startCountdown, MAX_WAIT_MS)

    const video = videoRef.current
    if (video) {
      video.muted = true
      video.play().catch(() => {})
      video.addEventListener('playing', startCountdown)
    }

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
      clearTimeout(fallbackTimer)
      video?.removeEventListener('playing', startCountdown)
    }
  }, [onFinished])

  return (
    <div className={`splash-screen${fading ? ' splash-screen--fading' : ''}`}>
      <video
        ref={videoRef}
        className="splash-screen__video"
        src={splashVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  )
}
