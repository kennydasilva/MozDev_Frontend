import { useState, useMemo, useRef, useCallback } from 'react'
import AlertCard from '../components/AlertCard'
import BottomNav from '../components/BottomNav'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'
import { SkeletonCard } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import { feedAlerts } from '../data/feedMockData'
import { getLocalPublications } from '../services/storage'

const tabs = [
  { key: 'todos', label: 'Todos' },
  { key: 'desaparecidos', label: 'Desaparecidos' },
  { key: 'encontrados', label: 'Encontrados' },
]

function Feed() {
  const { setCurrentScreen, setMenuOpen, user } = useApp()
  const [activeTab, setActiveTab] = useState('todos')
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const touchStart = useRef(null)
  const [key, setKey] = useState(0)

  const filteredAlerts = useMemo(() => {
    const local = getLocalPublications()
    const mockIds = new Set(feedAlerts.map((a) => a.id))
    const merged = [...feedAlerts, ...local.filter((l) => !mockIds.has(l.id))]

    let list = [...merged]

    switch (activeTab) {
      case 'desaparecidos':
        list = list.filter((a) => a.status === 'desaparecido')
        break
      case 'encontrados':
        list = list.filter((a) => a.status === 'encontrado')
        break
    }

    list.sort((a, b) => new Date(b.date) - new Date(a.date))
    return list
  }, [activeTab, key])

  function handleAlertClick(alert) {
    setCurrentScreen(`detail-${alert.id}`)
  }

  function handleComment(alert) {
    setCurrentScreen(`comments-${alert.id}`)
  }

  function handleShare(alert) {
    const url = `${window.location.origin}/alerta/${alert.id}`
    if (navigator.share) {
      navigator.share({ title: alert.name, text: 'Veja os detalhes do alerta', url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url).catch(() => {})
    }
  }

  function handleAvatar() {
    setCurrentScreen(user ? 'profile' : 'login')
  }

  const handleRefresh = useCallback(() => {
    if (refreshing) return
    setRefreshing(true)
    setTimeout(() => {
      setKey((k) => k + 1)
      setRefreshing(false)
    }, 800)
  }, [refreshing])

  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (touchStart.current === null) return
    const dist = e.touches[0].clientY - touchStart.current
    if (dist > 100 && !refreshing) {
      handleRefresh()
    }
  }, [handleRefresh, refreshing])

  const handleTouchEnd = useCallback(() => {
    touchStart.current = null
  }, [])

  return (
    <div
      className="min-h-screen bg-surface-50 pb-24"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-surface-100">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-100 active:bg-surface-200 transition-colors -ml-1.5"
              aria-label="Abrir menu"
            >
              <Icon name="menu" size={20} />
            </button>
            <h1 className="text-lg font-bold text-surface-900">
              Alertas Recentes
            </h1>
          </div>
          <button
            onClick={handleAvatar}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-100 active:bg-surface-200 transition-colors"
            aria-label="Abrir perfil"
          >
            <Avatar name={user?.name || 'Utilizador'} src={user?.avatar} size="sm" />
          </button>
        </div>

        {refreshing && (
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-2 text-primary-500">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeDasharray="31.4 31.4" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-medium">Actualizando...</span>
            </div>
          </div>
        )}

        <div className="px-5 pb-3">
          <div className="grid grid-cols-3 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary-500 text-white shadow-soft-md'
                    : 'bg-white text-surface-500 shadow-soft border border-surface-100 hover:bg-surface-50'
                }`}
                aria-pressed={activeTab === tab.key}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {filteredAlerts.length === 0 ? (
        <div className="min-h-[60vh] flex items-center justify-center px-5">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="alert" size={24} className="text-surface-400" />
            </div>
            <p className="text-sm font-semibold text-surface-500">Nenhum alerta encontrado</p>
          </div>
        </div>
      ) : (
        <div className="screen-padding pt-3 pb-28 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onClick={() => handleAlertClick(alert)}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))
          )}
        </div>
      )}

      <button
        onClick={() => setCurrentScreen('create')}
        className="fixed bottom-24 right-5 w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-soft-lg hover:bg-primary-600 active:scale-95 transition-all duration-200 z-40"
        aria-label="Publicar alerta"
      >
        <Icon name="plus" size={22} />
      </button>

      <BottomNav
        variant="classic"
        active="inicio"
        onNavigate={(key) => {
          const map = { inicio: 'feed', pesquisar: 'search', publicar: 'create', notificacoes: 'notifications', perfil: 'profile' }
          setCurrentScreen(map[key] || key)
        }}
      />
    </div>
  )
}

export default Feed
