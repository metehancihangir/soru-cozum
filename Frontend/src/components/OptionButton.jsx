// G-18: Prop tanımları
function OptionButton({ option, text, isAnswered, selectedOption, correctOption, onClick }) {

  // G-19: Renk mantığı
  const getButtonClass = () => {
    if (!isAnswered) return 'option-btn'
    if (option === correctOption) return 'option-btn correct'   // Doğru şık → yeşil
    if (option === selectedOption) return 'option-btn wrong'    // Seçilen yanlış → kırmızı
    return 'option-btn'                                         // Diğerleri → değişmez
  }

  return (
    // G-20, G-21, G-22
    <button
      className={getButtonClass()}
      disabled={isAnswered}
      onClick={onClick}
    >
      {/* G-23: Şık harfi ve metin ayrı span'larda */}
      <span className="option-letter">{option}</span>
      <span className="option-text rtl">{text}</span>
    </button>
  )
}

export default OptionButton
