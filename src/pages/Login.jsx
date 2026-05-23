import { useState } from 'react'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'
import avatarImg from '../assets/shelton.jpeg'

function Login() {
  const { setUser, setCurrentScreen } = useApp()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin() {
    setUser({ id: 1, name: 'Maria João', phone: '+258 84 123 4567', avatar: avatarImg })
    setCurrentScreen('feed')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col screen-padding pt-16">
        <div className="flex flex-col items-center gap-2 slide-up">
          <Icon name="shield" size={40} color="#14b8a6" />
          <h1 className="text-xl font-bold text-primary-600">Rede Alerta</h1>
          <p className="text-sm text-surface-400 text-center">
            Aceda para publicar, acompanhar e ajudar
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-12 slide-up">
          <Input
            icon="phone"
            placeholder="Número de telefone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            icon="lock"
            placeholder="Palavra-passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin}>Entrar</Button>
          <button className="text-sm text-primary-600 text-center font-medium">
            Esqueceu a palavra-passe?
          </button>
        </div>

        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-surface-200" />
          <span className="text-xs text-surface-400 font-medium">ou</span>
          <div className="flex-1 h-px bg-surface-200" />
        </div>

        <Button variant="secondary" onClick={() => setCurrentScreen('cadastro')}>
          Criar conta
        </Button>
      </div>

      <p className="text-center text-xs text-surface-400 pb-6">
        Rede Alerta &copy; 2026
      </p>
    </div>
  )
}

export default Login
