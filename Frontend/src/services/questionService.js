// G-13: Proxy sayesinde tam URL yazmaya gerek yok — Vite /api'yi 5248'e yönlendirir
const API_BASE = '/api/questions'

// G-14: Tüm soruları getir
export const getQuestions = async () => {
  try {
    const response = await fetch(API_BASE)
    if (!response.ok) throw new Error(`API hatası: ${response.status}`)
    return await response.json()
  } catch (err) {
    throw err
  }
}

// G-15: Tek soru getir
export const getQuestionById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`)
    if (!response.ok) throw new Error(`Soru bulunamadı: ${response.status}`)
    return await response.json()
  } catch (err) {
    throw err
  }
}

// G-16: Yeni soru oluştur
export const createQuestion = async (data) => {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`Oluşturma hatası: ${response.status}`)
    return await response.json()
  } catch (err) {
    throw err
  }
}

// G-17: Soruyu güncelle
export const updateQuestion = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`Güncelleme hatası: ${response.status}`)
  } catch (err) {
    throw err
  }
}

// G-18: Soruyu sil
export const deleteQuestion = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error(`Silme hatası: ${response.status}`)
  } catch (err) {
    throw err
  }
}
