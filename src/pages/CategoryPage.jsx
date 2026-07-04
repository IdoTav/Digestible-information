import { useParams, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { categories } from '../data/categories.js'
import './CategoryPage.css'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const category = categories.find((c) => c.id === categoryId)

  return (
    <div className="category-page">
      <Link to="/" className="category-page__back">
        <ChevronRight size={20} aria-hidden="true" />
        <span>חזרה</span>
      </Link>
      <h1 className="category-page__title">{category?.label ?? 'קטגוריה'}</h1>
      <p className="category-page__body">התוכן של קטגוריה זו בבנייה, יעודכן בקרוב.</p>
    </div>
  )
}
