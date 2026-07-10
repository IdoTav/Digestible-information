import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import logo from '../assets/header-logo.svg'
import productPhoto from '../assets/product-photo.png'
import CategoryChip from '../components/CategoryChip.jsx'
import CategoryListRow from '../components/CategoryListRow.jsx'
import CameraButton from '../components/CameraButton.jsx'
import CategorySheet from '../components/CategorySheet.jsx'
import { categories } from '../data/categories.js'
import { allergenIcons } from '../data/allergenIcons.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import './HomeScreen.css'

const LANGUAGES = [
  { code: 'ar', label: 'عربي', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'he', label: 'עברית', dir: 'rtl' },
]

const SHEET_CATEGORIES = new Set(['ingredients', 'allergens'])
const primaryCategories = categories.filter((category) => category.group === 'primary')
const secondaryCategories = categories.filter((category) => category.group === 'secondary')

export default function HomeScreen() {
  const [openSheet, setOpenSheet] = useState(null)
  const { language, setLanguage, t, dir } = useLanguage()
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

      <div className="product-card" dir="ltr">
        <img src={productPhoto} alt="" className="product-card__photo" />
        <div className="product-card__text" dir={dir}>
          <p className="product-card__heading">
            <span className="product-card__brand">{t.brand}</span>
            <span className="product-card__weight">{t.weightValue}</span>
          </p>
          <p className="product-card__description">{t.productName}</p>
        </div>
      </div>

      <hr className="section-divider" />

      <div className="category-grid" dir="ltr">
        {primaryCategories.map((category) => (
          <CategoryChip
            key={category.id}
            {...category}
            label={t.categories[category.id]}
            onClick={SHEET_CATEGORIES.has(category.id) ? () => setOpenSheet(category.id) : undefined}
          />
        ))}
      </div>

      <div className="more-info-divider">
        <span className="more-info-divider__line" aria-hidden="true" />
        <span className="more-info-divider__label">{t.moreInfo}</span>
        <span className="more-info-divider__line" aria-hidden="true" />
      </div>

      <div className="category-list">
        {secondaryCategories.map((category) => (
          <CategoryListRow key={category.id} {...category} label={t.categories[category.id]} />
        ))}
      </div>

      <CameraButton />

      <CategorySheet
        open={openSheet === 'ingredients'}
        onClose={() => setOpenSheet(null)}
        title={t.ingredientsTitle}
        bodyText={t.ingredientsText}
      />

      <CategorySheet
        open={openSheet === 'allergens'}
        onClose={() => setOpenSheet(null)}
        title={t.categories.allergens}
        bodyHeading={t.allergensIntro}
        bodyHeadingColor="#EA2427"
        bodyIcons={allergenIcons.map((item) => ({ ...item, label: t.allergenLabels[item.id] }))}
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
