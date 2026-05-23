import { useState, useEffect, useRef } from 'react'
import AppBar from '../components/AppBar'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'
import { chats, users } from '../data/mockData'

function ChatConversation() {
  const { currentScreen, setCurrentScreen, user } = useApp()
  const chatId = parseInt(currentScreen.replace('chat-', ''), 10)
  const chat = chats.find((c) => c.id === chatId)
  const otherUser = chat ? users.find((u) => u.id === chat.userId) : null
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(chat?.messages || [])
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    if (!message.trim()) return
    const msg = {
      id: Date.now(),
      fromId: user?.id || 1,
      text: message.trim(),
      date: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, msg])
    setMessage('')
  }

  function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
  }

  function formatDateLabel(dateStr) {
    const d = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  function getDateKey(dateStr) {
    return new Date(dateStr).toLocaleDateString('pt-PT')
  }

  function groupByDate(msgs) {
    const groups = []
    let currentKey = null
    for (const m of msgs) {
      const key = getDateKey(m.date)
      if (key !== currentKey) {
        currentKey = key
        groups.push({ date: m.date, messages: [] })
      }
      groups[groups.length - 1].messages.push(m)
    }
    return groups
  }

  if (!chat || !otherUser) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <AppBar title="Conversa" onBack={() => setCurrentScreen('chat-list')} />
        <div className="flex-1 flex items-center justify-center text-sm text-surface-400">
          Conversa não encontrada
        </div>
      </div>
    )
  }

  const grouped = groupByDate(messages)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar
        title={otherUser.name}
        subtitle="Online"
        onBack={() => setCurrentScreen('chat-list')}
      />

      <div className="flex-1 overflow-y-auto bg-surface-50 pb-28">
        <div className="screen-padding py-4">
          {grouped.map((group) => (
            <div key={group.date}>
              <div className="flex items-center justify-center my-4">
                <span className="text-[11px] font-medium text-surface-400 bg-surface-100 px-3 py-1 rounded-full">
                  {formatDateLabel(group.date)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {group.messages.map((m) => {
                  const isSent = m.fromId === (user?.id || 1)
                  return (
                    <div key={m.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[80%]">
                        <div
                          className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                            isSent
                              ? 'bg-primary-500 text-white rounded-2xl rounded-br-sm'
                              : 'bg-white text-surface-800 rounded-2xl rounded-bl-sm shadow-soft border border-surface-100'
                          }`}
                        >
                          {m.text}
                        </div>
                        <p className={`text-[10px] text-surface-400 mt-0.5 ${isSent ? 'text-right mr-1' : 'text-left ml-1'}`}>
                          {formatTime(m.date)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-surface-100">
        <div className="px-4 pt-2 pb-1">
          <button className="flex items-center gap-1.5 text-xs text-primary-500 font-medium hover:underline mb-2">
            <Icon name="sendTip" size={14} />
            Partilhar pista
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 pb-3">
          <button className="w-9 h-9 rounded-full bg-surface-100 text-surface-500 flex items-center justify-center hover:bg-surface-200 transition-colors shrink-0" aria-label="Anexar imagem">
            <Icon name="image" size={18} />
          </button>
          <input
            className="flex-1 bg-surface-50 border border-surface-200 rounded-full px-4 py-2.5 text-sm text-surface-800 placeholder-surface-400 outline-none"
            placeholder="Escreva uma mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shrink-0"
            aria-label="Enviar"
          >
            <Icon name="send" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatConversation
