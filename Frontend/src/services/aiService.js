const AI_API_BASE = '/api/ai'

/**
 * Sorunun görsel yolunu backend'e gönderir ve yapay zeka açıklamasını alır.
 * @param {string} imagePath - Soruya ait görselin yolu (örn: "/images/sorular/q1.jpg")
 * @returns {Promise<string>} - Yapay zekanın ürettiği açıklama metni
 */
export const askAi = async (imagePath) => {
  const response = await fetch(`${AI_API_BASE}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imagePath }),
  })

  if (!response.ok) {
    throw new Error(`Yapay zeka API hatası: ${response.status}`)
  }

  const data = await response.json()
  return data.explanation
}
