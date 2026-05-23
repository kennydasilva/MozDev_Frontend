import { useState } from 'react'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/StatusBadge'
import AppBar from '../components/AppBar'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { alerts } from '../data/mockData'
import { deletePublication } from '../services/storage'

const filters = [
  { key: 'todas', label: 'Todas' },
  { key: 'desaparecido', label: 'Desaparecidos' },
  { key: 'encontrado', label: 'Encontrados' },
  { key: 'em-verificacao', label: 'Em verificação' },
]

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function MyPublications() {
  const { user, setCurrentScreen } = useApp()
  const { showToast } = useToast()
  const [activeFilter, setActiveFilter] = useState('todas')
  const [deleteTarget, setDeleteTarget] = useState(null)

  if (!user) return null

  const userAlerts = alerts.filter((a) => a.authorId === user.id)

  const filteredAlerts = activeFilter === 'todas'
    ? userAlerts
    : userAlerts.filter((a) => a.status === activeFilter)

  function handleDelete(alertItem) {
    setDeleteTarget(alertItem)
  }

  function confirmDelete() {
    if (deleteTarget?.local) {
      deletePublication(deleteTarget.id)
    }
    showToast('Publicação apagada com sucesso', 'success')
    setDeleteTarget(null)
  }

  function handleMarkFound(alertItem) {
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar title="Minhas Publicações" showMenu />

      <div className="max-w-mobile mx-auto w-full flex-1 flex flex-col">
        <div className="sticky top-14 z-30 bg-white border-b border-surface-100">
          <div className="flex gap-1 px-5 pt-3 pb-0 overflow-x-auto scrollbar-none">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === f.key
                    ? 'text-primary-600'
                    : 'text-surface-400 hover:text-surface-600'
                }`}
                aria-pressed={activeFilter === f.key}
                aria-label={`Filtrar por ${f.label}`}
              >
                {f.label}
                {activeFilter === f.key && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 screen-padding pt-5 pb-24">
          {filteredAlerts.length === 0 ? (
            <EmptyState
              icon="flag"
              title="Nenhuma publicação"
              description={activeFilter === 'todas' ? 'Você ainda não fez nenhuma publicação' : `Nenhuma publicação com o filtro "${filters.find(f => f.key === activeFilter)?.label}"`}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {filteredAlerts.map((alertItem) => (
                <article
                  key={alertItem.id}
                  className="card p-4"
                  role="article"
                  aria-label={`Publicação: ${alertItem.name}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar name={alertItem.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-surface-800 text-sm truncate">
                        {alertItem.name}
                      </h3>
                      <p className="text-xs text-surface-400">
                        {formatDate(alertItem.date)}
                      </p>
                    </div>
                    <StatusBadge status={alertItem.status} size="sm" />
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-surface-100">
                    <button
                      onClick={() => setCurrentScreen('edit-alert')}
                      className="flex items-center justify-center gap-1 text-xs font-medium text-surface-500 px-2.5 py-2 rounded-xl hover:bg-surface-100 transition-colors"
                      aria-label="Editar"
                    >
                      <Icon name="edit" size={15} />
                      <span className="hidden sm:inline">Editar</span>
                    </button>

                    {(alertItem.status === 'desaparecido' || alertItem.status === 'em-verificacao') && (
                      <button
                        onClick={() => handleMarkFound(alertItem)}
                        className="flex items-center justify-center gap-1 text-xs font-medium text-success-600 px-2.5 py-2 rounded-xl hover:bg-success-50 transition-colors"
                        aria-label="Marcar como encontrado"
                      >
                        <Icon name="check" size={15} />
                        <span className="hidden sm:inline">Encontrado</span>
                      </button>
                    )}

                    <button
                      onClick={() => setCurrentScreen('alert-details')}
                      className="flex items-center justify-center gap-1 text-xs font-medium text-surface-500 px-2.5 py-2 rounded-xl hover:bg-surface-100 transition-colors"
                      aria-label="Ver comentários"
                    >
                      <Icon name="messageCircle" size={15} />
                      {alertItem.comments.length > 0 && (
                        <span className="text-surface-400">{alertItem.comments.length}</span>
                      )}
                    </button>

                    <button
                      onClick={() => setCurrentScreen('alert-details')}
                      className="flex items-center justify-center gap-1 text-xs font-medium text-amber-600 px-2.5 py-2 rounded-xl hover:bg-amber-50 transition-colors"
                      aria-label="Ver pistas"
                    >
                      <Icon name="sendTip" size={15} />
                      {alertItem.tips.length > 0 && (
                        <span className="text-amber-500">{alertItem.tips.length}</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(alertItem)}
                      className="flex items-center justify-center gap-1 text-xs font-medium text-alert-500 px-2.5 py-2 rounded-xl hover:bg-alert-50 transition-colors ml-auto"
                      aria-label="Apagar"
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6"
          onClick={() => setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-alert-50 flex items-center justify-center">
                <Icon name="trash" size={24} className="text-alert-500" />
              </div>
              <h3 className="text-lg font-bold text-surface-800">Apagar publicação</h3>
              <p className="text-sm text-surface-400 text-center">
                Tem a certeza que deseja apagar a publicação de <strong>{deleteTarget.name}</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 bg-surface-100 text-surface-700 font-semibold rounded-2xl text-sm hover:bg-surface-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-alert-500 text-white font-semibold rounded-2xl text-sm hover:bg-alert-600 transition-colors"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyPublications
