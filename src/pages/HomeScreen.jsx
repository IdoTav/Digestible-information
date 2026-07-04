import logo from '../assets/header-logo.svg'
import CategoryChip from '../components/CategoryChip.jsx'
import CameraButton from '../components/CameraButton.jsx'
import { categories, product } from '../data/categories.js'
import './HomeScreen.css'

export default function HomeScreen() {
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
          <CategoryChip key={category.id} {...category} />
        ))}
      </div>

      <CameraButton />

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
