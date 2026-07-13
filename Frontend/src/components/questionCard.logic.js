export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

export const getOptionButtonClass = ({
  option,
  isAnswered,
  selectedOption,
  correctOption,
}) => {
  if (!isAnswered) return 'option-btn'
  if (option === correctOption) return 'option-btn correct'
  if (option === selectedOption) return 'option-btn wrong'
  return 'option-btn'
}

export const getVisibleOptions = (question) =>
  OPTION_LETTERS
    .map((letter) => ({
      option: letter,
      text: question?.[`option${letter}`],
    }))
    .filter(({ text }) => Boolean(text))

export const getNextButtonText = (currentIndex, questionsTotal) =>
  currentIndex < questionsTotal - 1 ? 'Sonraki Soru →' : 'Testi Bitir 🎉'
