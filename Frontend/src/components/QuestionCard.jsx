import { useState, useCallback, useRef, useEffect } from 'react'
import { OPTION_LETTERS } from './questionCard.logic'

/**
 * Basit markdown-benzeri renderer.
 * **bold**, adım numaraları ve satır sonlarını HTML'e çevirir.
 */
function renderAiContent(text) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let key = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      elements.push(<br key={key++} />)
      continue
    }

    // Bold: **text** → <strong>text</strong>
    const parts = []
    let remaining = trimmed
    let partKey = 0

    while (remaining.length > 0) {
      const boldStart = remaining.indexOf('**')
      if (boldStart === -1) {
        parts.push(<span key={partKey++}>{remaining}</span>)
        break
      }
      if (boldStart > 0) {
        parts.push(<span key={partKey++}>{remaining.slice(0, boldStart)}</span>)
      }
      const boldEnd = remaining.indexOf('**', boldStart + 2)
      if (boldEnd === -1) {
        parts.push(<span key={partKey++}>{remaining.slice(boldStart)}</span>)
        break
      }
      parts.push(
        <strong key={partKey++}>{remaining.slice(boldStart + 2, boldEnd)}</strong>
      )
      remaining = remaining.slice(boldEnd + 2)
    }

    // Emoji başlıkları için özel stil
    const isHeader = trimmed.startsWith('🎯') || trimmed.startsWith('📝') || trimmed.startsWith('✅')
    const isOption = /^\*?\*?[A-E]\)/.test(trimmed)

    if (isHeader) {
      elements.push(
        <h4 key={key++} className="ai-content__header">{parts}</h4>
      )
    } else if (isOption) {
      elements.push(
        <p key={key++} className="ai-content__option">{parts}</p>
      )
    } else {
      elements.push(
        <p key={key++} className="ai-content__line">{parts}</p>
      )
    }
  }

  return elements
}


function QuestionCard({
  question,
  currentIndex,
  questionsTotal,
  selectedOption,
  isAnswered,
  onOptionClick,
  onNext,
  onBack,
  onAskAi,
  aiLoading,
  aiResponse,
}) {
  const isLast = currentIndex >= questionsTotal - 1

  // Progress bar yüzdesi
  const progressPct = ((currentIndex + 1) / questionsTotal) * 100

  // Yanlış cevap verildi mi?
  const isWrong = isAnswered && selectedOption !== question.correctOption

  // ── Tam Ekran Modal state'i ──
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100) // yüzde olarak font boyutu

  const openFullscreen = useCallback(() => {
    setIsFullscreen(true)
    setZoomLevel(100)
  }, [])

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false)
    setZoomLevel(100)
  }, [])

  const zoomIn  = useCallback(() => setZoomLevel(prev => Math.min(prev + 15, 200)), [])
  const zoomOut = useCallback(() => setZoomLevel(prev => Math.max(prev - 15, 60)), [])

  // ESC tuşu ile kapatma
  useEffect(() => {
    if (!isFullscreen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') closeFullscreen()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isFullscreen, closeFullscreen])

  // Soru değişince fullscreen kapat
  useEffect(() => {
    setIsFullscreen(false)
    setZoomLevel(100)
  }, [currentIndex])

  // AI yanıt verileri
  const aiExplanation  = aiResponse?.explanation || ''
  const aiQuotaWarning = aiResponse?.quotaWarning || null
  const aiIsError      = aiResponse?.isError || false

  // ── Collapsible bölümler state'i ──
  const [collapsedSections, setCollapsedSections] = useState({})
  const toggleSection = useCallback((section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }, [])

  return (
    <>
      <section
        className={`quiz ${isWrong ? 'quiz--has-ai-panel' : ''}`}
        aria-label="Soru çözümü"
      >

        {/* ── Üst bar: geri + sayaç ── */}
        <div className="quiz__top">
          <button
            type="button"
            className="quiz__back"
            onClick={onBack}
            aria-label="Ana menüye dön"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
            Ana menü
          </button>
          <p className="quiz__counter">
            Soru {currentIndex + 1} / {questionsTotal}
          </p>
        </div>

        {/* ── İlerleme çubuğu ── */}
        <div className="quiz__progress" aria-hidden="true">
          <div
            className="quiz__progress-bar"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* ── Quiz gövdesi: sol (soru) + sağ (AI paneli) ── */}
        <div className="quiz__body">

          {/* ── Sol taraf: Soru resmi + şıklar + feedback ── */}
          <div className="quiz__question">
            <div className="quiz__image-wrapper">
              <img
                src={import.meta.env.DEV ? question.imagePath : `https://soru-cozum-production.up.railway.app${question.imagePath}`}
                alt={`Soru ${currentIndex + 1}`}
                className="quiz__image"
                draggable={false}
              />
            </div>

            {/* ── Sabit A-E Şık Butonları ── */}
            <div
              className="quiz__options"
              role="group"
              aria-label="Cevap şıkları"
            >
              {OPTION_LETTERS.map((letter) => {
                const stateClass = isAnswered
                  ? letter === question.correctOption
                    ? ' is-correct'
                    : letter === selectedOption
                      ? ' is-wrong'
                      : ''
                  : ''

                return (
                  <button
                    key={letter}
                    type="button"
                    className={`option option--compact${stateClass}`}
                    disabled={isAnswered}
                    onClick={() => onOptionClick(letter)}
                    aria-pressed={selectedOption === letter}
                    aria-label={`Şık ${letter}`}
                  >
                    <span className="option__key" aria-hidden="true">
                      {letter}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* ── Cevap sonucu mesajı ── */}
            {isAnswered && (
              <p className={`quiz__feedback ${selectedOption === question.correctOption ? 'quiz__feedback--correct' : 'quiz__feedback--wrong'}`}>
                {selectedOption === question.correctOption
                  ? '✓ Doğru!'
                  : `✗ Yanlış — Doğru cevap: ${question.correctOption}`}
              </p>
            )}
          </div>

          {/* ── Sağ taraf: AI paneli (sadece yanlış cevapta göster) ── */}
          {isWrong && (
            <aside className="quiz__ai-panel" aria-live="polite">
              {!aiLoading && !aiResponse && (
                /* Henüz butona basılmadı — "Yapay Zekaya Sor" butonunu göster */
                <div className="quiz__ai-prompt">
                  <p className="quiz__ai-prompt-text">Bu soruyu açıklamasını mı istiyorsun?</p>
                  <button
                    type="button"
                    id="ask-ai-btn"
                    className="btn btn--ask-ai"
                    onClick={() => onAskAi(question.imagePath, question.correctOption)}
                    aria-label="Bu soruyu yapay zekaya sor"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Yapay Zekaya Sor
                  </button>
                </div>
              )}

              {aiLoading && (
                /* Yükleniyor animasyonu */
                <div className="quiz__ai-loading" aria-label="Yapay zeka yanıtı bekleniyor">
                  <div className="ai-spinner">
                    <div className="ai-spinner__dot" />
                    <div className="ai-spinner__dot" />
                    <div className="ai-spinner__dot" />
                  </div>
                  <p className="quiz__ai-loading-text">Yapay zeka analiz ediyor…</p>
                </div>
              )}

              {!aiLoading && aiResponse && (
                /* Yanıt geldi — göster */
                <div className="quiz__ai-response">
                  <div className="quiz__ai-response-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>Yapay Zeka Açıklaması</span>

                    {/* Tam Ekran Butonu */}
                    {!aiIsError && (
                      <button
                        type="button"
                        className="quiz__ai-fullscreen-btn"
                        onClick={openFullscreen}
                        aria-label="Tam ekranda göster"
                        title="Tam ekranda göster"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Kota uyarısı */}
                  {aiQuotaWarning && (
                    <div className="quiz__ai-quota-warning">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span>{aiQuotaWarning}</span>
                    </div>
                  )}

                  {/* Hata durumunda basit metin */}
                  {aiIsError ? (
                    <div className="quiz__ai-response-content quiz__ai-error">
                      <p>{aiExplanation}</p>
                    </div>
                  ) : (
                    <div className="quiz__ai-response-content">
                      {renderAiContent(aiExplanation)}
                    </div>
                  )}

                  <div className="quiz__ai-disclaimer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>Yapay zeka modeli olduğu için hata olabilir.</span>
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>

        {/* ── Sonraki buton ── */}
        <div className="quiz__footer">
          {isAnswered && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={onNext}
            >
              {isLast ? (
                <>
                  Bitir
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </>
              ) : (
                <>
                  Sonraki Soru
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>

      </section>

      {/* ── Tam Ekran Modal ── */}
      {isFullscreen && aiResponse && !aiIsError && (
        <div
          className="ai-fullscreen-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Yapay Zeka Açıklaması — Tam Ekran"
        >
          <div className="ai-fullscreen-modal__backdrop" onClick={closeFullscreen} />
          <div className="ai-fullscreen-modal__container">
            {/* Üst bar */}
            <div className="ai-fullscreen-modal__header">
              <h3 className="ai-fullscreen-modal__title">Yapay Zeka Açıklaması</h3>
              <div className="ai-fullscreen-modal__controls">
                {/* Zoom kontrolleri */}
                <button
                  type="button"
                  className="ai-fullscreen-modal__zoom-btn"
                  onClick={zoomOut}
                  aria-label="Küçült"
                  disabled={zoomLevel <= 60}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
                <span className="ai-fullscreen-modal__zoom-label">{zoomLevel}%</span>
                <button
                  type="button"
                  className="ai-fullscreen-modal__zoom-btn"
                  onClick={zoomIn}
                  aria-label="Büyüt"
                  disabled={zoomLevel >= 200}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>

                {/* Kapatma */}
                <button
                  type="button"
                  className="ai-fullscreen-modal__close"
                  onClick={closeFullscreen}
                  aria-label="Tam ekrandan çık"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* İçerik alanı — zoom'lu */}
            <div
              className="ai-fullscreen-modal__content"
              style={{
                fontSize: `${zoomLevel}%`,
                touchAction: 'pinch-zoom',
              }}
            >
              {aiQuotaWarning && (
                <div className="quiz__ai-quota-warning" style={{ marginBottom: '16px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>{aiQuotaWarning}</span>
                </div>
              )}
              {renderAiContent(aiExplanation)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default QuestionCard
