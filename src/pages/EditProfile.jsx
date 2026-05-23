import { useState } from 'react'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Button from '../components/Button'
import AppBar from '../components/AppBar'
import { useApp } from '../context/AppContext'
import { users } from '../data/mockData'

function EditProfile() {
  const { user, setCurrentScreen } = useApp()
  const profile = users.find((u) => u.id === user?.id)

  const [nome, setNome] = useState(profile?.name || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [telefone, setTelefone] = useState(profile?.phone || '')
  const [localizacao, setLocalizacao] = useState(profile?.location || '')

  function handleSave() {
    setCurrentScreen('profile')
  }

  if (!profile || !user) return null

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar title="Editar Perfil" onBack={() => setCurrentScreen('profile')} />

      <div className="flex-1 max-w-mobile mx-auto w-full">
        <div className="screen-padding pt-8 pb-8">
          <div className="flex flex-col items-center gap-2 mb-10 slide-up">
            <div className="relative">
              <Avatar name={profile.name} size="xl" />
              <div className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-soft border-2 border-white cursor-pointer hover:bg-primary-600 transition-colors">
                <Icon name="camera" size={14} />
              </div>
            </div>
            <p className="text-xs text-surface-400 font-medium mt-1">
              Toque para alterar foto
            </p>
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
              label="Email"
              placeholder="seu@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="mail"
            />
            <Input
              label="Telefone"
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

          <div className="mt-8">
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
