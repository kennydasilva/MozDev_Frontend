import { useState } from 'react'
import AppBar from '../components/AppBar'
import Button from '../components/Button'
import Input from '../components/Input'
import Icon from '../components/Icon'
import StatusBadge from '../components/StatusBadge'
import PhotoUpload from '../components/PhotoUpload'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { alerts } from '../data/mockData'

function SendTip() {
  const { currentScreen, setCurrentScreen } = useApp()
  const { showToast } = useToast()
  const alertId = parseInt(currentScreen.replace('send-tip-', ''), 10)
  const alert = alerts.find((a) => a.id === alertId)

  const [info, setInfo] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState(null)
  const [anonymous, setAnonymous] = useState(true)
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    showToast('Pista enviada com sucesso! Obrigado por ajudar.', 'success')
    setSent(true)
    setTimeout(() => setCurrentScreen('feed'), 1500)
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-surface-400">Alerta não encontrado</p>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center screen-padding slide-up">
        <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center mb-5">
          <Icon name="checkCircle" size={48} className="text-success-500" />
        </div>
        <h2 className="text-xl font-bold text-surface-800 mb-2">Pista enviada!</h2>
        <p className="text-sm text-surface-400 text-center max-w-xs leading-relaxed">
          A sua informação foi recebida e será analisada pelo responsável do caso.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <AppBar title="Enviar Pista" onBack={() => setCurrentScreen('feed')} />

      <form onSubmit={handleSubmit} className="screen-padding pt-5 pb-8 max-w-mobile mx-auto slide-up">
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center">
              <Icon name="profile" size={22} className="text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-surface-800 text-sm truncate">{alert.name}</p>
              <StatusBadge status={alert.status} size="sm" />
            </div>
          </div>
          <p className="text-xs text-surface-400 mt-2 ml-0.5">Sobre o caso de {alert.name}</p>
        </div>

        <div className="mb-1">
          <label className="text-sm font-medium text-surface-700 mb-1.5 block">
            A sua informação
          </label>
          <Input
            multiline
            rows={5}
            placeholder="Descreva detalhadamente a informação que possui..."
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Input
            icon="location"
            placeholder="Localização (opcional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-surface-700 mb-1.5">Adicionar imagem (opcional)</p>
          <PhotoUpload onUpload={(file) => setImage(file)} currentImage={image} />
        </div>

        <div className="mt-6 card p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-700">Enviar anonimamente</p>
              <p className="text-xs text-surface-400 mt-0.5">A sua identidade não será revelada</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:ring-2 peer-focus:ring-primary-100 rounded-full peer peer-checked:bg-primary-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-soft after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-surface-400 leading-relaxed">
          <Icon name="shield" size={16} className="shrink-0 mt-0.5 text-surface-300" />
          <span>A sua informação será tratada com discrição e apenas partilhada com o responsável pelo caso.</span>
        </div>

        <Button type="submit" variant="primary" className="mt-6" disabled={!info.trim()}>
          Enviar pista
        </Button>
      </form>
    </div>
  )
}

export default SendTip
