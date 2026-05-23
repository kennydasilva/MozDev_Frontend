import { useState } from 'react'
import Avatar from '../components/Avatar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'
import { chats, users } from '../data/mockData'

function ChatList() {
  const { setCurrentScreen } = useApp()
  const [search, setSearch] = useState('')

  const filtered = chats.filter((chat) => {
    const u = users.find((user) => user.id === chat.userId)
    if (!u) return false
    return u.name.toLowerCase().includes(search.toLowerCase())
  })

  function formatTime(dateStr) {
    const d = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    if (diffDays === 1) return 'Ontem'
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })
  }

  function getUser(id) {
    return users.find((u) => u.id === id)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar title="Mensagens" showMenu />

      <div className="screen-padding pt-4 pb-2">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            <Icon name="search" size={18} />
          </div>
          <input
            className="w-full bg-surface-50 border border-surface-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-surface-800 placeholder-surface-400 outline-none"
            placeholder="Pesquisar conversas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="screen-padding">
          {filtered.length === 0 ? (
            <EmptyState
              icon="messageCircle"
              title="Nenhuma conversa"
              description="As suas mensagens aparecerão aqui."
            />
          ) : (
            <div className="flex flex-col">
              {filtered.map((chat, i) => {
                const u = getUser(chat.userId)
                if (!u) return null
                const isUnread = chat.unread > 0
                return (
                  <button
                    key={chat.id}
                    onClick={() => setCurrentScreen(`chat-${chat.id}`)}
                    className={`flex items-center gap-3 py-3.5 text-left transition-colors hover:bg-surface-50 -mx-5 px-5 ${
                      i < filtered.length - 1 ? 'border-b border-surface-100' : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar name={u.name} size="md" />
                      {isUnread && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm truncate ${
                            isUnread ? 'font-bold text-surface-800' : 'font-medium text-surface-800'
                          }`}
                        >
                          {u.name}
                        </span>
                        <span className="text-xs text-surface-400 shrink-0 ml-2">{formatTime(chat.lastDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-surface-400 truncate flex-1">{chat.lastMessage}</span>
                        {isUnread && (
                          <span className="bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight shrink-0">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav active="notificacoes" onNavigate={(key) => { const map = { inicio: 'feed', pesquisar: 'search', publicar: 'create', perfil: 'profile' }; setCurrentScreen(map[key] || key); }} />
    </div>
  )
}

export default ChatList
