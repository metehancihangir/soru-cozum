import { useState, useEffect, useCallback } from 'react'
import { getQuestions, updateQuestion, deleteQuestion } from '../services/questionService'
import { removeQuestionStats } from '../services/statsService'
import { getQuotaStatus } from '../services/aiService'
import { login, logoutAdmin, getCurrentAdminUser } from '../services/authService'
import ChangePasswordModal from './ChangePasswordModal'
import PdfQuestionCropper from './PdfQuestionCropper'
import AdminManagement from './AdminManagement'
import './AdminPanel.css'

function AdminPanel({ onBack }) {
  // ── Giriş & Kullanıcı State'i ──
  const [currentUser, setCurrentUser] = useState(() => getCurrentAdminUser())
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // ── Tab State'i ──
  const [activeTab, setActiveTab] = useState('content') // 'content' | 'pdf-upload' | 'admin-users' | 'stats'

  // ── Sorular ──
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterCourse, setFilterCourse] = useState('')
  const [filterExamType, setFilterExamType] = useState('')
  const [filterYear, setFilterYear] = useState('')

  // ── Kota ──
  const [quota, setQuota] = useState(null)

  // ── Düzenleme ──
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  // ── Silme Onayı ──
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // ── Giriş İşlemi ──
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')

    if (!username || !password) {
      setLoginError('Kullanıcı adı ve şifre gereklidir.')
      return
    }

    try {
      const user = await login(username, password)
      setCurrentUser(user)
    } catch (err) {
      setLoginError(err.message)
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    setCurrentUser(null)
  }

  // ── Soruları Yükle ──
  const loadQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getQuestions(
        filterCourse || undefined,
        filterExamType || undefined,
        filterYear || undefined
      )
      setQuestions(data)
    } catch (err) {
      console.error('Sorular yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }, [filterCourse, filterExamType, filterYear])

  // ── Kota Bilgisi Yükle ──
  const loadQuota = useCallback(async () => {
    try {
      const data = await getQuotaStatus()
      setQuota(data)
    } catch (err) {
      console.error('Kota bilgisi alınamadı:', err)
    }
  }, [])

  useEffect(() => {
    if (currentUser && !currentUser.forcePasswordChange) {
      loadQuestions()
      loadQuota()
    }
  }, [currentUser, loadQuestions, loadQuota])

  useEffect(() => {
    if (activeTab === 'stats') {
      loadQuota()
      const interval = setInterval(loadQuota, 10000)
      return () => clearInterval(interval)
    }
  }, [activeTab, loadQuota])

  // ── Düzenleme ──
  const startEdit = (q) => {
    setEditingId(q.id)
    setEditForm({
      courseName: q.courseName || '',
      examType: q.examType || '',
      year: q.year || '',
      correctOption: q.correctOption || '',
      imagePath: q.imagePath || '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = async () => {
    try {
      await updateQuestion(editingId, { id: editingId, ...editForm })
      setEditingId(null)
      setEditForm({})
      await loadQuestions()
    } catch (err) {
      alert('Güncelleme hatası: ' + err.message)
    }
  }

  // ── Silme (Hard Delete) ──
  const confirmDelete = async () => {
    try {
      await deleteQuestion(deleteConfirmId, currentUser?.username)
      removeQuestionStats(deleteConfirmId)
      setDeleteConfirmId(null)
      await loadQuestions()
    } catch (err) {
      alert('Silme hatası: ' + err.message)
    }
  }

  // ── İstatistikler ──
  const courseGroups = questions.reduce((acc, q) => {
    const key = q.courseName || 'Bilinmeyen'
    if (!acc[key]) acc[key] = 0
    acc[key]++
    return acc
  }, {})

  const examTypeGroups = questions.reduce((acc, q) => {
    const key = q.examType || 'Bilinmeyen'
    if (!acc[key]) acc[key] = 0
    acc[key]++
    return acc
  }, {})

  const yearGroups = questions.reduce((acc, q) => {
    const key = q.year || 'Bilinmeyen'
    if (!acc[key]) acc[key] = 0
    acc[key]++
    return acc
  }, {})

  const uniqueCourses = [...new Set(questions.map(q => q.courseName).filter(Boolean))]
  const uniqueExamTypes = [...new Set(questions.map(q => q.examType).filter(Boolean))]
  const uniqueYears = [...new Set(questions.map(q => q.year).filter(Boolean))].sort()

  const quotaBarClass = !quota ? '' :
    quota.percentage >= 100 ? 'admin__quota-bar-fill--danger' :
    quota.percentage >= 80 ? 'admin__quota-bar-fill--warning' :
    'admin__quota-bar-fill--ok'

  // ────────────────────────────────────────────────────────
  // Giriş Ekranı
  // ────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="app-container">
        <div className="admin-login">
          <div className="admin-login__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="admin-login__title">Admin Girişi</h1>
          
          <form className="admin-login__form" onSubmit={handleLogin}>
            <div className="admin__edit-field">
              <input
                type="text"
                className="admin-login__input"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="admin__edit-field">
              <input
                type="password"
                className="admin-login__input"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {loginError && <p className="admin-login__error">{loginError}</p>}
            
            <button type="submit" className="btn btn--primary btn--full">
              Giriş Yap
            </button>
          </form>

          <button type="button" className="btn btn--ghost" onClick={onBack}>
            ← Geri Dön
          </button>
        </div>
      </div>
    )
  }

  // ────────────────────────────────────────────────────────
  // Zorunlu İlk Şifre Değiştirme Modal'ı
  // ────────────────────────────────────────────────────────
  if (currentUser.forcePasswordChange) {
    return (
      <div className="app-container">
        <ChangePasswordModal
          username={currentUser.username}
          onSuccess={() => {
            setCurrentUser({ ...currentUser, forcePasswordChange: false })
            sessionStorage.setItem('admin-user', JSON.stringify({ ...currentUser, forcePasswordChange: false }))
            loadQuestions()
            loadQuota()
          }}
        />
      </div>
    )
  }

  // ────────────────────────────────────────────────────────
  // Admin Paneli Ana Ekranı
  // ────────────────────────────────────────────────────────
  return (
    <div className="app-container" style={{ maxWidth: '960px' }}>
      <div className="admin">

        {/* ── Üst Bar ── */}
        <div className="admin__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="quiz__back" onClick={onBack}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              Geri
            </button>
            <div>
              <h1 className="admin__title">Admin Paneli</h1>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-mid)' }}>
                Giriş Yapan: <strong>{currentUser.username}</strong> ({currentUser.role})
              </span>
            </div>
          </div>
          <div className="admin__header-actions">
            <button type="button" className="btn btn--ghost" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* ── Sekmeler ── */}
        <div className="admin__tabs">
          <button
            type="button"
            className={`admin__tab ${activeTab === 'content' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            İçerik Yönetimi
          </button>
          <button
            type="button"
            className={`admin__tab ${activeTab === 'pdf-upload' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('pdf-upload')}
          >
            📄 PDF Soru Ekle (Kırp)
          </button>
          {currentUser.role === 'super_admin' && (
            <button
              type="button"
              className={`admin__tab ${activeTab === 'admin-users' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('admin-users')}
            >
              👥 Admin Yönetimi
            </button>
          )}
          <button
            type="button"
            className={`admin__tab ${activeTab === 'stats' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Kullanım İstatistikleri
          </button>
        </div>

        {/* ── İçerik Yönetimi Tabı ── */}
        {activeTab === 'content' && (
          <>
            <div className="admin__filters">
              <select
                className="admin__filter-select"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <option value="">Tüm Dersler</option>
                {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="admin__filter-select"
                value={filterExamType}
                onChange={(e) => setFilterExamType(e.target.value)}
              >
                <option value="">Tüm Sınav Türleri</option>
                {uniqueExamTypes.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <select
                className="admin__filter-select"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">Tüm Yıllar</option>
                {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={loadQuestions}
                style={{ minHeight: '40px', padding: '8px 16px', fontSize: 'var(--font-size-small)' }}
              >
                Yenile
              </button>
            </div>

            {loading ? (
              <p className="admin__empty">Yükleniyor…</p>
            ) : questions.length === 0 ? (
              <p className="admin__empty">Soru bulunamadı.</p>
            ) : (
              <div className="admin__table-container">
                <table className="admin__table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Görsel</th>
                      <th>Ders</th>
                      <th>Sınav Türü</th>
                      <th>Yıl</th>
                      <th>Doğru Cevap</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q) => (
                      editingId === q.id ? (
                        <tr key={q.id}>
                          <td>{q.id}</td>
                          <td>
                            <img
                              src={import.meta.env.DEV ? q.imagePath : `https://soru-cozum-production.up.railway.app${q.imagePath}`}
                              alt=""
                              className="admin__table-img"
                            />
                          </td>
                          <td>
                            <input
                              className="admin__edit-input"
                              value={editForm.courseName}
                              onChange={(e) => setEditForm(prev => ({ ...prev, courseName: e.target.value }))}
                              style={{ width: '100px' }}
                            />
                          </td>
                          <td>
                            <input
                              className="admin__edit-input"
                              value={editForm.examType}
                              onChange={(e) => setEditForm(prev => ({ ...prev, examType: e.target.value }))}
                              style={{ width: '100px' }}
                            />
                          </td>
                          <td>
                            <input
                              className="admin__edit-input"
                              value={editForm.year}
                              onChange={(e) => setEditForm(prev => ({ ...prev, year: e.target.value }))}
                              style={{ width: '80px' }}
                            />
                          </td>
                          <td>
                            <select
                              className="admin__edit-input"
                              value={editForm.correctOption}
                              onChange={(e) => setEditForm(prev => ({ ...prev, correctOption: e.target.value }))}
                              style={{ width: '60px' }}
                            >
                              {['A', 'B', 'C', 'D', 'E'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </td>
                          <td>
                            <div className="admin__table-actions">
                              <button className="admin__action-btn" onClick={saveEdit} title="Kaydet">
                                <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                              </button>
                              <button className="admin__action-btn" onClick={cancelEdit} title="İptal">
                                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={q.id}>
                          <td>{q.id}</td>
                          <td>
                            <img
                              src={import.meta.env.DEV ? q.imagePath : `https://soru-cozum-production.up.railway.app${q.imagePath}`}
                              alt=""
                              className="admin__table-img"
                            />
                          </td>
                          <td>{q.courseName}</td>
                          <td>{q.examType}</td>
                          <td>{q.year}</td>
                          <td><strong>{q.correctOption}</strong></td>
                          <td>
                            <div className="admin__table-actions">
                              <button className="admin__action-btn" onClick={() => startEdit(q)} title="Düzenle">
                                <svg viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                              </button>
                              <button className="admin__action-btn admin__action-btn--danger" onClick={() => setDeleteConfirmId(q.id)} title="Sil">
                                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-neutral-mid)' }}>
              Toplam {questions.length} soru gösteriliyor
            </p>
          </>
        )}

        {/* ── PDF ile Soru Ekle (Kırpma) Tabı ── */}
        {activeTab === 'pdf-upload' && (
          <PdfQuestionCropper
            currentUser={currentUser}
            onQuestionAdded={loadQuestions}
          />
        )}

        {/* ── Admin Yönetimi Tabı (super_admin) ── */}
        {activeTab === 'admin-users' && currentUser.role === 'super_admin' && (
          <AdminManagement currentUser={currentUser} />
        )}

        {/* ── Kullanım İstatistikleri Tabı ── */}
        {activeTab === 'stats' && (
          <>
            {quota && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-body)', fontWeight: 600, margin: 0, color: 'var(--color-neutral-dark)' }}>
                    API Kota Durumu
                  </h3>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    style={{ fontSize: '12px', padding: '4px 8px', minHeight: '28px' }}
                    onClick={loadQuota}
                  >
                    🔄 Yenile
                  </button>
                </div>

                {quota.isRateLimited && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', color: '#991b1b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🚨 <strong>DİKKAT:</strong> {quota.statusMessage || 'Google Gemini API kota/hız sınırına (HTTP 429) ulaşıldı.'}</span>
                  </div>
                )}

                <div className="admin__stats-grid">
                  <div className={`admin__stat-card ${quota.isNearLimit ? 'admin__stat-card--warning' : ''} ${quota.isOverLimit ? 'admin__stat-card--danger' : ''}`}>
                    <span className="admin__stat-val">{quota.dailyCount}</span>
                    <span className="admin__stat-label">Bugünkü İstek</span>
                    <div className="admin__quota-bar">
                      <div
                        className={`admin__quota-bar-fill ${quotaBarClass}`}
                        style={{ width: `${Math.min(quota.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="admin__stat-card">
                    <span className="admin__stat-val">{quota.remaining}</span>
                    <span className="admin__stat-label">Kalan Kota</span>
                  </div>
                  <div className="admin__stat-card">
                    <span className="admin__stat-val">{quota.dailyLimit}</span>
                    <span className="admin__stat-label">Günlük Limit</span>
                  </div>
                  <div className={`admin__stat-card ${quota.percentage >= 80 ? 'admin__stat-card--warning' : 'admin__stat-card--success'}`}>
                    <span className="admin__stat-val">{quota.percentage}%</span>
                    <span className="admin__stat-label">Kullanım Oranı</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-body)', fontWeight: 600, marginBottom: '12px', color: 'var(--color-neutral-dark)' }}>
                İçerik Dağılımı
              </h3>
              <div className="admin__stats-grid">
                <div className="admin__stat-card">
                  <span className="admin__stat-val">{questions.length}</span>
                  <span className="admin__stat-label">Toplam Soru</span>
                </div>
                {Object.entries(courseGroups).map(([course, count]) => (
                  <div className="admin__stat-card" key={course}>
                    <span className="admin__stat-val">{count}</span>
                    <span className="admin__stat-label">{course}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-body)', fontWeight: 600, marginBottom: '12px', color: 'var(--color-neutral-dark)' }}>
                Sınav Türlerine Göre
              </h3>
              <div className="admin__stats-grid">
                {Object.entries(examTypeGroups).map(([type, count]) => (
                  <div className="admin__stat-card" key={type}>
                    <span className="admin__stat-val">{count}</span>
                    <span className="admin__stat-label">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-body)', fontWeight: 600, marginBottom: '12px', color: 'var(--color-neutral-dark)' }}>
                Yıllara Göre
              </h3>
              <div className="admin__stats-grid">
                {Object.entries(yearGroups).map(([year, count]) => (
                  <div className="admin__stat-card" key={year}>
                    <span className="admin__stat-val">{count}</span>
                    <span className="admin__stat-label">{year}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn btn--ghost"
              onClick={loadQuota}
              style={{ alignSelf: 'flex-start' }}
            >
              İstatistikleri Yenile
            </button>
          </>
        )}

      </div>

      {/* Silme Onay Diyaloğu */}
      {deleteConfirmId && (
        <div className="admin__confirm-overlay">
          <div className="admin__confirm-dialog">
            <h3 className="admin__confirm-title">Soruyu Sil</h3>
            <p className="admin__confirm-text">
              Bu soruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="admin__confirm-actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setDeleteConfirmId(null)}
              >
                İptal
              </button>
              <button
                type="button"
                className="btn btn--primary"
                style={{ background: 'var(--color-error)' }}
                onClick={confirmDelete}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
