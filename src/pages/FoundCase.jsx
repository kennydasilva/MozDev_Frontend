import Icon from '../components/Icon'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'
import { alerts } from '../data/mockData'

function FoundCase() {
  const { currentScreen, setCurrentScreen } = useApp()
  const alertId = parseInt(currentScreen.replace('found-', ''), 10)
  const alert = alerts.find((a) => a.id === alertId)

  if (!alert) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-surface-400">Alerta não encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-success-50 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-10 left-8 w-4 h-4 rounded-full bg-success-500" />
        <div className="absolute top-20 right-12 w-3 h-3 rounded-full bg-success-500" />
        <div className="absolute bottom-32 left-16 w-5 h-5 rounded-full bg-success-500" />
        <div className="absolute bottom-20 right-20 w-2 h-2 rounded-full bg-success-500" />
        <div className="absolute top-1/3 right-8 w-6 h-6 rounded-full bg-success-500" />
        <div className="absolute top-2/3 left-10 w-2 h-2 rounded-full bg-success-500" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center screen-padding slide-up">
        <div className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center mb-6">
          <Icon name="checkCircle" size={80} className="text-success-500" />
        </div>

        <h1 className="text-2xl font-bold text-success-600 mb-1">Pessoa Encontrada!</h1>
        <p className="text-lg font-semibold text-surface-800 mb-2">{alert.name}</p>
        <p className="text-sm text-surface-500 mb-1">Esta pessoa foi encontrada em segurança.</p>

        {alert.foundDate && (
          <div className="flex items-center gap-1.5 mt-2 mb-6 text-sm text-surface-400">
            <Icon name="calendar" size={16} />
            <span>
              {new Date(alert.foundDate).toLocaleDateString('pt-PT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        )}

        <p className="text-sm text-surface-500 italic text-center max-w-xs leading-relaxed mb-8">
          Que bom que esta história teve um final feliz. Agradecemos a todos que ajudaram na divulgação.
        </p>

        <div className="w-full flex flex-col gap-3 max-w-sm">
          <Button variant="primary" onClick={() => setCurrentScreen('feed')}>
            Arquivar caso
          </Button>
          <Button variant="secondary" onClick={() => setCurrentScreen('feed')}>
            Voltar ao início
          </Button>
          <Button variant="outline" onClick={() => setCurrentScreen('feed')}>
            Partilhar boa notícia
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FoundCase
