// ═══════════════════════════════════════════════════════════
// Soru Çözüm — İstatistik Servisi (LocalStorage)
// TODO: Backend API hazır olduğunda fetch('/api/stats/...') ile değiştir
// ═══════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  daily: 'soru-cozum:daily-stats',
  weekly: 'soru-cozum:weekly-stats',
  errors: 'soru-cozum:topic-errors',
  performance: 'soru-cozum:performance',
}

// ── Yardımcı: bugünün tarihini YYYY-MM-DD formatında döner
const today = () => new Date().toISOString().slice(0, 10)

// ── Yardımcı: bu haftanın pazartesi gününün tarihini döner
const getWeekStart = () => {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Pazartesi'ye ayarla
  return new Date(d.setDate(diff)).toISOString().slice(0, 10)
}

// ── Yardımcı: güvenli JSON parse
const safeGet = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// ───────────────────────────────────────────────────────────
// GÜNLÜK İSTATİSTİK
// ───────────────────────────────────────────────────────────

/**
 * Bugün çözülen toplam soru sayısını döner.
 * Gün değişmişse otomatik sıfırlar.
 * @returns {{ date: string, solvedQuestions: Array<number|string>, solvedCount?: number }}
 */
export const getDailyStats = () => {
  // TODO: Backend API hazır olduğunda → GET /api/stats/daily
  const stats = safeGet(STORAGE_KEYS.daily, { date: today(), solvedQuestions: [] })

  // Gün değişmişse sıfırla
  if (stats.date !== today()) {
    const reset = { date: today(), solvedQuestions: [] }
    localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(reset))
    return reset
  }

  // Geriye dönük uyumluluk: eski yapıda solvedCount varsa solvedQuestions array'ine çevir (boş dizi olarak başlar)
  if (!stats.solvedQuestions) {
    stats.solvedQuestions = []
  }

  return stats
}

/**
 * Bugün çözülen eşsiz soru sayısını döner.
 */
export const getDailySolvedCount = () => {
  const stats = getDailyStats()
  return stats.solvedQuestions.length > 0 ? stats.solvedQuestions.length : (stats.solvedCount || 0)
}

/**
 * Bu hafta çözülen istatistikleri döner.
 */
export const getWeeklyStats = () => {
  const stats = safeGet(STORAGE_KEYS.weekly, { weekStart: getWeekStart(), solvedQuestions: [] })

  // Hafta değişmişse sıfırla
  if (stats.weekStart !== getWeekStart()) {
    const reset = { weekStart: getWeekStart(), solvedQuestions: [] }
    localStorage.setItem(STORAGE_KEYS.weekly, JSON.stringify(reset))
    return reset
  }

  if (!stats.solvedQuestions) stats.solvedQuestions = []
  return stats
}

/**
 * Bu hafta çözülen eşsiz soru sayısını döner.
 */
export const getWeeklySolvedCount = () => {
  const stats = getWeeklyStats()
  return stats.solvedQuestions.length > 0 ? stats.solvedQuestions.length : (stats.solvedCount || 0)
}

/**
 * Çözülen soruyu eşsiz olarak (ID bazında) hem günlüğe hem haftalığa kaydeder.
 * @param {number|string} questionId - Sorunun benzersiz kimliği
 */
export const recordQuestionSolved = (questionId) => {
  if (!questionId) return
  
  // Günlük Kayıt
  const dailyStats = getDailyStats()
  if (!dailyStats.solvedQuestions.includes(questionId)) {
    dailyStats.solvedQuestions.push(questionId)
    localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(dailyStats))
  }
  
  // Haftalık Kayıt
  const weeklyStats = getWeeklyStats()
  if (!weeklyStats.solvedQuestions.includes(questionId)) {
    weeklyStats.solvedQuestions.push(questionId)
    localStorage.setItem(STORAGE_KEYS.weekly, JSON.stringify(weeklyStats))
  }
}

// ───────────────────────────────────────────────────────────
// YANLIŞ CEVAP TAKİBİ
// ───────────────────────────────────────────────────────────

/**
 * Yanlış cevap kaydeder (Eşsiz - Aynı soru tekrar gelirse üstüne yazar, sayıyı şişirmez).
 * @param {Object} question - Soru objesi (id, courseName, topic, year, examType, imagePath vb.)
 */
export const recordWrongAnswer = (question) => {
  if (!question) return
  // TODO: Backend API hazır olduğunda → POST /api/stats/errors { questionId }
  const errors = safeGet(STORAGE_KEYS.errors, {})
  
  // Eşsiz anahtar: ID yoksa imagePath kullan (ikisi de eşsizdir)
  const key = question.id ? `q_${question.id}` : question.imagePath
  
  // Soru numarasını imagePath'ten çıkar (örn: q1.png -> Soru 1)
  let qNum = "Soru"
  if (question.imagePath) {
    const match = question.imagePath.match(/q(\d+)\.png$/)
    if (match) qNum = `Soru ${match[1]}`
  }

  // Sorunun detaylarını kaydet
  errors[key] = {
    id: question.id,
    courseName: question.courseName,
    examType: question.examType,
    year: question.year,
    topic: question.topic || 'Bilinmeyen Konu',
    questionNum: qNum,
    imagePath: question.imagePath
  }

  localStorage.setItem(STORAGE_KEYS.errors, JSON.stringify(errors))
  
  // All-time performance güncelle
  const perf = safeGet(STORAGE_KEYS.performance, { correct: 0, incorrect: 0 })
  // Eğer bu soru önceden yanlış kaydedilmemişse incorrect sayısını artır
  // (errors dictionary'si unique olduğu için Object.keys(errors).length de kullanılabilir,
  // ancak manuel olarak tutmak daha esnektir. Burada errors.length'i senkronize edelim)
  perf.incorrect = Object.keys(errors).length
  localStorage.setItem(STORAGE_KEYS.performance, JSON.stringify(perf))
}

/**
 * Doğru cevap kaydeder (All-time performans için).
 */
export const recordCorrectAnswer = (questionId) => {
  if (!questionId) return
  const perf = safeGet(STORAGE_KEYS.performance, { correct: 0, incorrect: 0, correctQuestions: [] })
  
  if (!perf.correctQuestions) perf.correctQuestions = []
  
  // Sadece eşsiz doğru cevapları say
  if (!perf.correctQuestions.includes(questionId)) {
    perf.correctQuestions.push(questionId)
    perf.correct = perf.correctQuestions.length
    localStorage.setItem(STORAGE_KEYS.performance, JSON.stringify(perf))
  }
}

/**
 * Performans yüzdesi ve sayıları döner.
 */
export const getPerformanceStats = () => {
  const perf = safeGet(STORAGE_KEYS.performance, { correct: 0, incorrect: 0 })
  const total = perf.correct + perf.incorrect
  let percentage = 0
  if (total > 0) {
    percentage = Math.round((perf.correct / total) * 100)
  }
  
  return {
    correct: perf.correct,
    incorrect: perf.incorrect,
    total: total,
    percentage: percentage
  }
}

/**
 * Performans analiz ekranı için detaylı hata verilerini döner.
 * @returns {{ totalCount: number, questions: Array, topicStats: Array }}
 */
export const getDetailedErrors = () => {
  const errors = safeGet(STORAGE_KEYS.errors, {})
  const questionsList = Object.values(errors)
  
  const totalCount = questionsList.length
  
  // Konulara göre grupla ve say
  const topicMap = {}
  questionsList.forEach(q => {
    const t = q.topic
    if (!topicMap[t]) {
      topicMap[t] = { topic: t, courseName: q.courseName, count: 0 }
    }
    topicMap[t].count += 1
  })
  
  const topicStats = Object.values(topicMap)
    .sort((a, b) => b.count - a.count)

  return {
    totalCount,
    questions: questionsList.reverse(), // En son yapılan yanlışlar en üstte
    topicStats
  }
}

/**
 * Geriye dönük uyumluluk için (App.jsx eski sürümleri vs.)
 * @param {number} limit 
 */
export const getTopicErrors = (limit = 5) => {
  return getDetailedErrors().topicStats.slice(0, limit)
}

/**
 * Tüm istatistikleri sıfırlar.
 */
export const clearAllStats = () => {
  localStorage.removeItem(STORAGE_KEYS.daily)
  localStorage.removeItem(STORAGE_KEYS.weekly)
  localStorage.removeItem(STORAGE_KEYS.errors)
  localStorage.removeItem(STORAGE_KEYS.performance)
  localStorage.removeItem('soru-cozum:has-visited')
}

/**
 * Belirli bir soruya ait tüm istatistikleri siler (Cascade Delete).
 */
export const removeQuestionStats = (questionId) => {
  if (!questionId) return

  // Günlükten sil
  const dailyStats = safeGet(STORAGE_KEYS.daily, { date: today(), solvedQuestions: [] })
  if (dailyStats.solvedQuestions?.includes(questionId)) {
    dailyStats.solvedQuestions = dailyStats.solvedQuestions.filter(id => id !== questionId)
    localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(dailyStats))
  }

  // Haftalıktan sil
  const weeklyStats = safeGet(STORAGE_KEYS.weekly, { weekStart: getWeekStart(), solvedQuestions: [] })
  if (weeklyStats.solvedQuestions?.includes(questionId)) {
    weeklyStats.solvedQuestions = weeklyStats.solvedQuestions.filter(id => id !== questionId)
    localStorage.setItem(STORAGE_KEYS.weekly, JSON.stringify(weeklyStats))
  }

  // Yanlışlardan sil
  const errors = safeGet(STORAGE_KEYS.errors, {})
  const errorKey = `q_${questionId}`
  let wasIncorrect = false
  if (errors[errorKey]) {
    delete errors[errorKey]
    localStorage.setItem(STORAGE_KEYS.errors, JSON.stringify(errors))
    wasIncorrect = true
  }

  // Doğrulardan ve All-Time Performanstan sil
  const perf = safeGet(STORAGE_KEYS.performance, { correct: 0, incorrect: 0, correctQuestions: [] })
  let perfChanged = false
  if (perf.correctQuestions?.includes(questionId)) {
    perf.correctQuestions = perf.correctQuestions.filter(id => id !== questionId)
    perf.correct = perf.correctQuestions.length
    perfChanged = true
  }
  if (wasIncorrect) {
    perf.incorrect = Object.keys(errors).length
    perfChanged = true
  }
  if (perfChanged) {
    localStorage.setItem(STORAGE_KEYS.performance, JSON.stringify(perf))
  }
}

/**
 * Kullanıcının dashboard'u daha önce ziyaret edip etmediğini döner.
 */
export const hasVisitedDashboard = () => {
  return safeGet('soru-cozum:has-visited', false)
}

/**
 * Kullanıcının dashboard'u ziyaret ettiğini kaydeder.
 */
export const markDashboardVisited = () => {
  localStorage.setItem('soru-cozum:has-visited', JSON.stringify(true))
}
