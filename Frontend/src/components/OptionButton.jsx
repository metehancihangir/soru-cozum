import { getOptionButtonClass } from './questionCard.logic'

function OptionButton({ option, text, isAnswered, selectedOption, correctOption, onClick }) {
  return (
    <button
      className={getOptionButtonClass({ option, isAnswered, selectedOption, correctOption })}
      disabled={isAnswered}
      onClick={onClick}
    >
      <span className="option-content">
        <span className="option-letter">{option}</span>
        <span className="option-text">{text}</span>
      </span>
    </button>
  )
}

export default OptionButton
