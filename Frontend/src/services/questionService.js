const API_BASE = '/api/questions'

/**
 * Soruları filtreli veya filtresiz getirir.
 * @param {string} [courseName] - Örn: "Arapça-2"
 * @param {string} [examType]   - Örn: "Yaz Okulu"
 * @param {number} [year]       - Örn: 2021
 */
export const getQuestions = async (courseName, examType, year) => {
  const params = new URLSearchParams()
  if (courseName) params.append('courseName', courseName)
  if (examType)   params.append('examType', examType)
  if (year)       params.append('year', year)

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE
  const response = await fetch(url)
  if (!response.ok) throw new Error(`API hatası: ${response.status}`)
  return await response.json()
}

export const getQuestionById = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`)
  if (!response.ok) throw new Error(`Soru bulunamadı: ${response.status}`)
  return await response.json()
}

export const createQuestion = async (data) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`Oluşturma hatası: ${response.status}`)
  return await response.json()
}

export const updateQuestion = async (id, data) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`Güncelleme hatası: ${response.status}`)
}

export const deleteQuestion = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error(`Silme hatası: ${response.status}`)
}
