// Dev: relative path → Vite proxy → localhost backend
// Production build: tam Railway URL → Firebase'den doğrudan erişim
const AI_API_BASE = import.meta.env.DEV
  ? '/api/ai'
  : 'https://soru-cozum-production.up.railway.app/api/ai'

/**
 * Sorunun görsel yolunu ve doğru cevabını backend'e gönderir ve yapay zeka açıklamasını alır.
 * @param {string} imagePath - Soruya ait görselin yolu (örn: "/images/sorular/q1.jpg")
 * @param {string} correctOption - Sorunun doğru şıkkı (örn: "C")
 * @returns {Promise<{ explanation: string, quotaWarning: string|null, usedFallback: boolean }>}
 */
export const askAi = async (imagePath, correctOption) => {
  let response
  try {
    response = await fetch(`${AI_API_BASE}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath, correctOption }),
    })
  } catch (networkError) {
    throw new Error('İnternet bağlantınızı kontrol edin. Sunucuya ulaşılamadı.')
  }

  // Kota aşımı — kullanıcıya özel mesaj
  if (response.status === 429) {
    const data = await response.json().catch(() => ({}))
    throw new Error(
      data.error || 'Şu anda yoğunluk nedeniyle hizmet veremiyoruz. Lütfen daha sonra tekrar deneyin.'
    )
  }

  // Sunucu hatası
  if (response.status === 502) {
    throw new Error('Yapay zeka servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.')
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Yapay zeka API hatası: ${response.status}`)
  }

  const data = await response.json()
  return {
    explanation:  data.explanation,
    quotaWarning: data.quotaWarning || null,
    usedFallback: data.usedFallback || false,
  }
}

/**
 * Mevcut kota durumunu çeker (admin/monitoring amaçlı).
 * @returns {Promise<{ dailyCount: number, dailyLimit: number, remaining: number, percentage: number, isNearLimit: boolean }>}
 */
export const getQuotaStatus = async () => {
  const response = await fetch(`${AI_API_BASE}/quota`)
  if (!response.ok) throw new Error(`Kota bilgisi alınamadı: ${response.status}`)
  return await response.json()
}

/**
 * Deneysel AI: PDF sayfa görselini göndererek soru numarası ve bounding box koordinatlarını alır.
 * @param {string} imageBase64 - Base64 kodlanmış görsel verisi (data:image/png;base64,...)
 * @returns {Promise<Array<{ questionNumber: string, box: Array<number> }>>}
 */
export const detectQuestionBoxes = async (imageBase64) => {
  const response = await fetch(`${AI_API_BASE}/detect-boxes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType: 'image/png' }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Kutu tespit hatası: ${response.status}`)
  }

  const data = await response.json()
  return data.boxes || []
}
