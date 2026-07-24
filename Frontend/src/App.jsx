import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'
import { getQuestions } from './services/questionService'
import { askAi } from './services/aiService'
import { getDailySolvedCount, getWeeklySolvedCount, recordQuestionSolved, recordWrongAnswer, getDetailedErrors, getPerformanceStats, recordCorrectAnswer, hasVisitedDashboard, markDashboardVisited } from './services/statsService'
import QuestionCard from './components/QuestionCard'
import HomeScreen from './components/HomeScreen'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'

import { getQuestionCatalog } from './services/questionService'
import { getYears } from './services/yearsService'

// Ders kataloğu — ilerde genişletilebilir
const COURSES = {
  'Arapça-2': {
    examTypes: ['Dönem Sonu', 'Yaz Okulu'],
  },
  'Arapça-4': {
    examTypes: ['Dönem Sonu', 'Yaz Okulu'],
  },
}

function App() {
  // ── Navigasyon akışı: dashboard <-> home → examType → year → quiz → complete
  const [screen, setScreen] = useState('dashboard')

  // ── Dinamik Katalog (Veritabanında gerçekten soru olan ders/sınavTürü/yıl kombinasyonları) ──
  const [catalog, setCatalog] = useState({})

  useEffect(() => {
    getQuestionCatalog()
      .then(data => setCatalog(data))
      .catch(err => console.error('Katalog çekilemedi:', err))
  }, [screen])

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

  // ── Yapay Zeka state'leri
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)

  // ── Dashboard istatistik state'leri
  const [solvedToday, setSolvedToday] = useState(() => getDailySolvedCount())
  const [solvedWeekly, setSolvedWeekly] = useState(() => getWeeklySolvedCount())
  const [detailedErrors, setDetailedErrors] = useState(() => getDetailedErrors())
  const [performanceStats, setPerformanceStats] = useState(() => getPerformanceStats())
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => hasVisitedDashboard())

  // Quiz sırasında biriken yanlış cevapları takip et
  const wrongAnswersRef = useRef([])

  // İstatistikleri LocalStorage'dan yeniden oku
  const refreshStats = useCallback(() => {
    setSolvedToday(getDailySolvedCount())
    setSolvedWeekly(getWeeklySolvedCount())
    setDetailedErrors(getDetailedErrors())
    setPerformanceStats(getPerformanceStats())
  }, [])

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

  // ── Dashboard'dan Soruyu Tekrar Çözmek İçin ──
  const handleJumpToQuestion = async (qInfo) => {
    setSelectedCourse(qInfo.courseName)
    setSelectedExamType(qInfo.examType)
    setSelectedYear(qInfo.year)
    
    setLoading(true)
    setError(null)
    setScreen('quiz')
    setQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    wrongAnswersRef.current = []

    try {
      const data = await getQuestions(qInfo.courseName, qInfo.examType, qInfo.year)
      setQuestions(data)
      
      // Soru id'si veya imagePath üzerinden eşleştir
      const targetIndex = data.findIndex(q => (q.id && q.id === qInfo.id) || (q.imagePath && q.imagePath === qInfo.imagePath))
      if (targetIndex !== -1) {
        setCurrentIndex(targetIndex)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
    wrongAnswersRef.current = []

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
    setAiLoading(false)
    setAiResponse(null)
    refreshStats()
  }

  // ── Dashboard'a git
  const handleOpenDashboard = () => {
    setScreen('dashboard')
  }

  // ── Admin paneline git
  const handleOpenAdmin = () => {
    setScreen('admin')
  }

  // ── ExamType seçimine geri dön
  const handleBackToExamType = () => {
    setScreen('examType')
    setSelectedExamType(null)
    setSelectedYear(null)
    setAiLoading(false)
    setAiResponse(null)
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
    setAiLoading(false)
    setAiResponse(null)
  }

  // ── Şık seçildi
  const handleOptionClick = (option) => {
    const currentQ = questions[currentIndex]
    const correct = currentQ.correctOption
    
    setSelectedOption(option)
    setIsAnswered(true)
    
    // Soruyu eşsiz olarak çözüldü olarak işaretle
    recordQuestionSolved(currentQ.id)

    if (option === correct) {
      setScore(prev => prev + 1)
      recordCorrectAnswer(currentQ.id)
    } else {
      // Yanlış cevabı kaydet — quiz bittiğinde toplu işlenecek
      wrongAnswersRef.current.push({
        courseName: selectedCourse,
        topic: currentQ.topic,
      })
      // NOT: Anında da kaydedilebilir, ancak performans ve akış için quiz sonunda veya çıkışta işliyoruz.
      // Eğer kullanıcı testi bitirmeden çıkarsa diye, aslında çıkış yaparken veya anında da yazılabilir.
      // Kullanıcı talebine göre testten çıkıldığında da işlensin dediği için anında kaydediyoruz:
      recordWrongAnswer(currentQ)
    }
    
    // Her ihtimale karşı yeni şık seçildiğinde eski AI yanıtını sıfırla
    setAiLoading(false)
    setAiResponse(null)
  }

  // ── Sonraki soru
  const handleNextQuestion = () => {
    if (currentIndex >= questions.length - 1) {
      // Quiz bitti — istatistikleri yenile (yanlışlar zaten anında yazıldı)
      wrongAnswersRef.current = []
      refreshStats()

      setScreen('complete')
      return
    }
    setCurrentIndex(prev => prev + 1)
    setSelectedOption(null)
    setIsAnswered(false)
    // Yeni soruya geçilince AI yanıtını sıfırla
    setAiLoading(false)
    setAiResponse(null)
  }

  // ── Yapay Zekaya Sor
  const handleAskAi = async (imagePath, correctOption) => {
    setAiLoading(true)
    setAiResponse(null)
    try {
      const result = await askAi(imagePath, correctOption)
      // result = { explanation, quotaWarning, usedFallback }
      setAiResponse(result)
    } catch (err) {
      setAiResponse({ explanation: err.message, quotaWarning: null, usedFallback: false, isError: true })
    } finally {
      setAiLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  // Admin paneli
  if (screen === 'admin') {
    return (
      <AdminPanel onBack={handleBackToHome} />
    )
  }

  // Dashboard ekranı
  if (screen === 'dashboard') {
    return (
      <Dashboard
        solvedToday={solvedToday}
        solvedWeekly={solvedWeekly}
        detailedErrors={detailedErrors}
        performanceStats={performanceStats}
        isFirstVisit={!hasSeenWelcome}
        onComplete={() => {
          markDashboardVisited()
          setHasSeenWelcome(true)
          setScreen('home')
        }}
        onQuestionClick={handleJumpToQuestion}
      />
    )
  }

  // Ana menü
  if (screen === 'home') {
    return (
      <HomeScreen
        onSelectCourse={handleSelectCourse}
        onOpenDashboard={handleOpenDashboard}
        onOpenAdmin={handleOpenAdmin}
      />
    )
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
              const years = catalog?.[selectedCourse]?.[et] ?? []
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

  // Yıl seçimi — sadece veritabanında GERÇEKTEN soru olan yıllar gösterilir
  if (screen === 'year') {
    const years = catalog?.[selectedCourse]?.[selectedExamType] ?? []
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
            {years.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', color: 'var(--color-neutral-mid)' }}>
                Bu kategoriye ait henüz eklenmiş soru bulunmamaktadır.
              </p>
            ) : (
              years.map((year) => (
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
              ))
            )}
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
        onAskAi={handleAskAi}
        aiLoading={aiLoading}
        aiResponse={aiResponse}
      />
    </div>
  )
}

export default App
