import { useState, useEffect, useRef } from 'react'
import AppBar from '../components/AppBar'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'
import { chats, users } from '../data/mockData'

function ChatConversation() {
  const { currentScreen, setCurrentScreen, goBack, user } = useApp()
  const endRef = useRef(null)
  const inputRef = useRef(null)

  const isDirectChat = currentScreen.startsWith('chat-user-')
  const userId = isDirectChat ? Number(currentScreen.replace('chat-user-', '')) : 0
  const chatId = !isDirectChat ? Number(currentScreen.replace('chat-', '')) || 0 : 0

  const existingChat = !isDirectChat ? chats.find((c) => c.id === chatId) : null
  const otherUser = existingChat
    ? users.find((u) => u.id === existingChat.userId)
    : users.find((u) => u.id === userId)

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(existingChat?.messages || [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function formatTime(dateStr) {
    try { return new Date(dateStr).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) }
    catch { return dateStr }
  }

  function formatDateLabel(dateStr) {
    try {
      const d = new Date(dateStr)
      const now = new Date()
      const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
      if (diffDays === 0) return 'Hoje'
      if (diffDays === 1) return 'Ontem'
      return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' })
    } catch { return '' }
  }

  function getDateKey(dateStr) {
    try { return new Date(dateStr).toLocaleDateString('pt-PT') }
    catch { return dateStr }
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

  function handleBack() { goBack() }

  if (!otherUser) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <AppBar title="Conversa" onBack={handleBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="messageCircle" size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500 font-medium">Conversa não encontrada</p>
          </div>
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
        onBack={handleBack}
      />

      <div className="flex-1 overflow-y-auto bg-surface-50 pb-36">
        <div className="screen-padding py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar name={otherUser.name} size="lg" />
              <p className="text-sm font-semibold text-surface-800">{otherUser.name}</p>
              <span className="text-[11px] text-success-600 font-medium bg-success-50 px-3 py-0.5 rounded-full">Online</span>
            </div>
          </div>

          {isDirectChat && messages.length === 0 && (
            <div className="text-center mb-6">
              <div className="bg-white rounded-2xl shadow-soft p-5 border border-surface-100">
                <Icon name="messageCircle" size={28} className="text-primary-400 mx-auto mb-2" />
                <p className="text-sm text-surface-600 leading-relaxed">
                  Esta é uma conversa com <strong>{otherUser.name}</strong> sobre esta publicação.
                  Envie a sua primeira mensagem.
                </p>
              </div>
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.date}>
              <div className="flex items-center justify-center my-4">
                <span className="text-[11px] font-medium text-surface-400 bg-white px-3 py-1 rounded-full shadow-soft">
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

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-surface-100 z-40">
        <div className="flex items-center gap-2 px-4 py-3">
          <input
            ref={inputRef}
            className="flex-1 bg-surface-50 border border-surface-200 rounded-full px-4 py-2.5 text-sm text-surface-800 placeholder-surface-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            placeholder="Escreva uma mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shrink-0 shadow-soft"
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
