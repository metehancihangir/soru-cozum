import { useState } from 'react'
import './HomeScreen.css'

function HomeScreen({ onSelectCategory }) {
  const [comingSoon, setComingSoon] = useState(false)

  const handleArabic4Click = () => {
    setComingSoon(true)
    setTimeout(() => setComingSoon(false), 2800)
  }

  return (
    <div className="home-container">
      {/* Arka plan dekoratif şekiller */}
      <div className="home-bg-orb home-bg-orb--1" aria-hidden="true" />
      <div className="home-bg-orb home-bg-orb--2" aria-hidden="true" />

      <header className="home-header">
        <div className="home-logo" aria-label="Arapça Soru uygulaması logosu">
          <span className="home-logo-icon">📖</span>
        </div>
        <h1 className="home-title">ArapçaSoru</h1>
        <p className="home-subtitle">
          Arapça dil becerilerini geliştirmek için interaktif soru çözüm platformu
        </p>
      </header>

      <section className="home-categories" aria-label="Kategori seçimi">
        <h2 className="home-categories-heading">Kategori Seç</h2>

        {/* Arapça-2 Butonu */}
        <button
          id="btn-arabic-2"
          className="category-card category-card--active"
          onClick={() => onSelectCategory('arabic2')}
          aria-label="Arapça-2 kategorisini başlat"
        >
          <span className="category-card__badge">100 Soru</span>
          <div className="category-card__icon" aria-hidden="true">🌙</div>
          <div className="category-card__body">
            <h3 className="category-card__title">Arapça-2</h3>
            <p className="category-card__desc">
              Temel ve orta düzey Arapça soruları ile dil becerilerini pekiştir
            </p>
          </div>
          <span className="category-card__arrow" aria-hidden="true">→</span>
        </button>

        {/* Arapça-4 Butonu */}
        <button
          id="btn-arabic-4"
          className="category-card category-card--soon"
          onClick={handleArabic4Click}
          aria-label="Arapça-4 kategorisi henüz hazır değil"
          aria-disabled="true"
        >
          <span className="category-card__badge category-card__badge--soon">Yakında</span>
          <div className="category-card__icon" aria-hidden="true">⭐</div>
          <div className="category-card__body">
            <h3 className="category-card__title">Arapça-4</h3>
            <p className="category-card__desc">
              İleri düzey Arapça soruları — çok yakında hizmetinizde
            </p>
          </div>
          <span className="category-card__lock" aria-hidden="true">🔒</span>
        </button>
      </section>

      {/* "Yakında" toast bildirimi */}
      {comingSoon && (
        <div className="home-toast" role="alert" aria-live="assertive">
          🔒 Arapça-4 çok yakında geliyor!
        </div>
      )}

      <footer className="home-footer">
        <p>Kategori seçerek quize başlayabilirsin</p>
      </footer>
    </div>
  )
}

export default HomeScreen
