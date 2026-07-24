import { useState } from 'react'
import { changePassword } from '../services/authService'

function ChangePasswordModal({ username, onSuccess }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!newPassword || newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler birbiriyle eşleşmiyor.')
      return
    }

    setLoading(true)
    try {
      await changePassword(username, oldPassword, newPassword)
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin__confirm-overlay">
      <div className="admin__confirm-dialog" style={{ maxWidth: '420px' }}>
        <h3 className="admin__confirm-title" style={{ fontSize: '1.25rem' }}>
          🔒 Zorunlu Şifre Değişikliği
        </h3>
        <p className="admin__confirm-text" style={{ fontSize: '0.9rem' }}>
          Güvenliğiniz için ilk girişte veya şifreniz sıfırlandığında yeni bir şifre belirlemeniz gerekmektedir.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="admin__edit-field">
            <label className="admin__edit-label">Mevcut / Geçici Şifre</label>
            <input
              type="password"
              className="admin__edit-input"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Mevcut şifre"
            />
          </div>

          <div className="admin__edit-field">
            <label className="admin__edit-label">Yeni Şifre (Min. 6 Karakter)</label>
            <input
              type="password"
              className="admin__edit-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yeni şifrenizi girin"
              required
            />
          </div>

          <div className="admin__edit-field">
            <label className="admin__edit-label">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              className="admin__edit-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Yeni şifrenizi tekrar girin"
              required
            />
          </div>

          {error && <p className="admin-login__error" style={{ textAlign: 'left' }}>{error}</p>}

          <div style={{ marginTop: '8px' }}>
            <button
              type="submit"
              className="btn btn--primary btn--full"
              disabled={loading}
            >
              {loading ? 'Güncelleniyor…' : 'Şifreyi Güncelle ve Devam Et'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
