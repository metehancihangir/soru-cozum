import { useState, useEffect } from 'react'
import './App.css'
import { getQuestions } from './services/questionService'

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getQuestions()
      .then(data => {
        setQuestions(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Yükleniyor...</p>
  if (error) return <p>Hata: {error}</p>

  return (
    <>
      <h1>ArapçaSoru</h1>
      <p>{questions.length} soru bulundu</p>
    </>
  )
}

export default App
