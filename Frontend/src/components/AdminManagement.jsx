import { useState, useEffect, useCallback } from 'react'
import { getAdmins, createAdmin, deleteAdmin } from '../services/authService'

function AdminManagement({ currentUser }) {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)

  // Yeni admin ekleme formu
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Silme onay modalı
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const loadAdminsList = useCallback(async () => {
    setLoading(true)
    try {
      const list = await getAdmins()
      setAdmins(list)
    } catch (err) {
      console.error('Admin listesi çekilemedi:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAdminsList()
  }, [loadAdminsList])

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!username || !password) {
      setError('Kullanıcı adı ve şifre gereklidir.')
      return
    }

    try {
      await createAdmin(username, password, role, currentUser?.username)
      setSuccessMsg(`'${username}' adlı yeni admin başarıyla eklendi!`)
      setUsername('')
      setPassword('')
      setRole('admin')
      await loadAdminsList()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteAdmin = async () => {
    if (!deleteConfirmId) return
    try {
      await deleteAdmin(deleteConfirmId, currentUser?.username)
      setDeleteConfirmId(null)
      await loadAdminsList()
    } catch (err) {
      alert('Silme hatası: ' + err.message)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Yeni Admin Ekle Kartı */}
      <div className="admin__stat-card" style={{ gap: '16px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-neutral-dark)' }}>
          ➕ Yeni Admin Ekle
        </h3>
        
        <form onSubmit={handleAddAdmin} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'end' }}>
          <div className="admin__edit-field">
            <label className="admin__edit-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="admin__edit-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="örn: ahmet"
              required
            />
          </div>

          <div className="admin__edit-field">
            <label className="admin__edit-label">Geçici Şifre</label>
            <input
              type="password"
              className="admin__edit-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Girişte değiştirecek"
              required
            />
          </div>

          <div className="admin__edit-field">
            <label className="admin__edit-label">Yetki Rolü</label>
            <select
              className="admin__edit-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin (İçerik Yönetimi)</option>
              <option value="super_admin">Super Admin (Tam Yetki)</option>
            </select>
          </div>

          <div>
            <button type="submit" className="btn btn--primary" style={{ width: '100%', minHeight: '40px' }}>
              Ekle
            </button>
          </div>
        </form>

        {error && <p className="admin-login__error" style={{ textAlign: 'left', margin: 0 }}>{error}</p>}
        {successMsg && <p style={{ color: 'var(--color-accent)', fontSize: '13px', margin: 0 }}>{successMsg}</p>}
      </div>

      {/* Admin Kullanıcı Listesi */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-neutral-dark)', marginBottom: '12px' }}>
          👥 Mevcut Admin Yöneticileri
        </h3>

        {loading ? (
          <p className="admin__empty">Yükleniyor…</p>
        ) : (
          <div className="admin__table-container">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kullanıcı Adı</th>
                  <th>Rol</th>
                  <th>İlk Şifre Değişimi</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((adm, index) => (
                  <tr key={adm.id}>
                    <td>{index + 1}</td>
                    <td><strong>{adm.username}</strong></td>
                    <td>
                      <span className={`badge ${adm.role === 'super_admin' ? 'badge--primary' : ''}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', background: adm.role === 'super_admin' ? 'var(--color-blue-accent-bg)' : 'var(--color-surface)', color: adm.role === 'super_admin' ? 'var(--color-blue-accent)' : 'inherit' }}>
                        {adm.role}
                      </span>
                    </td>
                    <td>
                      {adm.forcePasswordChange ? (
                        <span style={{ color: '#ea580c', fontSize: '12px', fontWeight: 500 }}>⚠️ Bekliyor</span>
                      ) : (
                        <span style={{ color: 'var(--color-accent)', fontSize: '12px' }}>✓ Değiştirildi</span>
                      )}
                    </td>
                    <td>
                      {adm.username.toLowerCase() !== 'admin' && (
                        <button
                          type="button"
                          className="admin__action-btn admin__action-btn--danger"
                          onClick={() => setDeleteConfirmId(adm.id)}
                          title="Admin Sil"
                        >
                          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Silme Onay Modal */}
      {deleteConfirmId && (
        <div className="admin__confirm-overlay">
          <div className="admin__confirm-dialog">
            <h3 className="admin__confirm-title">Admin Kullanıcısını Sil</h3>
            <p className="admin__confirm-text">
              Bu admin kullanıcısını silmek istediğinize emin misiniz?
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
                onClick={handleDeleteAdmin}
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

export default AdminManagement
