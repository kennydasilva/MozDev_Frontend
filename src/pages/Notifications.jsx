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

const typeLabels = {
  comment: 'Comentário',
  tip: 'Pista',
  status: 'Actualização',
  message: 'Mensagem',
  found: 'Encontrado',
  nearby: 'Próximo',
}

function Notifications() {
  const { setCurrentScreen } = useApp()
  const [notifications, setNotifications] = useState(
    [...mockNotifications].sort((a, b) => new Date(b.date) - new Date(a.date))
  )

  const unread = notifications.filter((n) => !n.read)
  const read = notifications.filter((n) => n.read)
  const hasUnread = unread.length > 0
  const hasNotifications = notifications.length > 0

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
    try {
      const d = new Date(dateStr)
      const now = new Date()
      const diffMs = now - d
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Agora'
      if (diffMins < 60) return `Há ${diffMins} min`
      if (diffHours < 24) return `Há ${diffHours}h`
      if (diffDays === 1) return 'Ontem'
      if (diffDays < 7) return `Há ${diffDays} dias`
      return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
    } catch {
      return dateStr
    }
  }

  function NotificationItem({ n, isLast }) {
    const nRead = n.read
    const icon = iconMap[n.type] || 'info'
    const label = typeLabels[n.type] || ''

    return (
      <button
        onClick={() => handleClick(n)}
        className={`flex items-start gap-3 py-3.5 px-4 text-left transition-colors hover:bg-surface-50 w-full ${
          !isLast ? 'border-b border-surface-100' : ''
        }`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            nRead ? 'bg-surface-100 text-surface-400' : 'bg-primary-50 text-primary-600'
          }`}
        >
          <Icon name={icon} size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {!nRead && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />}
            <span className={`text-[11px] font-medium ${nRead ? 'text-surface-400' : 'text-primary-600'}`}>
              {label}
            </span>
            <span className="text-[11px] text-surface-400 ml-auto">{formatDate(n.date)}</span>
          </div>
          <p className={`text-sm leading-snug ${nRead ? 'text-surface-500' : 'text-surface-800 font-medium'}`}>
            {n.text}
          </p>
        </div>
      </button>
    )
  }

  function Section({ title, items }) {
    if (items.length === 0) return null
    return (
      <div className="mb-2">
        <div className="px-4 pt-5 pb-2">
          <h3 className="text-[11px] font-semibold text-surface-400 uppercase tracking-widest">
            {title} · {items.length}
          </h3>
        </div>
        <div className="bg-white rounded-2xl shadow-soft border border-surface-100 overflow-hidden">
          {items.map((n, i) => (
            <NotificationItem key={n.id} n={n} isLast={i === items.length - 1} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <AppBar
        title="Notificações"
        showMenu
        rightContent={
          hasUnread ? (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors px-2 py-1"
            >
              Ler todas
            </button>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-mobile mx-auto w-full">
          {!hasNotifications ? (
            <div className="screen-padding pt-10">
              <EmptyState
                icon="notifications"
                title="Nenhuma notificação"
                description="Quando houver novidades, aparecerão aqui."
              />
            </div>
          ) : (
            <div className="px-3">
              <Section title="Novas" items={unread} />
              <Section title="Anteriores" items={read} />
            </div>
          )}
        </div>
      </div>

      <BottomNav
        active="notificacoes"
        onNavigate={(key) => {
          const map = { inicio: 'feed', pesquisar: 'search', publicar: 'create', perfil: 'profile' }
          setCurrentScreen(map[key] || key)
        }}
      />
    </div>
  )
}

export default Notifications
