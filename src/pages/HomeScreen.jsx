import { useState } from 'react'
import logo from '../assets/header-logo.svg'
import CategoryChip from '../components/CategoryChip.jsx'
import CameraButton from '../components/CameraButton.jsx'
import CategorySheet from '../components/CategorySheet.jsx'
import { categories, product } from '../data/categories.js'
import './HomeScreen.css'

const INGREDIENTS_TEXT =
  'שוקולד חלב מעולה, סירופ גלוקוזה, קמח חיטה (גלוטן), סוכר לבן, שמנים ושומנים מהצומח, מים, אבקת חלב, קמח סויה, מלח, מתחלבים (לציטין לפתית, E-471), ונילין, מתפיחים (E-503ii, E-500ii), חומרי טעם וריח, אנזים (פרוטאינזה).'

export default function HomeScreen() {
  const [ingredientsOpen, setIngredientsOpen] = useState(false)

  return (
    <div className="home-screen">
      <header className="home-screen__header">
        <img src={logo} alt="קריא למאכל" className="home-screen__logo" />
      </header>

      <div className="product-banner-group">
        <div className="product-banner">
          <p className="product-banner__name">{product.name}</p>
        </div>
        <p className="weight-badge">משקל נקי כולל: {product.netWeight}</p>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            {...category}
            onClick={category.id === 'ingredients' ? () => setIngredientsOpen(true) : undefined}
          />
        ))}
      </div>

      <CameraButton />

      <CategorySheet
        open={ingredientsOpen}
        onClose={() => setIngredientsOpen(false)}
        title="רכיבים"
        bodyText={INGREDIENTS_TEXT}
      />

      <footer className="language-switcher">
        <a href="#" lang="he" dir="rtl" className="language-switcher__active">
          עברית
        </a>
        <span aria-hidden="true">|</span>
        <a href="#" lang="en" dir="ltr">
          English
        </a>
        <span aria-hidden="true">|</span>
        <a href="#" lang="ar" dir="rtl">
          عربي
        </a>
      </footer>
    </div>
  )
}
