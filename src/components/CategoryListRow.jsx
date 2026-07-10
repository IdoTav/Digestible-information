import { Link } from 'react-router-dom'
import { ChevronUp } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import './CategoryListRow.css'

export default function CategoryListRow({ id, label, icon, color, onClick }) {
  const { dir } = useLanguage()
  const handleClick = (event) => {
    if (onClick) {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div className="category-list-row-container">
      <Link
        to={`/category/${id}`}
        className="category-list-row"
        style={{ '--row-color': color }}
        dir={dir}
        onClick={handleClick}
      >
        <img src={icon} alt="" className="category-list-row__icon" aria-hidden="true" />
        <span className="category-list-row__label">{label.replaceAll('/', '/​')}</span>
        <ChevronUp size={16} className="category-list-row__chevron" aria-hidden="true" />
      </Link>
    </div>
  )
}
