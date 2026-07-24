import { useState } from 'react'
import './HomeScreen.css'

// Ders kataloğu — App.jsx ile senkronize
const COURSE_META = {
  'Arapça-2': { questionCount: 180, active: true },
  'Arapça-4': { questionCount: 180, active: true },
}

function HomeScreen({ onSelectCourse, onOpenDashboard, onOpenAdmin }) {
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  let toastTimer = null

  const showToast = (msg) => {
    setToastMsg(msg)
    setToastVisible(true)
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => setToastVisible(false), 2200)
  }

  return (
    <div className="app-container home-screen-fade">
      <main className="home" aria-label="Kategori seçimi">

        {/* ── Marka / Logo ── */}
        <header className="home__brand">
          <div className="home__logo" aria-hidden="true">س</div>
          <h1 className="home__title">Soru Çözüm</h1>
          <p className="home__tagline">Arapça dil becerilerini geliştir</p>
        </header>

        {/* ── Kategori Kartları ── */}
        <div className="home__categories" role="list">

          {/* Arapça-2 — aktif */}
          <button
            type="button"
            className="cat-card cat-card--active"
            role="listitem"
            id="btn-arabic-2"
            aria-label={`Arapça-2, ${COURSE_META['Arapça-2'].questionCount} soru`}
            onClick={() => onSelectCourse('Arapça-2')}
          >
            <span className="cat-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3c-1.5 3-4 5-7 6 3 1 5.5 3 7 6 1.5-3 4-5 7-6-3-1-5.5-3-7-6z" />
              </svg>
            </span>
            <span className="cat-card__body">
              <span className="cat-card__name">Arapça-2</span>
              <span className="cat-card__meta">
                {COURSE_META['Arapça-2'].questionCount} Soru
              </span>
            </span>
            <span className="cat-card__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>

          {/* Arapça-4 */}
          <button
            type="button"
            className="cat-card cat-card--active"
            role="listitem"
            id="btn-arabic-4"
            aria-label={`Arapça-4, ${COURSE_META['Arapça-4'].questionCount} soru`}
            onClick={() => onSelectCourse('Arapça-4')}
          >
            <span className="cat-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
              </svg>
            </span>
            <span className="cat-card__body">
              <span className="cat-card__name">Arapça-4</span>
              <span className="cat-card__meta">
                {COURSE_META['Arapça-4'].questionCount} Soru
              </span>
            </span>
            <span className="cat-card__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>

        </div>

        {/* ── Kendini Analiz Et + Admin Butonları ── */}
        <div className="home__footer-actions">
          <button
            type="button"
            className="home__analyze-btn"
            onClick={onOpenDashboard}
          >
            Kendini Analiz Et
          </button>
          {onOpenAdmin && (
            <button
              type="button"
              className="home__admin-btn"
              onClick={onOpenAdmin}
              title="Yönetim Paneli"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          )}
        </div>
      </main>

      {/* ── Bildirim (Toast) ── */}
      <div
        className={`toast${toastVisible ? ' is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toastMsg}
      </div>
    </div>
  )
}

export default HomeScreen
