import OptionButton from './OptionButton'
import { getNextButtonText, getVisibleOptions } from './questionCard.logic'

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
      <p className="question-counter">
        Soru {currentIndex + 1} / {questionsTotal}
      </p>

      <div className="question-text rtl">
        {question.questionText}
      </div>

      <div className="options-list">
        {getVisibleOptions(question).map(({ option, text }) => (
          <OptionButton
            key={option}
            option={option}
            text={text}
            isAnswered={isAnswered}
            selectedOption={selectedOption}
            correctOption={question.correctOption}
            onClick={() => onOptionClick(option)}
          />
        ))}
      </div>

      {isAnswered && !isCorrect && (
        <div className="explanation rtl">
          <strong>❌ Yanlış! Doğru Cevap: {question.correctOption}</strong>
          {question.explanation && <p>{question.explanation}</p>}
        </div>
      )}

      {isAnswered && (
        <button className="next-btn" onClick={onNext}>
          {getNextButtonText(currentIndex, questionsTotal)}
        </button>
      )}
    </div>
  )
}

export default QuestionCard
