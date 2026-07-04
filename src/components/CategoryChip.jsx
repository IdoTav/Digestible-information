import { Link } from 'react-router-dom'
import { ChevronUp } from 'lucide-react'
import './CategoryChip.css'

export default function CategoryChip({ id, label, icon, color, onClick }) {
  const handleClick = (event) => {
    if (onClick) {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <Link to={`/category/${id}`} className="category-chip" style={{ '--chip-color': color }} onClick={handleClick}>
      <img src={icon} alt="" className="category-chip__icon" aria-hidden="true" />
      <span className="category-chip__label">{label.replaceAll('/', '/​')}</span>
      <span className="category-chip__tab">
        <ChevronUp size={16} className="category-chip__chevron" aria-hidden="true" />
      </span>
    </Link>
  )
}
