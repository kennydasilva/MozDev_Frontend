import { createContext, useContext, useState, useCallback, useRef } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previousScreen, setPreviousScreen] = useState(null);
  const screenRef = useRef(currentScreen)
  screenRef.current = currentScreen

  const changeScreen = useCallback((screen) => {
    setPreviousScreen(screenRef.current)
    setCurrentScreen(screen)
    setMenuOpen(false)
  }, [])

  const navigate = changeScreen

  const goBack = useCallback(() => {
    if (previousScreen) {
      changeScreen(previousScreen)
    }
  }, [previousScreen, changeScreen])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentScreen,
        setCurrentScreen: changeScreen,
        onboardingDone,
        setOnboardingDone,
        menuOpen,
        setMenuOpen,
        navigate,
        goBack,
        previousScreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
