const YEARS_API_BASE = import.meta.env.DEV
  ? '/api/years'
  : 'https://soru-cozum-production.up.railway.app/api/years'

export const getYears = async () => {
  const response = await fetch(YEARS_API_BASE)
  if (!response.ok) throw new Error('Yıl listesi alınamadı.')
  return await response.json()
}

export const createYear = async (year) => {
  const response = await fetch(YEARS_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ year }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Yıl eklenemedi.')
  }

  return await response.json()
}
