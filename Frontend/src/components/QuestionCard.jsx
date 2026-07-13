import OptionButton from './OptionButton'

// G-10: Prop tanımları
function QuestionCard({
  question,
  currentIndex,
  questionsTotal,
  selectedOption,
  isAnswered,
  isCorrect,
  onOptionClick,
  onNext,
}) {
  return (
    <div className="question-card">

      {/* G-17: Soru sayacı */}
      <p className="question-counter">
        Soru {currentIndex + 1} / {questionsTotal}
      </p>

      {/* G-11: RTL soru metni */}
      <div className="question-text rtl">
        {question.questionText}
      </div>

      {/* G-12, G-13, G-14: Şıkları map ile render et; boş şıkları atla */}
      <div className="options-list">
        {['A', 'B', 'C', 'D', 'E'].map((letter) =>
          question[`option${letter}`] ? (
            <OptionButton
              key={letter}
              option={letter}
              text={question[`option${letter}`]}
              isAnswered={isAnswered}
              selectedOption={selectedOption}
              correctOption={question.correctOption}
              onClick={() => onOptionClick(letter)}
            />
          ) : null
        )}
      </div>

      {/* G-15: Açıklama — sadece yanlış cevapta göster */}
      {isAnswered && !isCorrect && (
        <div className="explanation rtl">
          <strong>✅ Doğru Cevap: {question.correctOption}</strong>
          {question.explanation && <p>{question.explanation}</p>}
        </div>
      )}

      {/* G-16: Navigasyon butonu — cevap verildikten sonra görünür */}
      {isAnswered && (
        <button className="next-btn" onClick={onNext}>
          {currentIndex < questionsTotal - 1 ? 'Sonraki Soru →' : 'Testi Bitir 🎉'}
        </button>
      )}

    </div>
  )
}

export default QuestionCard
