/**
 * Yeni model: resim tabanlı sorular için şık mantığı.
 * Sorular artık metin içermiyor; şıklar daima A-E sabit.
 */
export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

export const getOptionButtonClass = ({
  option,
  isAnswered,
  selectedOption,
  correctOption,
}) => {
  if (!isAnswered) return 'option'
  if (option === correctOption) return 'option is-correct'
  if (option === selectedOption) return 'option is-wrong'
  return 'option'
}

export const getNextButtonText = (currentIndex, questionsTotal) =>
  currentIndex < questionsTotal - 1 ? 'Sonraki Soru' : 'Testi Bitir'
