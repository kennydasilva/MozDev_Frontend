import { useState } from 'react'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Button from '../components/Button'
import AppBar from '../components/AppBar'
import { useApp } from '../context/AppContext'

function EditProfile() {
  const { user, setUser, setCurrentScreen } = useApp()

  const [nome, setNome] = useState(user?.name || '')
  const [telefone, setTelefone] = useState(user?.phone || '')
  const [localizacao, setLocalizacao] = useState(user?.location || '')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setUser({ ...user, name: nome, phone: telefone, location: localizacao })
    setSaved(true)
    setTimeout(() => setCurrentScreen('profile'), 800)
  }

  if (!user) return null

  if (saved) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center screen-padding">
        <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mb-4">
          <Icon name="check" size={32} className="text-success-500" />
        </div>
        <p className="text-lg font-bold text-surface-800">Perfil actualizado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar title="Editar Perfil" onBack={() => setCurrentScreen('profile')} />

      <div className="flex-1 screen-padding max-w-mobile mx-auto w-full">
        <div className="pt-8 slide-up">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="relative">
              <Avatar name={nome || 'U'} size="xl" />
              <div className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-soft border-2 border-white cursor-pointer hover:bg-primary-600 transition-colors">
                <Icon name="camera" size={14} />
              </div>
            </div>
            <p className="text-xs text-surface-400">Toque para alterar foto</p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="Nome completo"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              icon="user"
            />
            <Input
              label="Número de telefone"
              placeholder="+258 00 000 0000"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              icon="phone"
            />
            <Input
              label="Localização"
              placeholder="Cidade, Província"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              icon="location"
            />
          </div>

          <div className="mt-8 pb-8">
            <Button onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
