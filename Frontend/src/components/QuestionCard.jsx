import { OPTION_LETTERS } from './questionCard.logic'

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

  return (
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
              src={question.imagePath}
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
                  onClick={() => onAskAi(question.imagePath)}
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
                </div>
                <div className="quiz__ai-response-content">
                  <p>{aiResponse}</p>
                </div>
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
  )
}

export default QuestionCard
