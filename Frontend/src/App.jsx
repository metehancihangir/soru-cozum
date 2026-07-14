import { useState, useEffect } from 'react'
import './App.css'
import { getQuestions } from './services/questionService'
import QuestionCard from './components/QuestionCard'

function App() {
  // FAZ 3'ten gelen state'ler
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // G-4: FAZ 4 state makinesi
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions()
        setQuestions(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // G-5: Türetilmiş değişken
  const currentQuestion = questions[currentIndex]

  // G-6: Şık tıklandığında
  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsAnswered(true)
    setIsCorrect(option === currentQuestion.correctOption)
  }

  // G-7: Sonraki soruya geç — tüm state'leri sıfırla
  const handleNextQuestion = () => {
    setCurrentIndex(prev => prev + 1)
    setSelectedOption(null)
    setIsAnswered(false)
    setIsCorrect(false)
  }

  if (loading) return <p className="status-text">Yükleniyor...</p>
  if (error) return <p className="status-text error">Hata: {error}</p>

  // G-8: Guard clause — sorular boş veya index aşıldıysa
  if (!currentQuestion) {
    return <p className="status-text">✅ Tüm sorular tamamlandı!</p>
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
