import { useEffect, useRef, useState } from 'react'
import contrastInner from '../assets/icons/sheet/contrast-inner.svg'
import volumeSpeaker from '../assets/icons/sheet/volume-speaker.svg'
import volumeWave1 from '../assets/icons/sheet/volume-wave1.svg'
import volumeWave2 from '../assets/icons/sheet/volume-wave2.svg'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import './CategorySheet.css'

const CLOSE_THRESHOLD = 120
const MIN_FONT_STEP = -3
const MAX_FONT_STEP = 3
const BASE_FONT_SIZE = 18
const BODY_TEXT_BASE_FONT_SIZE = 20
const FONT_STEP_SIZE = 3
// Icon grid sizing is fluid (cqw, relative to .category-sheet__icon-grid's own width)
// rather than fixed px, so the 4-column layout scales cleanly on any screen width
// instead of staying a fixed native size. Each icon's larger native dimension is
// normalized to this budget, keeping every allergen icon a similar visual footprint
// regardless of its own aspect ratio (matching the Figma reference).
const ICON_BUDGET_CQW = 15
const LABEL_BASE_CQW = 4.6
// Rendered as explicit rows (rather than one CSS grid) so a partial last row (e.g. 3
// of 7 allergens) can be centered with plain flexbox justify-content — grid-column
// line offsetting for this turned out not to center symmetrically under RTL.
const ICONS_PER_ROW = 4

// Nutrition body sizing follows the same cqw-relative-to-fontStep approach as the
// icon grid above, for the same reason: fixed cards/boxes must not overflow/clip at
// the max font-size step. Budgets are calibrated against the stat-card row's own
// content width (matching each icon's footprint in the Figma reference).
const STAT_CARD_ICON_BUDGET_CQW = 12
const STAT_CARD_LABEL_BASE_CQW = 3.6
const STAT_CARD_VALUE_BASE_CQW = 4.6
const STAT_CARD_UNIT_BASE_CQW = 3.2
const FACT_TABLE_TEXT_BASE_CQW = 3.6
const SUGAR_BOX_ICON_BUDGET_CQW = 8
const SUGAR_BOX_LABEL_BASE_CQW = 3.4
const SUGAR_BOX_VALUE_BASE_CQW = 4.4

function NutritionBody({ data, fontStep, iconScale, dir }) {
  const fontPx = (baseCqw) => `calc(${baseCqw}cqw + ${fontStep * FONT_STEP_SIZE}px)`

  return (
    <div className="category-sheet__nutrition">
      <div className="category-sheet__stat-row" dir="ltr">
        {data.cards.map((card) =>
          card.flattenedImage ? (
            <div key={card.id} className="category-sheet__stat-card category-sheet__stat-card--flattened">
              <img src={card.flattenedImage} alt="" className="category-sheet__stat-card-bg-img" />
              <span className="category-sheet__stat-card-label" style={{ fontSize: fontPx(STAT_CARD_LABEL_BASE_CQW) }}>
                {card.label}
              </span>
              {/* The icon is baked into the background image above (already positioned in
                  this middle zone), so this spacer just reserves the same flexible middle
                  space the other two cards' real <img> icons occupy — nothing to render. */}
              <span className="category-sheet__stat-card-icon-wrap" aria-hidden="true" />
              <span className="category-sheet__stat-card-divider" />
              <span className="category-sheet__stat-card-value">
                <span style={{ fontSize: fontPx(STAT_CARD_VALUE_BASE_CQW) }}>{card.value}</span>
                {card.unit && <span style={{ fontSize: fontPx(STAT_CARD_UNIT_BASE_CQW) }}> {card.unit}</span>}
              </span>
            </div>
          ) : (
            <div key={card.id} className="category-sheet__stat-card" style={{ backgroundColor: card.bg }}>
              <span className="category-sheet__stat-card-label" style={{ fontSize: fontPx(STAT_CARD_LABEL_BASE_CQW) }}>
                {card.label}
              </span>
              <span className="category-sheet__stat-card-icon-wrap">
                <img
                  src={card.icon}
                  alt=""
                  className="category-sheet__stat-card-icon"
                  style={{
                    width: `${card.iconWidth * ((STAT_CARD_ICON_BUDGET_CQW / Math.max(card.iconWidth, card.iconHeight)) * iconScale)}cqw`,
                    height: `${card.iconHeight * ((STAT_CARD_ICON_BUDGET_CQW / Math.max(card.iconWidth, card.iconHeight)) * iconScale)}cqw`,
                  }}
                />
              </span>
              <span className="category-sheet__stat-card-divider" />
              <span className="category-sheet__stat-card-value">
                <span style={{ fontSize: fontPx(STAT_CARD_VALUE_BASE_CQW) }}>{card.value}</span>
                {card.unit && <span style={{ fontSize: fontPx(STAT_CARD_UNIT_BASE_CQW) }}> {card.unit}</span>}
              </span>
            </div>
          ),
        )}
      </div>

      <div className="category-sheet__fact-row" dir="ltr">
        <div className="category-sheet__fact-table" dir={dir}>
          <div className="category-sheet__fact-table-labels">
            {data.table.map((row) => (
              <span key={row.id} style={{ fontSize: fontPx(FACT_TABLE_TEXT_BASE_CQW) }}>
                {row.label}
              </span>
            ))}
          </div>
          <span className="category-sheet__fact-table-divider" />
          <div className="category-sheet__fact-table-values">
            {data.table.map((row) => (
              <span key={row.id} style={{ fontSize: fontPx(FACT_TABLE_TEXT_BASE_CQW) }}>
                {row.value} {row.unit}
              </span>
            ))}
          </div>
        </div>

        <div className="category-sheet__sugar-box" dir={dir}>
          {[data.sugarBox.sugar, data.sugarBox.teaspoons].map((item, index) => (
            <div key={index} className="category-sheet__sugar-box-col">
              <img
                src={item.icon}
                alt=""
                className="category-sheet__sugar-box-icon"
                style={{
                  width: `${item.iconWidth * ((SUGAR_BOX_ICON_BUDGET_CQW / Math.max(item.iconWidth, item.iconHeight)) * iconScale)}cqw`,
                  height: `${item.iconHeight * ((SUGAR_BOX_ICON_BUDGET_CQW / Math.max(item.iconWidth, item.iconHeight)) * iconScale)}cqw`,
                }}
              />
              <span className="category-sheet__sugar-box-label" style={{ fontSize: fontPx(SUGAR_BOX_LABEL_BASE_CQW) }}>
                {item.label}
              </span>
              <span className="category-sheet__sugar-box-value" style={{ fontSize: fontPx(SUGAR_BOX_VALUE_BASE_CQW) }}>
                {item.value}
                {item.unit ? ` ${item.unit}` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function pickBestVoice(voices, langPrefix) {
  const matches = voices.filter((v) => v.lang?.toLowerCase().startsWith(langPrefix))
  if (matches.length === 0) return null
  // Network-backed voices (localService: false) are typically higher quality
  // than the device's built-in offline voice.
  return matches.find((v) => !v.localService) || matches[0]
}

export default function CategorySheet({
  open,
  onClose,
  title,
  subtitle,
  bodyHeading,
  bodyHeadingColor,
  bodyText,
  bodyIcons,
  bodyNutrition,
}) {
  const { t, dir } = useLanguage()
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [fontStep, setFontStep] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const startY = useRef(0)
  const volumeIconFilter = highContrast !== speaking ? 'invert(1)' : 'none'
  const iconScale = (BASE_FONT_SIZE + fontStep * FONT_STEP_SIZE) / BASE_FONT_SIZE

  useEffect(() => {
    if (!open) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [open])

  useEffect(() => () => window.speechSynthesis.cancel(), [])

  // Warm up the voice list ahead of time. speechSynthesis.getVoices() is empty
  // on first use until the browser loads it asynchronously (voiceschanged), and
  // speak() must be called synchronously inside the click handler to count as
  // user-triggered — awaiting the voice list inside the click handler pushes
  // speak() past that window, so the first click silently does nothing.
  useEffect(() => {
    window.speechSynthesis.getVoices()
    const warmUp = () => window.speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener('voiceschanged', warmUp)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', warmUp)
  }, [])

  const handleToggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const voice = pickBestVoice(window.speechSynthesis.getVoices(), t.speechLang.split('-')[0])

    const factToSpeech = (fact) => `${fact.label} ${fact.value}${fact.unit ? ` ${fact.unit}` : ''}`
    const spokenBody = bodyNutrition
      ? [
          ...bodyNutrition.cards.map(factToSpeech),
          ...bodyNutrition.table.map(factToSpeech),
          factToSpeech(bodyNutrition.sugarBox.sugar),
          factToSpeech(bodyNutrition.sugarBox.teaspoons),
        ].join(', ')
      : bodyIcons
      ? bodyIcons.map((item) => item.label).join(', ')
      : bodyText
    const speechLead = bodyHeading || subtitle
    const utterance = new SpeechSynthesisUtterance(speechLead ? `${speechLead} ${spokenBody}` : spokenBody)
    utterance.lang = t.speechLang
    utterance.rate = 0.92
    if (voice) utterance.voice = voice
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  const handlePointerDown = (event) => {
    startY.current = event.clientY
    setDragging(true)
    event.target.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!dragging) return
    const delta = Math.max(0, event.clientY - startY.current)
    setDragY(delta)
  }

  const handlePointerUp = () => {
    if (!dragging) return
    setDragging(false)
    if (dragY > CLOSE_THRESHOLD) {
      onClose()
    }
    setDragY(0)
  }

  return (
    <>
      <div
        className={`category-sheet__backdrop${open ? ' category-sheet__backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`category-sheet${bodyNutrition ? ' category-sheet--nutrition' : ''}${open ? ' category-sheet--open' : ''}${highContrast ? ' category-sheet--high-contrast' : ''}`}
        style={dragging ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div
          className="category-sheet__handle-area"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="category-sheet__handle" />
          <h2 className="category-sheet__title">{title}</h2>
          {subtitle && <p className="category-sheet__subtitle">{subtitle}</p>}
        </div>

        <div className="category-sheet__controls">
          <button
            type="button"
            className="category-sheet__control"
            onClick={() => setHighContrast((v) => !v)}
            aria-pressed={highContrast}
          >
            <span className="category-sheet__control-icon">
              <span className="contrast-icon" aria-hidden="true">
                <img src={contrastInner} alt="" className="contrast-icon__ring" />
                <span className="contrast-icon__fill" />
              </span>
            </span>
            <span className="category-sheet__control-label">{t.contrast}</span>
          </button>

          <div className="category-sheet__font-toggle">
            <button
              type="button"
              className="category-sheet__font-btn"
              onClick={() => setFontStep((s) => Math.max(MIN_FONT_STEP, s - 1))}
              disabled={fontStep <= MIN_FONT_STEP}
              aria-label={t.shrinkText}
            >
              {t.fontGlyph}-
            </button>
            <span className="category-sheet__font-toggle-divider" />
            <button
              type="button"
              className="category-sheet__font-btn"
              onClick={() => setFontStep((s) => Math.min(MAX_FONT_STEP, s + 1))}
              disabled={fontStep >= MAX_FONT_STEP}
              aria-label={t.growText}
            >
              {t.fontGlyph}+
            </button>
          </div>

          <button
            type="button"
            className={`category-sheet__control${speaking ? ' category-sheet__control--active' : ''}`}
            onClick={handleToggleSpeech}
            aria-pressed={speaking}
          >
            <span className="category-sheet__control-icon">
              <span className="volume-icon" aria-hidden="true" style={{ filter: volumeIconFilter }}>
                <img src={volumeSpeaker} alt="" className="volume-icon__speaker" />
                <img src={volumeWave1} alt="" className="volume-icon__wave1" />
                <img src={volumeWave2} alt="" className="volume-icon__wave2" />
              </span>
            </span>
            <span className="category-sheet__control-label">{speaking ? t.listening : t.listen}</span>
          </button>
        </div>

        <div className="category-sheet__body">
          {bodyHeading && (
            <p
              className="category-sheet__body-heading"
              style={{ fontSize: `${BASE_FONT_SIZE + 4 + fontStep * FONT_STEP_SIZE}px`, color: bodyHeadingColor }}
            >
              {bodyHeading}
            </p>
          )}
          {bodyNutrition ? (
            <NutritionBody data={bodyNutrition} fontStep={fontStep} iconScale={iconScale} dir={dir} />
          ) : bodyIcons ? (
            <div className="category-sheet__icon-grid">
              {[bodyIcons.slice(0, ICONS_PER_ROW), bodyIcons.slice(ICONS_PER_ROW)]
                .filter((row) => row.length > 0)
                .map((row, rowIndex) => (
                  <div key={rowIndex} className="category-sheet__icon-row">
                    {row.map((item) => {
                      const iconBudgetCqw = (ICON_BUDGET_CQW / Math.max(item.width, item.height)) * iconScale
                      return (
                        <div key={item.id} className="category-sheet__icon-item">
                          <img
                            src={item.icon}
                            alt=""
                            className="category-sheet__icon-item-img"
                            style={{
                              width: `${item.width * iconBudgetCqw}cqw`,
                              height: `${item.height * iconBudgetCqw}cqw`,
                            }}
                          />
                          <span
                            className="category-sheet__icon-item-label"
                            style={{ fontSize: `calc(${LABEL_BASE_CQW}cqw + ${fontStep * FONT_STEP_SIZE}px)` }}
                          >
                            {item.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
            </div>
          ) : (
            <p style={{ fontSize: `${BODY_TEXT_BASE_FONT_SIZE + fontStep * FONT_STEP_SIZE}px` }}>{bodyText}</p>
          )}
        </div>
      </div>
    </>
  )
}
