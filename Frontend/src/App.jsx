import { useState } from 'react'
import './App.css'
import { getQuestions } from './services/questionService'
import QuestionCard from './components/QuestionCard'
import HomeScreen from './components/HomeScreen'

function App() {
  // ── Ekran Yönetimi ───────────────────────────────────────
  // "home"  → Karşılama ekranı (varsayılan)
  // "quiz"  → Soru çözüm ekranı
  const [screen, setScreen] = useState('home')

  // ── Quiz State'leri (FAZ 3-4'ten gelenler) ───────────────
  const [questions, setQuestions] = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  // G-4: FAZ 4 state makinesi
  const [currentIndex, setCurrentIndex]   = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered]         = useState(false)
  const [isCorrect, setIsCorrect]           = useState(false)

  // ── Kategori Seçimi: Home → Quiz ─────────────────────────
  const handleSelectCategory = async (category) => {
    // Şimdilik yalnızca 'arabic2' aktif; diğer kategoriler HomeScreen tarafında bloke edilir
    if (category !== 'arabic2') return

    setLoading(true)
    setError(null)
    setScreen('quiz')

    // Quiz state'ini sıfırla (önceki oturumun kalıntısı olmasın)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setIsCorrect(false)

    try {
      const data = await getQuestions()
      setQuestions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Ana Menüye Dön ────────────────────────────────────────
  const handleBackToHome = () => {
    setScreen('home')
    setQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setIsCorrect(false)
    setError(null)
  }

  // ── G-5: Türetilmiş değişken ──────────────────────────────
  const currentQuestion = questions[currentIndex]

  // ── G-6: Şık tıklandığında ───────────────────────────────
  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsAnswered(true)
    setIsCorrect(option === currentQuestion.correctOption)
  }

  // ── G-7: Sonraki soruya geç — tüm state'leri sıfırla ─────
  const handleNextQuestion = () => {
    setCurrentIndex(prev => prev + 1)
    setSelectedOption(null)
    setIsAnswered(false)
    setIsCorrect(false)
  }

  // ── Ekran Render Mantığı ──────────────────────────────────

  // Karşılama ekranı
  if (screen === 'home') {
    return <HomeScreen onSelectCategory={handleSelectCategory} />
  }

  // Quiz ekranı — yükleniyor
  if (loading) {
    return (
      <main className="app-container">
        <h1 className="app-title">ArapçaSoru</h1>
        <p className="status-text">Sorular yükleniyor...</p>
      </main>
    )
  }

  // Quiz ekranı — hata
  if (error) {
    return (
      <main className="app-container">
        <h1 className="app-title">ArapçaSoru</h1>
        <p className="status-text error">Hata: {error}</p>
        <button className="next-btn" style={{ margin: '1rem auto', display: 'block' }} onClick={handleBackToHome}>
          ← Ana Menüye Dön
        </button>
      </main>
    )
  }

  // G-8: Guard clause — sorular boş veya index aşıldıysa
  if (!currentQuestion) {
    return (
      <main className="app-container">
        <h1 className="app-title">ArapçaSoru</h1>
        <p className="status-text">✅ Tüm sorular tamamlandı!</p>
        <button className="next-btn" style={{ margin: '1.5rem auto', display: 'block' }} onClick={handleBackToHome}>
          ← Ana Menüye Dön
        </button>
      </main>
    )
  }

  // G-9: QuestionCard render et
  return (
    <main className="app-container">
      <h1 className="app-title">ArapçaSoru</h1>
      <QuestionCard
        question={currentQuestion}
        currentIndex={currentIndex}
        questionsTotal={questions.length}
        selectedOption={selectedOption}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        onOptionClick={handleOptionClick}
        onNext={handleNextQuestion}
      />
    </main>
  )
}

export default App
