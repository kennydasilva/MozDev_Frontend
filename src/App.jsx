import { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import HamburgerMenu from "./components/HamburgerMenu";

import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Feed from "./pages/Feed";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import CreatePublication from "./pages/CreatePublication";
import EditPublication from "./pages/EditPublication";
import Comments from "./pages/Comments";
import ChatList from "./pages/ChatList";
import ChatConversation from "./pages/ChatConversation";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyPublications from "./pages/MyPublications";
import SendTip from "./pages/SendTip";
import FoundCase from "./pages/FoundCase";
import Settings from "./pages/Settings";

function Router() {
  const { currentScreen } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  const renderScreen = () => {
    const screen = currentScreen;

    if (screen === "splash") return <SplashScreen />;
    if (screen === "onboarding") return <Onboarding />;
    if (screen === "login") return <Login />;
    if (screen === "cadastro") return <Cadastro />;

    if (screen === "feed") return <Feed />;
    if (screen === "search") return <Search />;
    if (screen === "create") return <CreatePublication />;

    if (screen?.startsWith("detail-")) return <Detail />;
    if (screen?.startsWith("edit-")) return <EditPublication />;
    if (screen?.startsWith("comments-")) return <Comments />;
    if (screen?.startsWith("send-tip-")) return <SendTip />;
    if (screen?.startsWith("found-")) return <FoundCase />;

    if (screen === "chat-list") return <ChatList />;
    if (screen?.startsWith("chat-")) return <ChatConversation />;
    if (screen === "notifications") return <Notifications />;
    if (screen === "profile") return <Profile />;
    if (screen === "edit-profile") return <EditProfile />;
    if (screen === "my-publications") return <MyPublications />;
    if (screen === "settings") return <Settings />;

    return <Feed />;
  };

  return (
    <div className="app-container">
      <HamburgerMenu />
      <div className="slide-up min-h-screen">
        {renderScreen()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
