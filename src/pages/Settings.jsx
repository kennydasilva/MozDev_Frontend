import { useState } from 'react'
import AppBar from '../components/AppBar'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-surface-200 peer-focus:ring-2 peer-focus:ring-primary-100 rounded-full peer peer-checked:bg-primary-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-soft after:transition-all peer-checked:after:translate-x-5" />
    </label>
  )
}

function SettingsRow({ label, children, onClick }) {
  const Component = onClick ? 'button' : 'div'
  return (
    <Component
      onClick={onClick}
      className="w-full flex items-center justify-between py-3.5 px-4 bg-white border-b border-surface-100 last:border-b-0"
    >
      <span className="text-sm text-surface-700">{label}</span>
      {children}
    </Component>
  )
}

function SectionHeader({ children }) {
  return (
    <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider px-4 pt-6 pb-2">
      {children}
    </p>
  )
}

function Settings() {
  const { setCurrentScreen } = useApp()
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [idioma, setIdioma] = useState('pt')
  const [publicProfile, setPublicProfile] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [showVersionModal, setShowVersionModal] = useState(false)

  return (
    <div className="min-h-screen bg-surface-50">
      <AppBar title="Configurações" showMenu />

      <div className="pb-8 max-w-mobile mx-auto slide-up">
        <SectionHeader>Geral</SectionHeader>
        <div className="card mx-4 overflow-hidden">
          <SettingsRow label="Receber notificações">
            <Toggle checked={notifications} onChange={setNotifications} />
          </SettingsRow>
          <SettingsRow label="Notificações por email">
            <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
          </SettingsRow>
          <SettingsRow label="Idioma">
            <select
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              className="text-sm text-surface-600 bg-surface-50 border border-surface-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none"
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
            </select>
          </SettingsRow>
        </div>

        <SectionHeader>Privacidade</SectionHeader>
        <div className="card mx-4 overflow-hidden">
          <SettingsRow label="Perfil público">
            <Toggle checked={publicProfile} onChange={setPublicProfile} />
          </SettingsRow>
          <SettingsRow label="Mostrar contacto nas publicações">
            <Toggle checked={showContact} onChange={setShowContact} />
          </SettingsRow>
        </div>

        <SectionHeader>Segurança</SectionHeader>
        <div className="card mx-4 overflow-hidden">
          <SettingsRow label="Alterar palavra-passe" onClick={() => {}}>
            <Icon name="arrowRight" size={18} className="text-surface-300" />
          </SettingsRow>
          <SettingsRow label="Verificação em duas etapas">
            <Toggle checked={twoFactor} onChange={setTwoFactor} />
          </SettingsRow>
        </div>

        <SectionHeader>Informação</SectionHeader>
        <div className="card mx-4 overflow-hidden">
          <SettingsRow label="Termos e condições" onClick={() => {}}>
            <Icon name="arrowRight" size={18} className="text-surface-300" />
          </SettingsRow>
          <SettingsRow label="Política de privacidade" onClick={() => {}}>
            <Icon name="arrowRight" size={18} className="text-surface-300" />
          </SettingsRow>
          <SettingsRow label="Sobre a aplicação" onClick={() => setShowVersionModal(true)}>
            <Icon name="arrowRight" size={18} className="text-surface-300" />
          </SettingsRow>
          <SettingsRow label="Versão">
            <span className="text-sm text-surface-400">1.0.0</span>
          </SettingsRow>
        </div>
      </div>

      {showVersionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 fade-in"
          onClick={() => setShowVersionModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-soft-lg slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
                <Icon name="shield" size={28} className="text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-surface-800">Rede Alerta</h3>
              <p className="text-sm text-surface-400 text-center leading-relaxed">
                Versão 1.0.0
              </p>
              <p className="text-xs text-surface-400 text-center leading-relaxed">
                Plataforma de alerta e divulgação de pessoas desaparecidas em Moçambique.
              </p>
              <button
                onClick={() => setShowVersionModal(false)}
                className="btn-primary mt-2"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
