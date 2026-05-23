import AppBar from '../components/AppBar'
import EmptyState from '../components/EmptyState'

function EmptyStates() {
  return (
    <div className="min-h-screen bg-white">
      <AppBar title="Estados Vazios" />

      <div className="pb-8 slide-up">
        <div className="border-b border-surface-100">
          <EmptyState
            icon="notifications"
            title="Nenhuma notificação"
            description="Quando receber notificações, elas aparecerão aqui."
          />
        </div>

        <div className="border-b border-surface-100">
          <EmptyState
            icon="messageCircle"
            title="Nenhum comentário"
            description="Seja o primeiro a comentar nesta publicação."
            action={{ label: "Comentar", onClick: () => {} }}
          />
        </div>

        <div className="border-b border-surface-100">
          <EmptyState
            icon="search"
            title="Nenhum resultado"
            description="Tente ajustar a sua pesquisa ou usar termos diferentes."
          />
        </div>

        <div className="border-b border-surface-100">
          <EmptyState
            icon="messageCircle"
            title="Nenhuma conversa"
            description="As suas mensagens aparecerão aqui quando iniciar uma conversa."
            action={{ label: "Nova conversa", onClick: () => {} }}
          />
        </div>

        <div className="border-b border-surface-100">
          <EmptyState
            icon="edit"
            title="Nenhuma publicação"
            description="As suas publicações aparecerão aqui."
            action={{ label: "Criar publicação", onClick: () => {} }}
          />
        </div>
      </div>
    </div>
  )
}

export default EmptyStates
