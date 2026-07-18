import { OPTION_LETTERS, getOptionButtonClass } from './questionCard.logic'

function QuestionCard({
  question,
  currentIndex,
  questionsTotal,
  selectedOption,
  isAnswered,
  onOptionClick,
  onNext,
  onBack,
}) {
  const isLast = currentIndex >= questionsTotal - 1

  // Progress bar yüzdesi
  const progressPct = ((currentIndex + 1) / questionsTotal) * 100

  const hasFeedback = isAnswered && selectedOption !== question.correctOption && question.explanation

  return (
    <section className={`quiz ${hasFeedback ? 'quiz--has-feedback' : ''}`} aria-label="Soru çözümü">

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

      <div className="quiz__body">
        {/* ── Soru Resmi ── */}
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

        {/* ── Yanlış cevap için eğitici açıklama paneli ── */}
        {isAnswered && selectedOption !== question.correctOption && question.explanation && (
          <aside className="quiz__explanation-panel">
            <div className="quiz__explanation-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <h4>Neden Yanlış?</h4>
            </div>
            <div className="quiz__explanation-content">
              <p>{question.explanation}</p>
            </div>
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
