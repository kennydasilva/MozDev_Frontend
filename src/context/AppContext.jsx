import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (screen) => {
    setMenuOpen(false);
    setCurrentScreen(screen);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentScreen,
        setCurrentScreen,
        onboardingDone,
        setOnboardingDone,
        menuOpen,
        setMenuOpen,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
