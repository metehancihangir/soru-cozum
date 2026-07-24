// Dev: relative path → Vite proxy → localhost backend
// Production build: tam Railway URL → Firebase'den doğrudan erişim
const API_BASE = import.meta.env.DEV
  ? '/api/questions'
  : 'https://soru-cozum-production.up.railway.app/api/questions'

/**
 * Soruları filtreli veya filtresiz getirir.
 * @param {string} [courseName] - Örn: "Arapça-2"
 * @param {string} [examType]   - Örn: "Yaz Okulu"
 * @param {number} [year]       - Örn: 2021
 */
import topicMapping from '../data/topicMapping.json'

export const getQuestions = async (courseName, examType, year) => {
  const params = new URLSearchParams()
  if (courseName) params.append('courseName', courseName)
  if (examType)   params.append('examType', examType)
  if (year)       params.append('year', year)

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE
  const response = await fetch(url)
  if (!response.ok) throw new Error(`API hatası: ${response.status}`)
  
  const data = await response.json()
  
  // Frontend'de konuları mocklamak (Backend'de Topic alanı olmadığı için)
  return data.map(q => {
    if (!q.topic) {
      // Haritadan resim yoluna göre (örn: "/images/arapca-2/yaz_okulu/2021/q1.png") konuyu bul
      const mappedTopic = topicMapping[q.imagePath];
      q.topic = mappedTopic || "Genel Tekrar";
    }
    return q;
  })
}

export const getQuestionCatalog = async () => {
  const response = await fetch(`${API_BASE}/catalog`)
  if (!response.ok) throw new Error(`Katalog alınamadı: ${response.status}`)
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

export const deleteQuestion = async (id, requesterUsername) => {
  const url = requesterUsername
    ? `${API_BASE}/${id}?requesterUsername=${encodeURIComponent(requesterUsername)}`
    : `${API_BASE}/${id}`

  const response = await fetch(url, { method: 'DELETE' })
  if (!response.ok) throw new Error(`Silme hatası: ${response.status}`)
}

export const uploadCroppedQuestion = async ({ imageBase64, courseName, examType, year, correctOption, explanation, adminUsername }) => {
  const response = await fetch(`${API_BASE}/upload-cropped`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64,
      courseName,
      examType,
      year,
      correctOption,
      explanation,
      adminUsername,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Soru yükleme hatası: ${response.status}`)
  }

  return await response.json()
}
