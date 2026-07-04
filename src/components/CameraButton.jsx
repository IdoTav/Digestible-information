import { useRef } from 'react'
import cameraIcon from '../assets/camera-icon.svg'
import './CameraButton.css'

export default function CameraButton() {
  const inputRef = useRef(null)

  const handleCapture = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: wire up to the real scan/product-lookup flow
      console.log('Captured file:', file)
    }
    event.target.value = ''
  }

  return (
    <div className="camera-button">
      <button
        type="button"
        className="camera-button__trigger"
        onClick={() => inputRef.current?.click()}
        aria-label="סרוק מוצר נוסף"
      >
        <img src={cameraIcon} alt="" className="camera-button__icon" />
      </button>
      <span className="camera-button__label">סרוק מוצר נוסף</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="camera-button__input"
      />
    </div>
  )
}
