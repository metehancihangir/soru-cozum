import { getVisibleOptions } from './questionCard.logic'

function QuestionCard({
  question,
  currentIndex,
  questionsTotal,
  selectedOption,
  isAnswered,
  isCorrect,
  onOptionClick,
  onNext,
  onBack,
}) {
  const KEYS = ['A', 'B', 'C', 'D', 'E']
  const options = getVisibleOptions(question)
  const isLast  = currentIndex >= questionsTotal - 1

  // Progress bar yüzdesi
  const progressPct = (currentIndex / questionsTotal) * 100

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

      {/* ── Soru + Şıklar ── */}
      <div className="quiz__question">
        <h1
          className="quiz__prompt"
          lang="ar"
          dir="rtl"
        >
          {question.questionText}
        </h1>

        <div
          className="quiz__options"
          role="group"
          aria-label="Cevap şıkları"
        >
          {options.map(({ option, text }, i) => {
            let stateClass = ''
            if (isAnswered) {
              if (option === question.correctOption) stateClass = ' is-correct'
              else if (option === selectedOption)    stateClass = ' is-wrong'
            }

            return (
              <button
                key={option}
                type="button"
                className={`option${stateClass}`}
                disabled={isAnswered}
                onClick={() => onOptionClick(option)}
                aria-pressed={selectedOption === option}
              >
                <span className="option__key" aria-hidden="true">
                  {KEYS[i]}
                </span>
                <span className="option__label">{text}</span>
              </button>
            )
          })}
        </div>
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
