import { useState } from 'react'
import './App.css'
import { getQuestions } from './services/questionService'
import QuestionCard from './components/QuestionCard'
import HomeScreen from './components/HomeScreen'

function App() {
  // ── Ekran yönetimi ────────────────────────────────────────
  // "home"     → Karşılama / kategori seçimi
  // "quiz"     → Soru çözüm ekranı
  // "complete" → Tamamlandı ekranı
  const [screen, setScreen] = useState('home')

  // ── Quiz state'leri ───────────────────────────────────────
  const [questions, setQuestions]       = useState([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered]     = useState(false)
  const [score, setScore]               = useState(0)

  // ── Kategori seçilince quiz'e geç ────────────────────────
  const handleSelectCategory = async (category) => {
    if (category !== 'arabic2') return

    setLoading(true)
    setError(null)
    setScreen('quiz')
    setQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)

    try {
      const data = await getQuestions()
      setQuestions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Ana menüye dön ────────────────────────────────────────
  const handleBackToHome = () => {
    setScreen('home')
    setQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setError(null)
  }

  // ── Şık seçildi ───────────────────────────────────────────
  const handleOptionClick = (option) => {
    const correct = questions[currentIndex].correctOption
    setSelectedOption(option)
    setIsAnswered(true)
    if (option === correct) setScore(prev => prev + 1)
  }

  // ── Sonraki soru ──────────────────────────────────────────
  const handleNextQuestion = () => {
    if (currentIndex >= questions.length - 1) {
      setScreen('complete')
      return
    }
    setCurrentIndex(prev => prev + 1)
    setSelectedOption(null)
    setIsAnswered(false)
  }

  // ── Render ────────────────────────────────────────────────

  // Karşılama ekranı
  if (screen === 'home') {
    return <HomeScreen onSelectCategory={handleSelectCategory} />
  }

  // Quiz — yükleniyor
  if (loading) {
    return (
      <div className="app-container">
        <p className="status-text">Sorular yükleniyor…</p>
      </div>
    )
  }

  // Quiz — hata
  if (error) {
    return (
      <div className="app-container">
        <p className="status-text error">Hata: {error}</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <button className="btn btn--ghost" onClick={handleBackToHome}>
            ← Ana Menüye Dön
          </button>
        </div>
      </div>
    )
  }

  // Tamamlandı ekranı
  if (screen === 'complete') {
    return (
      <div className="app-container">
        <div className="complete">
          <div className="complete__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="complete__title">Tamamladın!</h1>
          <p className="complete__score">
            {score} / {questions.length} doğru
          </p>
          <div className="complete__actions">
            <button
              type="button"
              className="btn btn--primary btn--full"
              onClick={handleBackToHome}
            >
              Ana Menüye Dön
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz ekranı
  const currentQuestion = questions[currentIndex]

  if (!currentQuestion) {
    return (
      <div className="app-container">
        <p className="status-text">✅ Tüm sorular tamamlandı!</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <button className="btn btn--ghost" onClick={handleBackToHome}>
            ← Ana Menüye Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <QuestionCard
        question={currentQuestion}
        currentIndex={currentIndex}
        questionsTotal={questions.length}
        selectedOption={selectedOption}
        isAnswered={isAnswered}
        onOptionClick={handleOptionClick}
        onNext={handleNextQuestion}
        onBack={handleBackToHome}
      />
    </div>
  )
}

export default App
