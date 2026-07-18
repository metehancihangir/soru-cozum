import { useState } from 'react'
import './App.css'
import { getQuestions } from './services/questionService'
import QuestionCard from './components/QuestionCard'
import HomeScreen from './components/HomeScreen'

// Ders kataloğu — ilerde genişletilebilir
const COURSES = {
  'Arapça-2': {
    examTypes: ['Dönem Sonu', 'Yaz Okulu'],
    // Her exam type için mevcut yıllar (gerçek veri API'den gelecek; şimdi sabit)
    years: {
      'Dönem Sonu': ['2022', '2023-2024', '2024-2025', '2026'],
      'Yaz Okulu': ['2021', '2022', '2023', '2024', '2025'],
    },
  },
  'Arapça-4': {
    examTypes: ['Dönem Sonu', 'Yaz Okulu'],
    years: {
      'Dönem Sonu': ['2022', '2023-2024', '2024-2025', '2026'],
      'Yaz Okulu': ['2021', '2022', '2023', '2024', '2025'],
    },
  },
}

function App() {
  // ── Navigasyon akışı: home → examType → year → quiz → complete
  const [screen, setScreen] = useState('home')

  // ── Seçim state'leri
  const [selectedCourse, setSelectedCourse] = useState(null)   // "Arapça-2"
  const [selectedExamType, setSelectedExamType] = useState(null)   // "Yaz Okulu"
  const [selectedYear, setSelectedYear] = useState(null)   // 2021

  // ── Quiz state'leri
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)

  // ── Ders seçildi → ExamType ekranına geç
  const handleSelectCourse = (courseName) => {
    setSelectedCourse(courseName)
    setScreen('examType')
  }

  // ── Sınav türü seçildi → Year ekranına geç
  const handleSelectExamType = (examType) => {
    setSelectedExamType(examType)
    setScreen('year')
  }

  // ── Yıl seçildi → soruları yükle ve quiz'e geç
  const handleSelectYear = async (year) => {
    setSelectedYear(year)
    setLoading(true)
    setError(null)
    setScreen('quiz')
    setQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)

    try {
      const data = await getQuestions(selectedCourse, selectedExamType, year)
      setQuestions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Ana menüye tamamen dön
  const handleBackToHome = () => {
    setScreen('home')
    setSelectedCourse(null)
    setSelectedExamType(null)
    setSelectedYear(null)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setError(null)
  }

  // ── ExamType seçimine geri dön
  const handleBackToExamType = () => {
    setScreen('examType')
    setSelectedExamType(null)
    setSelectedYear(null)
  }

  // ── Year seçimine geri dön
  const handleBackToYear = () => {
    setScreen('year')
    setSelectedYear(null)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setError(null)
  }

  // ── Şık seçildi
  const handleOptionClick = (option) => {
    const correct = questions[currentIndex].correctOption
    setSelectedOption(option)
    setIsAnswered(true)
    if (option === correct) setScore(prev => prev + 1)
  }

  // ── Sonraki soru
  const handleNextQuestion = () => {
    if (currentIndex >= questions.length - 1) {
      setScreen('complete')
      return
    }
    setCurrentIndex(prev => prev + 1)
    setSelectedOption(null)
    setIsAnswered(false)
  }

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  // Ana menü
  if (screen === 'home') {
    return <HomeScreen onSelectCourse={handleSelectCourse} />
  }

  // Sınav türü seçimi
  if (screen === 'examType') {
    const examTypes = COURSES[selectedCourse]?.examTypes ?? []
    return (
      <div className="app-container">
        <div className="nav-screen">
          <div className="nav-screen__header">
            <button className="quiz__back" onClick={handleBackToHome}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              Geri
            </button>
            <div className="nav-screen__breadcrumb">
              <span className="nav-screen__course">{selectedCourse}</span>
            </div>
          </div>
          <h2 className="nav-screen__title">Sınav Türü Seç</h2>
          <div className="nav-screen__grid">
            {examTypes.map((et) => {
              const years = COURSES[selectedCourse]?.years?.[et] ?? []
              const locked = years.length === 0
              return (
                <button
                  key={et}
                  type="button"
                  className={`nav-card ${locked ? 'nav-card--locked' : ''}`}
                  onClick={() => !locked && handleSelectExamType(et)}
                  aria-disabled={locked}
                >
                  <span className="nav-card__icon" aria-hidden="true">
                    {et === 'Yaz Okulu' ? '☀️' : '📚'}
                  </span>
                  <span className="nav-card__label">{et}</span>
                  {locked
                    ? <span className="badge">Yakında</span>
                    : <span className="nav-card__meta">{years.length} dönem</span>
                  }
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Yıl seçimi
  if (screen === 'year') {
    const years = COURSES[selectedCourse]?.years?.[selectedExamType] ?? []
    return (
      <div className="app-container">
        <div className="nav-screen">
          <div className="nav-screen__header">
            <button className="quiz__back" onClick={handleBackToExamType}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              Geri
            </button>
            <div className="nav-screen__breadcrumb">
              <span className="nav-screen__course">{selectedCourse}</span>
              <span className="nav-screen__sep">›</span>
              <span>{selectedExamType}</span>
            </div>
          </div>
          <h2 className="nav-screen__title">Yıl Seç</h2>
          <div className="nav-screen__grid">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                className="nav-card"
                onClick={() => handleSelectYear(year)}
              >
                <span className="nav-card__icon" aria-hidden="true">📅</span>
                <span className="nav-card__label">{year}</span>
                <span className="nav-card__meta">Sınav soruları</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
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
          <p className="complete__detail">
            {selectedCourse} · {selectedExamType} · {selectedYear}
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
        onBack={handleBackToYear}
      />
    </div>
  )
}

export default App
