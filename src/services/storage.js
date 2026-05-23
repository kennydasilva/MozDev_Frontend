const STORAGE_KEY = 'redealerta_publicacoes'

function safeStorage(fn, fallback) {
  try { return fn() }
  catch {
    console.warn('Storage operation failed')
    return fallback
  }
}

export function getLocalPublications() {
  return safeStorage(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }, [])
}

export function savePublication(data) {
  return safeStorage(() => {
    const list = getLocalPublications()
    const publication = {
      ...data,
      id: Date.now(),
      date: new Date().toISOString(),
      status: data.status || 'desaparecido',
      urgency: 'alta',
      comments: [],
      tips: [],
      local: true,
    }
    list.unshift(publication)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return publication
  }, null)
}

export function updatePublication(id, updates) {
  return safeStorage(() => {
    const list = getLocalPublications()
    const idx = list.findIndex((p) => p.id === id)
    if (idx === -1) return null
    list[idx] = { ...list[idx], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return list[idx]
  }, null)
}

export function deletePublication(id) {
  safeStorage(() => {
    const list = getLocalPublications().filter((p) => p.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  })
}

export function getLocalPublicationById(id) {
  return safeStorage(() => {
    return getLocalPublications().find((p) => p.id === id) || null
  }, null)
}

export function getAllMerged(mockAlerts) {
  return safeStorage(() => {
    const local = getLocalPublications()
    const mockIds = new Set(mockAlerts.map((a) => a.id))
    const filteredLocal = local.filter((l) => !mockIds.has(l.id))
    return [...mockAlerts, ...filteredLocal]
  }, mockAlerts)
}

export function getMergedById(id, mockAlerts) {
  const mock = mockAlerts.find((a) => a.id === id)
  if (mock) return mock
  return getLocalPublicationById(id)
}

export function clearAllPublications() {
  safeStorage(() => {
    localStorage.removeItem(STORAGE_KEY)
  })
}

export function isStorageAvailable() {
  try {
    localStorage.setItem('__test__', '1')
    localStorage.removeItem('__test__')
    return true
  } catch {
    return false
  }
}
