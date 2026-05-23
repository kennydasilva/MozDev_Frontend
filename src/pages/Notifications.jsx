import { useState } from 'react'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'
import { notifications as mockNotifications } from '../data/mockData'

const iconMap = {
  comment: 'messageCircle',
  tip: 'sendTip',
  status: 'info',
  message: 'messageCircle',
  found: 'checkCircle',
  nearby: 'location',
}

function Notifications() {
  const { setCurrentScreen } = useApp()
  const [notifications, setNotifications] = useState(
    [...mockNotifications].sort((a, b) => new Date(b.date) - new Date(a.date))
  )

  const unread = notifications.filter((n) => !n.read)
  const read = notifications.filter((n) => n.read)

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function handleClick(n) {
    if (n.alertId) {
      setCurrentScreen(`detail-${n.alertId}`)
    } else if (n.type === 'message') {
      setCurrentScreen('chat-list')
    }
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
  }

  function renderSection(title, items) {
    if (items.length === 0) return null
    return (
      <div className="mb-2">
        <h3 className="text-sm font-bold text-surface-500 uppercase tracking-wide mb-2">{title}</h3>
        <div className="flex flex-col">
          {items.map((n, i) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`flex items-start gap-3 py-3.5 text-left transition-colors hover:bg-surface-50 -mx-5 px-5 ${
                !n.read ? 'bg-primary-50/60' : ''
              } ${i < items.length - 1 ? 'border-b border-surface-100' : ''}`}
            >
              {!n.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full" />
              )}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  n.read ? 'bg-surface-100 text-surface-500' : 'bg-primary-100 text-primary-600'
                }`}
              >
                <Icon name={iconMap[n.type] || 'info'} size={18} />
              </div>
              <div className="flex-1 min-w-0 relative">
                <p
                  className={`text-sm leading-relaxed ${
                    n.read ? 'text-surface-600' : 'text-surface-800 font-semibold'
                  }`}
                >
                  {n.text}
                </p>
                <span className="text-xs text-surface-400 mt-0.5 block">{formatDate(n.date)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const hasNotifications = notifications.length > 0
  const hasUnread = unread.length > 0

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar
        title="Notificações"
        showMenu
        rightContent={
          hasUnread ? (
            <button
              onClick={handleMarkAllRead}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors px-2 py-1"
            >
              Marcar todas como lidas
            </button>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="screen-padding pt-4">
          {!hasNotifications ? (
            <EmptyState
              icon="notifications"
              title="Nenhuma notificação"
              description="Quando houver novidades, aparecerão aqui."
            />
          ) : (
            <div className="relative">
              {renderSection('Novas', unread)}
              {renderSection('Anteriores', read)}
            </div>
          )}
        </div>
      </div>

      <BottomNav active="notificacoes" onNavigate={(key) => { const map = { inicio: 'feed', pesquisar: 'search', publicar: 'create', perfil: 'profile' }; setCurrentScreen(map[key] || key); }} />
    </div>
  )
}

export default Notifications
