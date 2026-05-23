const STORAGE_KEY = 'redealerta_publicacoes'

export function getLocalPublications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePublication(data) {
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
}

export function updatePublication(id, updates) {
  const list = getLocalPublications()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return list[idx]
}

export function deletePublication(id) {
  const list = getLocalPublications().filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getLocalPublicationById(id) {
  return getLocalPublications().find((p) => p.id === id) || null
}

export function getAllMerged(mockAlerts) {
  const local = getLocalPublications()
  const mockIds = new Set(mockAlerts.map((a) => a.id))
  const filteredLocal = local.filter((l) => !mockIds.has(l.id))
  return [...mockAlerts, ...filteredLocal]
}

export function getMergedById(id, mockAlerts) {
  const mock = mockAlerts.find((a) => a.id === id)
  if (mock) return mock
  return getLocalPublicationById(id)
}

export function clearAllPublications() {
  localStorage.removeItem(STORAGE_KEY)
}
