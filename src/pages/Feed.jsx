import { useState, useMemo } from 'react'
import AlertCard from '../components/AlertCard'
import BottomNav from '../components/BottomNav'
import Icon from '../components/Icon'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import { feedAlerts as allAlerts } from '../data/feedMockData'

const tabs = [
  { key: 'todos', label: 'Todos' },
  { key: 'desaparecidos', label: 'Desaparecidos' },
  { key: 'encontrados', label: 'Encontrados' },
]

function Feed() {
  const { setCurrentScreen } = useApp()
  const [activeTab, setActiveTab] = useState('todos')

  const filteredAlerts = useMemo(() => {
    let list = [...allAlerts]

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
  }, [activeTab])

  function handleAlertClick(alert) {
    setCurrentScreen(`detail-${alert.id}`)
  }

  function handleComment(alert) {
    setCurrentScreen(`detail-${alert.id}?focus=comments`)
  }

  function handleShare(alert) {
    const url = `${window.location.origin}/alerta/${alert.id}`
    if (navigator.share) {
      navigator.share({ title: alert.name, text: 'Veja os detalhes do alerta', url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url).catch(() => {})
    }
  }

  function handleSearch() {
    setCurrentScreen('search')
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-surface-100">
        <div className="px-5 pt-7 pb-4 flex items-end justify-between gap-4">
          <h1 className="text-[28px] leading-tight font-extrabold text-surface-900">
            Alertas Recentes
          </h1>
          <div className="flex items-center gap-2 pb-0.5 shrink-0">
            <button
              onClick={handleSearch}
              className="flex items-center justify-center w-10 h-10 rounded-2xl hover:bg-surface-100 active:bg-surface-200 transition-colors"
              aria-label="Pesquisar"
            >
              <Icon name="search" size={22} />
            </button>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-2xl hover:bg-surface-100 active:bg-surface-200 transition-colors"
              aria-label="Filtrar"
            >
              <Icon name="filter" size={22} />
            </button>
          </div>
        </div>

        <div className="px-5 pb-4">
          <div className="grid grid-cols-3 gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary-500 text-white shadow-soft-md'
                    : 'bg-white text-surface-600 shadow-soft border border-surface-100 hover:bg-surface-50'
                }`}
                aria-pressed={activeTab === tab.key}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="screen-padding pt-4 pb-28 space-y-4">
        {filteredAlerts.length === 0 ? (
          <EmptyState
            icon="alert"
            title="Nenhum alerta encontrado"
            description="Nenhum alerta corresponde ao filtro seleccionado."
          />
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

      <button
        onClick={() => setCurrentScreen('create')}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-soft-lg hover:bg-primary-600 active:scale-95 transition-all duration-200 z-40"
        aria-label="Publicar alerta"
      >
        <Icon name="plus" size={28} />
      </button>

      <BottomNav
        variant="mock"
        active="alertas"
        onNavigate={(key) => {
          const map = { inicio: 'feed', pesquisar: 'search', alertas: 'feed', perfil: 'profile' }
          setCurrentScreen(map[key] || key)
        }}
      />
    </div>
  )
}

export default Feed
