import { useState, useEffect, useRef } from 'react'
import Avatar from '../components/Avatar'
import AppBar from '../components/AppBar'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { alerts, users } from '../data/mockData'
import { getLocalPublicationById, updatePublication } from '../services/storage'

function Comments() {
  const { currentScreen, setCurrentScreen, user } = useApp()
  const { showToast } = useToast()
  const alertId = parseInt(currentScreen.replace('comments-', ''), 10)

  const alert = alerts.find((a) => a.id === alertId) || getLocalPublicationById(alertId)
  const localComments = getLocalPublicationById(alertId)?.comments

  const [comments, setComments] = useState(alert?.comments || localComments || [])
  const [newComment, setNewComment] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [toast, setToast] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2500)
      return () => clearTimeout(t)
    }
  }, [toast])

  function handleSend() {
    if (!newComment.trim()) return
    const comment = {
      id: Date.now(),
      userId: user?.id || 1,
      text: newComment.trim(),
      date: new Date().toISOString(),
    }
    const updated = [...comments, comment]
    setComments(updated)
    if (alert?.local) {
      updatePublication(alertId, { comments: updated })
    }
    showToast('Comentário enviado', 'success')
    setNewComment('')
  }

  function getUserName(userId) {
    const u = users.find((u) => u.id === userId)
    return u?.name || 'Utilizador'
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  function handleReport(commentId) {
    setOpenMenuId(null)
    setToast('Comentário reportado com sucesso')
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <AppBar title="Comentários" onBack={() => setCurrentScreen('feed')} />
        <EmptyState icon="comment" title="Alerta não encontrado" description="Este alerta pode ter sido removido." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar title="Comentários" onBack={() => setCurrentScreen('feed')} />

      <div className="sticky top-14 z-10 bg-white border-b border-surface-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={alert.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-surface-800 truncate">{alert.name}</p>
            <StatusBadge status={alert.status} size="sm" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="screen-padding py-4">
          {comments.length === 0 ? (
            <EmptyState icon="comment" title="Nenhum comentário" description="Seja o primeiro a comentar." />
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((c) => (
                <div key={c.id} className="relative">
                  <div className="flex gap-3">
                    <Avatar name={getUserName(c.userId)} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-surface-800">{getUserName(c.userId)}</span>
                          <span className="text-xs text-surface-400">{formatDate(c.date)}</span>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                            className="p-1 rounded-lg hover:bg-surface-100 transition-colors"
                            aria-label="Opções"
                          >
                            <Icon name="moreVertical" size={16} className="text-surface-400" />
                          </button>
                          {openMenuId === c.id && (
                            <div className="absolute right-0 top-8 z-10 bg-white rounded-xl shadow-lg border border-surface-100 py-1 min-w-[180px] fade-in">
                              <button
                                onClick={() => handleReport(c.id)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-alert-600 hover:bg-surface-50 transition-colors"
                              >
                                <Icon name="flag" size={16} />
                                Reportar comentário
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-surface-700 mt-1 leading-relaxed">{c.text}</p>
                      <button className="text-xs text-primary-500 font-medium mt-1.5 hover:underline">
                        Responder
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-12 right-0 h-px bg-surface-100" />
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-surface-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg fade-in max-w-mobile w-[90%] text-center">
          {toast}
        </div>
      )}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-surface-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 bg-surface-50 border border-surface-200 rounded-2xl px-4 py-2.5 text-sm text-surface-800 placeholder-surface-400 outline-none"
            placeholder="Escreva um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!newComment.trim()}
            className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shrink-0"
            aria-label="Enviar"
          >
            <Icon name="send" size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Comments
