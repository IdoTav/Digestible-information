import { useEffect, useState } from 'react'
import splashVideo from '../assets/splash.mp4'
import './SplashScreen.css'

const DISPLAY_MS = 5000
const FADE_MS = 500

export default function SplashScreen({ onFinished }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), DISPLAY_MS - FADE_MS)
    const doneTimer = setTimeout(() => onFinished(), DISPLAY_MS)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onFinished])

  return (
    <div className={`splash-screen${fading ? ' splash-screen--fading' : ''}`}>
      <video
        className="splash-screen__video"
        src={splashVideo}
        autoPlay
        muted
        playsInline
        aria-hidden="true"
      />
    </div>
  )
}
