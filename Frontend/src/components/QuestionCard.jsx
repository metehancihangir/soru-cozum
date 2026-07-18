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

  return (
    <section className="quiz" aria-label="Soru çözümü">

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
