const AUTH_API_BASE = import.meta.env.DEV
  ? '/api/auth'
  : 'https://soru-cozum-production.up.railway.app/api/auth'

export const login = async (username, password) => {
  const response = await fetch(`${AUTH_API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Giriş başarısız oldu.')
  }

  const data = await response.json()
  sessionStorage.setItem('admin-auth', 'true')
  sessionStorage.setItem('admin-user', JSON.stringify(data))
  return data
}

export const changePassword = async (username, oldPassword, newPassword) => {
  const response = await fetch(`${AUTH_API_BASE}/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, oldPassword, newPassword }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Şifre değiştirme başarısız oldu.')
  }

  const userStr = sessionStorage.getItem('admin-user')
  if (userStr) {
    const user = JSON.parse(userStr)
    user.forcePasswordChange = false
    sessionStorage.setItem('admin-user', JSON.stringify(user))
  }

  return await response.json()
}

export const getAdmins = async () => {
  const response = await fetch(`${AUTH_API_BASE}/admins`)
  if (!response.ok) throw new Error('Admin listesi alınamadı.')
  return await response.json()
}

export const createAdmin = async (username, password, role, creatorUsername) => {
  const response = await fetch(`${AUTH_API_BASE}/admins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role, creatorUsername }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Admin eklenemedi.')
  }

  return await response.json()
}

export const deleteAdmin = async (id, requesterUsername) => {
  const url = requesterUsername
    ? `${AUTH_API_BASE}/admins/${id}?requesterUsername=${encodeURIComponent(requesterUsername)}`
    : `${AUTH_API_BASE}/admins/${id}`

  const response = await fetch(url, { method: 'DELETE' })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Admin silinemedi.')
  }
}

export const getCurrentAdminUser = () => {
  try {
    const userStr = sessionStorage.getItem('admin-user')
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

export const logoutAdmin = () => {
  sessionStorage.removeItem('admin-auth')
  sessionStorage.removeItem('admin-user')
}
