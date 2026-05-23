import { useState } from 'react'
import Icon from '../components/Icon'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'

const slides = [
  {
    icon: 'users',
    title: 'Divulgue rapidamente',
    desc: 'Publique casos de pessoas desaparecidas e alcance a comunidade em segundos.',
  },
  {
    icon: 'messageCircle',
    title: 'Receba pistas',
    desc: 'Acompanhe actualizações e receba informações de quem pode ajudar.',
  },
  {
    icon: 'heart',
    title: 'Ajude a comunidade',
    desc: 'Faça parte da rede de solidariedade que ajuda a localizar pessoas desaparecidas.',
  },
]

function Onboarding() {
  const [current, setCurrent] = useState(0)
  const { setOnboardingDone, setCurrentScreen } = useApp()
  const isLast = current === slides.length - 1

  function handleNext() {
    if (isLast) {
      setOnboardingDone(true)
      setCurrentScreen('login')
    } else {
      setCurrent((prev) => prev + 1)
    }
  }

  function handleSkip() {
    setOnboardingDone(true)
    setCurrentScreen('login')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center screen-padding">
        <div className="flex flex-col items-center gap-6 slide-up max-w-xs">
          <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center">
            <Icon name={slides[current].icon} size={64} color="#14b8a6" />
          </div>
          <h2 className="text-xl font-bold text-surface-800 text-center">
            {slides[current].title}
          </h2>
          <p className="text-sm text-surface-400 text-center leading-relaxed">
            {slides[current].desc}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 screen-padding pb-12">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                i === current ? 'bg-primary-500' : 'bg-surface-300'
              }`}
            />
          ))}
        </div>

        <div className="w-full max-w-xs flex flex-col items-center gap-4">
          <Button onClick={handleNext}>
            {isLast ? 'Começar' : 'Continuar'}
          </Button>
          <button
            onClick={handleSkip}
            className="text-sm text-surface-400 underline underline-offset-2"
          >
            Ignorar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
