import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import logo from '../assets/header-logo.svg'
import CategoryChip from '../components/CategoryChip.jsx'
import CameraButton from '../components/CameraButton.jsx'
import CategorySheet from '../components/CategorySheet.jsx'
import { categories } from '../data/categories.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import './HomeScreen.css'

const LANGUAGES = [
  { code: 'ar', label: 'عربي', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'he', label: 'עברית', dir: 'rtl' },
]

function breakAfter(text, marker) {
  if (!marker) return [text, null]
  const cut = text.indexOf(marker)
  if (cut === -1) return [text, null]
  const splitAt = cut + marker.length
  return [text.slice(0, splitAt), text.slice(splitAt).trimStart()]
}

export default function HomeScreen() {
  const [ingredientsOpen, setIngredientsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const [nameStart, nameRest] = breakAfter(t.productName, t.productNameBreakAfter)
  const buttonRefs = useRef({})
  const [underline, setUnderline] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const activeButton = buttonRefs.current[language]
    if (activeButton) {
      setUnderline({ left: activeButton.offsetLeft, width: activeButton.offsetWidth })
    }
  }, [language])

  return (
    <div className="home-screen">
      <header className="home-screen__header">
        <img src={logo} alt={t.logoAlt} className="home-screen__logo" />
      </header>

      <div className="product-banner-group">
        <div className="product-banner">
          <p className="product-banner__name">
            {nameStart}
            {nameRest && <br />}
            {nameRest}
          </p>
        </div>
        <p className="weight-badge">
          {t.weightLabel}: <strong className="weight-badge__value">{t.weightValue}</strong>
        </p>
      </div>

      <div className="category-grid" dir="rtl">
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            {...category}
            label={t.categories[category.id]}
            onClick={category.id === 'ingredients' ? () => setIngredientsOpen(true) : undefined}
          />
        ))}
      </div>

      <CameraButton />

      <CategorySheet
        open={ingredientsOpen}
        onClose={() => setIngredientsOpen(false)}
        title={t.ingredientsTitle}
        bodyText={t.ingredientsText}
      />

      <footer className="language-switcher" dir="ltr">
        {LANGUAGES.map(({ code, label, dir }, index) => (
          <Fragment key={code}>
            {index > 0 && <span aria-hidden="true">|</span>}
            <button
              ref={(el) => {
                buttonRefs.current[code] = el
              }}
              type="button"
              lang={code}
              dir={dir}
              className={language === code ? 'language-switcher__active' : undefined}
              onClick={() => setLanguage(code)}
            >
              {label}
            </button>
          </Fragment>
        ))}
        <span className="language-switcher__underline" style={{ left: underline.left, width: underline.width }} />
      </footer>
    </div>
  )
}
