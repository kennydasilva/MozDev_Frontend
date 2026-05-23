import { useState } from 'react'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'

function Cadastro() {
  const { setUser, setCurrentScreen } = useApp()
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [aceitoTermos, setAceitoTermos] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setUser({ id: 1, name: nome, phone: telefone })
    setCurrentScreen('feed')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col screen-padding pt-16">
        <div className="flex flex-col items-center gap-2 slide-up">
          <Icon name="shield" size={40} color="#14b8a6" />
          <h1 className="text-xl font-bold text-primary-600">Rede Alerta</h1>
          <p className="text-sm text-surface-400">Criar conta</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 slide-up">
          <Input
            icon="user"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            icon="phone"
            placeholder="Número de telefone"
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <Input
            icon="lock"
            placeholder="Palavra-passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            icon="lock"
            placeholder="Confirmar palavra-passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label className="flex items-start gap-3 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={aceitoTermos}
              onChange={(e) => setAceitoTermos(e.target.checked)}
              className="mt-0.5 accent-primary-500"
            />
            <span className="text-sm text-surface-500 leading-relaxed">
              Aceito os{' '}
              <span className="text-primary-600 font-medium">termos e condi&ccedil;&otilde;es</span>
            </span>
          </label>

          <Button type="submit" className="mt-2">
            Criar conta
          </Button>
        </form>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentScreen('login')}
            className="text-sm text-primary-600 font-medium"
          >
            J&aacute; tem conta?{' '}
            <span className="underline underline-offset-2">Entrar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
