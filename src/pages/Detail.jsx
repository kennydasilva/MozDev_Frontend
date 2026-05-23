import { useState, useMemo } from 'react'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/StatusBadge'
import Icon from '../components/Icon'
import Button from '../components/Button'
import AppBar from '../components/AppBar'
import { useApp } from '../context/AppContext'
import { alerts } from '../data/mockData'
import { feedAlerts } from '../data/feedMockData'

function InfoCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-4 mb-3">
      <h3 className="text-sm font-bold text-surface-700 mb-3 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-primary-500" />
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3">
      {icon && <Icon name={icon} size={16} className="mt-0.5 text-surface-400 shrink-0" />}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-surface-400 block">{label}</span>
        <span className="text-sm text-surface-700 font-medium">{value || '---'}</span>
      </div>
    </div>
  )
}

function CommentItem({ comment }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-surface-100 last:border-0">
      <Avatar name={`User ${comment.userId}`} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold text-surface-700">Utilizador #{comment.userId}</span>
          <span className="text-[10px] text-surface-400">
            {new Date(comment.date).toLocaleDateString('pt-MZ', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <p className="text-sm text-surface-600 leading-relaxed">{comment.text}</p>
      </div>
    </div>
  )
}

function Detail() {
  const { currentScreen, setCurrentScreen } = useApp()
  const [showAllComments, setShowAllComments] = useState(false)

  const alertId = useMemo(() => {
    const match = currentScreen.match(/^detail-(\d+)/)
    return match ? Number(match[1]) : null
  }, [currentScreen])

  const alert = useMemo(() => {
    const base = alerts.find((a) => a.id === alertId)
    if (!base) return null
    const feedItem = feedAlerts.find((f) => f.id === alertId)
    return { ...base, photo: feedItem?.photo || base.photo || null }
  }, [alertId])

  const hasComments = alert && alert.comments && alert.comments.length > 0
  const visibleComments = showAllComments
    ? alert?.comments || []
    : alert?.comments?.slice(0, 2) || []
  const hiddenCount = alert ? (alert.comments?.length || 0) - 2 : 0

  function handleTip() {
    setCurrentScreen('send-tip')
  }

  function handleComment() {
    setCurrentScreen(`detail-${alert.id}?focus=comments`)
  }

  function handleShare() {
    const url = `${window.location.origin}/alerta/${alert.id}`
    if (navigator.share) {
      navigator.share({ title: alert.name, text: alert.description, url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url).catch(() => {})
    }
  }

  function handleChat() {
    setCurrentScreen('chat-list')
  }

  function handleReport() {
    alert('Obrigado pelo seu reporte. A equipa Rede Alerta irá analisar a informação.')
  }

  function handleBack() {
    setCurrentScreen('feed')
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col">
        <AppBar title="Alerta" onBack={handleBack} />
        <div className="flex-1 flex items-center justify-center screen-padding">
          <div className="text-center">
            <Icon name="alert" size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500 font-medium">Alerta não encontrado</p>
          </div>
        </div>
      </div>
    )
  }

  const isFound = alert.status === 'encontrado'

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <AppBar title="Detalhes do Alerta" onBack={handleBack} />

      <div className="flex-1 overflow-y-auto pb-36">
        {isFound && (
          <div className="bg-success-500 text-white px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="check" size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Esta pessoa foi encontrada</p>
              <p className="text-xs text-white/80">
                {alert.foundDate
                  ? `Encontrada em ${new Date(alert.foundDate).toLocaleDateString('pt-MZ')}`
                  : 'Graças à ajuda da comunidade!'}
              </p>
            </div>
          </div>
        )}

        <div className="relative">
          {alert.photo ? (
            <div className="w-full h-64 relative">
              <img
                src={alert.photo}
                alt={alert.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ) : (
            <div
              className={`w-full h-56 flex items-center justify-center ${
                isFound
                  ? 'bg-gradient-to-br from-success-400 to-success-600'
                  : 'bg-gradient-to-br from-primary-400 to-primary-600'
              }`}
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-16">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">{alert.name}</h1>
                <p className="text-sm text-white/80">
                  {alert.idade || alert.age} anos &middot; {alert.sexo}
                </p>
              </div>
              <StatusBadge status={alert.status} />
            </div>
          </div>
        </div>

        <div className="screen-padding mt-4">
          <InfoCard title="Informações básicas">
            <InfoRow label="Nome completo" value={alert.name} icon="user" />
            <InfoRow label="Idade" value={`${alert.idade || alert.age} anos`} icon="clock" />
            <InfoRow label="Sexo" value={alert.sexo} icon="users" />
            <InfoRow label="Status" value={alert.status === 'desaparecido' ? 'Desaparecido' : alert.status === 'encontrado' ? 'Encontrado' : 'Em verificação'} icon="flag" />
          </InfoCard>

          <InfoCard title="Local e data">
            <InfoRow label="Última vez visto" value={alert.lastSeen} icon="location" />
            <InfoRow label="Data do desaparecimento" value={alert.dateMissing} icon="calendar" />
            {alert.foundDate && (
              <InfoRow label="Data de encontro" value={new Date(alert.foundDate).toLocaleDateString('pt-MZ')} icon="checkCircle" />
            )}
          </InfoCard>

          <InfoCard title="Características físicas">
            <InfoRow label="Descrição física" value={alert.physicalDesc} icon="user" />
            <InfoRow label="Vestuário" value={alert.clothing} icon="image" />
          </InfoCard>

          {alert.contact && (
            <InfoCard title="Contacto de referência">
              <div className="flex items-center justify-between">
                <InfoRow label="Telefone" value={alert.contact} icon="phone" />
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={`tel:${alert.contact}`}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                    aria-label="Ligar"
                  >
                    <Icon name="phone" size={18} />
                  </a>
                  <a
                    href={`sms:${alert.contact}`}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                    aria-label="Enviar SMS"
                  >
                    <Icon name="messageCircle" size={18} />
                  </a>
                </div>
              </div>
            </InfoCard>
          )}

          {alert.description && (
            <InfoCard title="Descrição detalhada">
              <p className="text-sm text-surface-600 leading-relaxed">
                {alert.description}
              </p>
            </InfoCard>
          )}

          <div className="bg-white rounded-2xl shadow-soft p-4 mb-3">
            <h3 className="text-sm font-bold text-surface-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-primary-500" />
              Localização
            </h3>
            <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-xl">
              <Icon name="location" size={20} className="text-primary-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-surface-700">Último local visto</p>
                <p className="text-xs text-surface-400">{alert.lastSeen}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 mb-3">
            <h3 className="text-sm font-bold text-surface-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-primary-500" />
              Comentários
              {hasComments && (
                <span className="text-xs text-surface-400 font-normal">
                  ({alert.comments.length})
                </span>
              )}
            </h3>
            {hasComments ? (
              <>
                {visibleComments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
                {!showAllComments && hiddenCount > 0 && (
                  <button
                    onClick={() => setShowAllComments(true)}
                    className="w-full text-center text-sm font-medium text-primary-600 py-3 hover:text-primary-700 transition-colors"
                  >
                    Ver todos os {hiddenCount} comentários
                  </button>
                )}
              </>
            ) : (
              <p className="text-sm text-surface-400 text-center py-4">
                Nenhum comentário ainda. Seja o primeiro a comentar.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-surface-100 px-5 pt-3 pb-[env(safe-area-inset-bottom,12px)] z-40">
        <div className="flex items-center gap-2">
          <Button onClick={handleTip} className="!w-auto flex-1">
            <Icon name="sendTip" size={16} />
            Pista
          </Button>
          <Button onClick={handleComment} variant="secondary" className="!w-auto flex-1">
            <Icon name="comment" size={16} />
            Comentar
          </Button>
          <Button onClick={handleShare} variant="secondary" className="!w-auto !px-3">
            <Icon name="share" size={18} />
          </Button>
          <Button onClick={handleChat} variant="outline" className="!w-auto !px-3">
            <Icon name="messageCircle" size={18} />
          </Button>
        </div>
        <button
          onClick={handleReport}
          className="w-full text-center text-xs text-alert-500 font-medium py-2 hover:text-alert-600 transition-colors"
        >
          Reportar informação incorrecta
        </button>
      </div>
    </div>
  )
}

export default Detail
