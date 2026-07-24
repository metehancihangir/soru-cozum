import { useState } from 'react'
import './Dashboard.css'

/**
 * Karşılama Panosu — 4 Aşamalı Akış
 *
 * @param {{ solvedToday: number, solvedWeekly: number, detailedErrors: { totalCount: number, questions: Array, topicStats: Array }, performanceStats: { correct: number, incorrect: number, percentage: number, total: number }, isFirstVisit: boolean, onComplete: function, onQuestionClick: function }} props
 */
function Dashboard({ solvedToday = 0, solvedWeekly = 0, detailedErrors = { totalCount: 0, questions: [], topicStats: [] }, performanceStats = { correct: 0, incorrect: 0, percentage: 0, total: 0 }, isFirstVisit = true, onComplete, onQuestionClick }) {
  const [scene, setScene] = useState(isFirstVisit ? 0 : 1) // 0: Welcome, 1: Daily, 2: Weekly, 3: Errors
  const [expandedYear, setExpandedYear] = useState(null)

  const toggleYear = (year) => {
    setExpandedYear(prev => prev === year ? null : year)
  }

  // Gruplandırma işlemi
  const questionsByYear = detailedErrors.questions.reduce((acc, q) => {
    if (!acc[q.year]) acc[q.year] = []
    acc[q.year].push(q)
    return acc
  }, {})


  // Günün tarihi örneği: 21 Temmuz Cuma
  const todayDate = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  }).format(new Date())

  return (
    <div className="dashboard" aria-label="Karşılama panosu">
      <div className="dashboard__container">
        
        {scene === 0 && (
          // ── Sahne 0: Açılış (Welcome Screen) ──
          <div className="dashboard__scene dashboard__scene-fade">
            <h1 className="dashboard__hero-title">Hoş Geldiniz</h1>
            <h2 className="dashboard__hero-subtitle">Soru Çözüm Uygulamasına</h2>
            <p className="dashboard__hero-text">
              Arapça dil becerilerini geliştirmek için doğru yerdesin. 
              Günlük ilerlemeni ve performansını takip et, eksiklerini tamamla.
            </p>
          </div>
        )}

        {scene === 1 && (
          // ── Sahne 1: Günlük İstatistik ──
          <div className="dashboard__scene dashboard__scene-fade">
            <h2 className="dashboard__hero-subtitle">Bugünün Özeti</h2>
            <p className="dashboard__hero-date">{todayDate}</p>
            
            {isFirstVisit && solvedToday === 0 ? (
              <p className="dashboard__empty-info">
                Bu alanda bugün çözdüğün soru sayısını ve performansını takip edebilirsin.
              </p>
            ) : (
              <div className="dashboard__stat-big">
                <span className="dashboard__stat-big-val">{solvedToday}</span>
                <span className="dashboard__stat-big-label">Soru Çözüldü</span>
              </div>
            )}
          </div>
        )}

        {scene === 2 && (
          // ── Sahne 2: Haftalık İstatistik ──
          <div className="dashboard__scene dashboard__scene-fade">
            <h2 className="dashboard__hero-subtitle">Haftanın Özeti</h2>
            <p className="dashboard__hero-date">Bu Hafta Toplam</p>
            
            {isFirstVisit && solvedWeekly === 0 ? (
              <p className="dashboard__empty-info">
                Bu alanda bu hafta boyunca çözdüğün soruların genel bir dökümünü görebilirsin.
              </p>
            ) : (
              <div className="dashboard__stat-big">
                <span className="dashboard__stat-big-val" style={{ color: 'var(--color-blue-accent)' }}>{solvedWeekly}</span>
                <span className="dashboard__stat-big-label">Soru Çözüldü</span>
              </div>
            )}
          </div>
        )}

        {scene === 3 && (
          // ── Sahne 3: Performans Analizi (Yanlışlar) ──
          <div className="dashboard__scene dashboard__scene-fade dashboard__scene-wide">
            <div className="dashboard__header-row">
              <h2 className="dashboard__hero-subtitle">Performans Analizi</h2>
              <div className="dashboard__performance-badge">
                <span className="dashboard__performance-badge-val">{performanceStats.percentage}%</span>
                <span className="dashboard__performance-badge-label">Başarı</span>
              </div>
            </div>
            
            <div className="dashboard__errors-container">
              {detailedErrors.totalCount > 0 ? (
                <div className="dashboard__errors-split">
                  
                  {/* Sol Taraf: Toplam Yanlış ve Soru Listesi */}
                  <div className="dashboard__errors-left">
                    <div className="dashboard__errors-total">
                      <span className="dashboard__errors-total-val">{detailedErrors.totalCount}</span>
                      <span className="dashboard__errors-total-label">Toplam Yanlış</span>
                    </div>
                    <ul className="dashboard__questions-list dashboard__accordion">
                      {Object.keys(questionsByYear).map((year, i) => {
                        const isOpen = expandedYear === year;
                        return (
                          <li className="dashboard__accordion-item" key={year + i}>
                            <button 
                              className={`dashboard__accordion-header ${isOpen ? 'is-open' : ''}`}
                              onClick={() => toggleYear(year)}
                            >
                              <span>{year} Yılı Yanlışları</span>
                              <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard__accordion-icon">
                                <path d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            <div className={`dashboard__accordion-content ${isOpen ? 'is-open' : ''}`}>
                              <ul className="dashboard__accordion-inner-list">
                                {questionsByYear[year].map((q, j) => (
                                  <li key={q.id || j} style={{ animationDelay: `${j * 0.05}s` }} className="dashboard__question-item-wrapper">
                                    <button 
                                      className="dashboard__question-item" 
                                      onClick={() => onQuestionClick && onQuestionClick(q)}
                                      aria-label={`${q.courseName} ${q.questionNum} sorusuna git`}
                                    >
                                      <span className="dashboard__question-name">
                                        {q.courseName} · {q.questionNum} · {q.examType}
                                      </span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  
                  {/* Sağ Taraf: Konu Dağılımı ve Renklendirme */}
                  <div className="dashboard__errors-right">
                    <div className="dashboard__section-title-wrapper">
                      <h3 className="dashboard__section-title">Yanlış Yaptığın Konular</h3>
                    </div>
                    <ul className="dashboard__errors-list">
                      {detailedErrors.topicStats.map((item, i) => {
                        let colorClass = 'color-green'
                        if (item.count > 5) colorClass = 'color-darkred'
                        else if (item.count > 1) colorClass = 'color-yellow'

                        return (
                          <li className="dashboard__error-item" key={item.topic + i}>
                            <span className="dashboard__error-topic" title={`${item.courseName} · ${item.topic}`}>
                              {item.courseName} · {item.topic}
                            </span>
                            <span className={`dashboard__error-count ${colorClass}`}>{item.count}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="dashboard__empty">
                  {isFirstVisit && performanceStats.total === 0 ? (
                    <p className="dashboard__empty-info" style={{ marginTop: '32px' }}>
                      Bu alanda yanlış yaptığın konuları ve genel başarı oranını inceleyerek eksiklerini belirleyebilirsin.
                    </p>
                  ) : (
                    <>
                      <span aria-hidden="true" style={{ fontSize: '42px', display: 'block', marginBottom: '16px' }}>🎯</span>
                      Henüz yanlış cevap yok.<br/>Harika gidiyorsun!
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      
      {/* Sabit İleri Butonu */}
      <div className="dashboard__fixed-action">
        <button 
          type="button" 
          className="dashboard__nav-btn"
          onClick={() => {
            if (scene === 0) setScene(1)
            else if (scene === 1) setScene(2)
            else if (scene === 2) setScene(3)
            else if (scene === 3) onComplete()
          }}
          aria-label={scene === 3 ? "Ana Sayfaya Geç" : "İleri"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Dashboard
