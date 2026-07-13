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
      {/* G-10, G-11: option-content sarıcısı — RTL'de harf sağda, metin solda */}
      <span className="option-content">
        {/* G-12: Şık harfi LTR (direction: ltr CSS ile ayarlı) */}
        <span className="option-letter">{option}</span>
        {/* G-13: Şık metni RTL */}
        <span className="option-text">{text}</span>
      </span>
    </button>
  )
}

export default OptionButton
