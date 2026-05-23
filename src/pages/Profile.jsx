import { useState } from 'react'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Button from '../components/Button'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'
import { useApp } from '../context/AppContext'
import { users } from '../data/mockData'

function Profile() {
  const { user, setUser, setCurrentScreen } = useApp()
  const [showConfirm, setShowConfirm] = useState(false)

  const profile = users.find((u) => u.id === user?.id)
  if (!profile || !user) return null

  const stats = profile.stats || { posts: 0, resolved: 0, tips: 0 }

  const menuItems = [
    { icon: 'edit', label: 'Minhas publicações', action: () => setCurrentScreen('my-publications') },
    { icon: 'bookmark', label: 'Publicações guardadas', action: () => setCurrentScreen('my-publications') },
    { icon: 'clock', label: 'Histórico', action: () => setCurrentScreen('my-publications') },
    { icon: 'settings', label: 'Configurações', action: () => setCurrentScreen('settings') },
    { icon: 'helpCircle', label: 'Ajuda', action: () => setCurrentScreen('settings') },
    { icon: 'logout', label: 'Sair', alert: true, action: () => setShowConfirm(true) },
  ]

  function handleLogout() {
    setUser(null)
    setCurrentScreen('login')
  }

  function handleNavigate(key) {
    if (key === 'perfil') return
    if (key === 'publicar') { setCurrentScreen('create'); return }
    const screenMap = {
      inicio: 'feed',
      pesquisar: 'search',
      notificacoes: 'notifications',
    }
    setCurrentScreen(screenMap[key] || key)
  }

  function StatCard({ icon, value, label }) {
    return (
      <div className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl bg-surface-50">
        <Icon name={icon} size={20} className="text-primary-500" />
        <span className="text-lg font-bold text-surface-800">{value}</span>
        <span className="text-xs text-surface-400">{label}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar title="Perfil" showMenu />
      <div className="flex-1 max-w-mobile mx-auto w-full">
        <div className="screen-padding pt-6 pb-24">
          <div className="flex flex-col items-center gap-3 mb-8 slide-up">
            <Avatar name={profile.name} src={user?.avatar} size="xl" />
            <h1 className="text-xl font-bold text-surface-800">{profile.name}</h1>
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1.5 text-sm text-surface-400">
                <Icon name="mail" size={14} />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-surface-400">
                <Icon name="phone" size={14} />
                <span>{profile.phone}</span>
              </div>
              {profile.location && (
                <div className="flex items-center gap-1.5 text-sm text-surface-400">
                  <Icon name="location" size={14} />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
            <Button
              variant="secondary"
              fullWidth={false}
              className="!w-auto px-6 mt-1"
              onClick={() => setCurrentScreen('edit-profile')}
            >
              Editar perfil
            </Button>
          </div>

          <div className="flex gap-3 mb-8">
            <StatCard icon="flag" value={stats.posts} label="Publicações" />
            <StatCard icon="checkCircle" value={stats.resolved} label="Resolvidos" />
            <StatCard icon="sendTip" value={stats.tips} label="Pistas" />
          </div>

          <div className="flex flex-col gap-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="card flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-surface-50 transition-colors active:scale-[0.99]"
                aria-label={item.label}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  item.alert ? 'bg-alert-50' : 'bg-surface-100'
                }`}>
                  <Icon
                    name={item.icon}
                    size={20}
                    className={item.alert ? 'text-alert-500' : 'text-surface-500'}
                  />
                </div>
                <span className={`flex-1 text-sm font-medium ${
                  item.alert ? 'text-alert-500' : 'text-surface-700'
                }`}>
                  {item.label}
                </span>
                <Icon name="arrowRight" size={18} className="text-surface-300" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6"
          onClick={() => setShowConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar saída"
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-alert-50 flex items-center justify-center">
                <Icon name="logout" size={24} className="text-alert-500" />
              </div>
              <h3 className="text-lg font-bold text-surface-800">Sair da conta</h3>
              <p className="text-sm text-surface-400 text-center">
                Tem a certeza que deseja sair da sua conta?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-surface-100 text-surface-700 font-semibold rounded-2xl text-sm hover:bg-surface-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-alert-500 text-white font-semibold rounded-2xl text-sm hover:bg-alert-600 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="perfil" onNavigate={handleNavigate} />
    </div>
  )
}

export default Profile
