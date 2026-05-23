import { useEffect } from 'react'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'

function SplashScreen() {
  const { onboardingDone, setCurrentScreen } = useApp()

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen(onboardingDone ? 'feed' : 'onboarding')
    }, 2500)
    return () => clearTimeout(timer)
  }, [onboardingDone, setCurrentScreen])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-600 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 fade-in">
        <Icon name="shield" size={64} color="white" />
        <h1 className="text-white font-bold text-3xl">Rede Alerta</h1>
        <p className="text-white/80 text-sm">Cada minuto conta</p>
      </div>
    </div>
  )
}

export default SplashScreen
