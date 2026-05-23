import { useState, useMemo, useEffect } from 'react'
import Input from '../components/Input'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/StatusBadge'
import BottomNav from '../components/BottomNav'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import { alerts, locations } from '../data/mockData'

const sexOptions = ['Masculino', 'Feminino']
const statusOptions = ['desaparecido', 'encontrado', 'em-verificacao']
const ageRanges = [
  { label: 'Criança (0-12)', min: 0, max: 12 },
  { label: 'Adolescente (13-17)', min: 13, max: 17 },
  { label: 'Jovem (18-30)', min: 18, max: 30 },
  { label: 'Adulto (31-60)', min: 31, max: 60 },
  { label: 'Idoso (60+)', min: 61, max: 150 },
]
const sortOptions = [
  { key: 'recent', label: 'Mais recentes' },
  { key: 'proximos', label: 'Mais próximos' },
  { key: 'urgentes', label: 'Urgentes' },
]

const filterChips = [
  { key: 'provincia', label: 'Província' },
  { key: 'distrito', label: 'Distrito' },
  { key: 'sexo', label: 'Sexo' },
  { key: 'faixaEtaria', label: 'Faixa etária' },
  { key: 'status', label: 'Status' },
]

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function CompactAlertCard({ alert, onClick }) {
  const isUrgent = alert.urgency === 'urgente' || alert.urgency === 'alta'

  return (
    <button
      onClick={() => onClick?.(alert)}
      className={`w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-soft mb-3 text-left active:scale-[0.99] transition-transform ${
        isUrgent ? 'border-l-4 border-l-alert-500' : ''
      }`}
      aria-label={`Alerta: ${alert.name}`}
    >
      <Avatar name={alert.name} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="font-bold text-surface-800 text-sm truncate">
            {alert.name}
          </h4>
          {isUrgent && (
            <span className="w-2 h-2 rounded-full bg-alert-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-400">
          <span>{alert.idade || alert.age} anos</span>
          <span className="w-1 h-1 rounded-full bg-surface-300" />
          <span className="truncate">{alert.lastSeen}</span>
        </div>
      </div>
      <StatusBadge status={alert.status} size="sm" />
    </button>
  )
}

function Search() {
  const { setCurrentScreen, setMenuOpen } = useApp()
  const [query, setQuery] = useState('')
  const [activeChip, setActiveChip] = useState(null)
  const [filters, setFilters] = useState({
    provincia: '',
    distrito: '',
    sexo: '',
    faixaEtaria: '',
    status: '',
  })
  const [sortKey, setSortKey] = useState('recent')

  useEffect(() => {
    const el = document.querySelector('[aria-label="Pesquisar por nome, local..."]')
    if (el) el.focus()
  }, [])

  const provincias = locations.map((l) => l.provincia)
  const distritos = locations.find(
    (l) => l.provincia === filters.provincia
  )?.distritos ?? []

  const filteredAlerts = useMemo(() => {
    let list = [...alerts]

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.lastSeen.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q)
      )
    }

    if (filters.provincia) {
      list = list.filter((a) =>
        a.lastSeen.toLowerCase().includes(filters.provincia.toLowerCase())
      )
    }

    if (filters.distrito) {
      list = list.filter((a) =>
        a.lastSeen.toLowerCase().includes(filters.distrito.toLowerCase())
      )
    }

    if (filters.sexo) {
      list = list.filter((a) => a.sexo === filters.sexo)
    }

    if (filters.faixaEtaria) {
      const range = ageRanges.find((r) => r.label === filters.faixaEtaria)
      if (range) {
        list = list.filter(
          (a) => (a.idade || a.age) >= range.min && (a.idade || a.age) <= range.max
        )
      }
    }

    if (filters.status) {
      list = list.filter((a) => a.status === filters.status)
    }

    switch (sortKey) {
      case 'urgentes':
        list.sort((a, b) => {
          const order = { urgente: 0, alta: 1, media: 2, baixa: 3 }
          return (order[a.urgency] ?? 3) - (order[b.urgency] ?? 3)
        })
        break
      case 'recent':
      default:
        list.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
    }

    return list
  }, [query, filters, sortKey])

  function handleChipClick(key) {
    setActiveChip(activeChip === key ? null : key)
  }

  function handleFilterSelect(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setActiveChip(null)
  }

  function handleClearFilters() {
    setFilters({ provincia: '', distrito: '', sexo: '', faixaEtaria: '', status: '' })
    setQuery('')
    setSortKey('recent')
  }

  function getChipLabel(key) {
    if (!filters[key]) return filterChips.find((c) => c.key === key)?.label
    if (key === 'faixaEtaria') {
      const range = ageRanges.find((r) => r.label === filters[key])
      return range ? range.label.split(' (')[0] : filters[key]
    }
    return filters[key]
  }

  function hasActiveFilters() {
    return Object.values(filters).some((v) => v !== '')
  }

  function renderDropdown() {
    if (!activeChip) return null
    const chip = activeChip
    let options = []

    switch (chip) {
      case 'provincia':
        options = provincias
        break
      case 'distrito':
        options = distritos
        break
      case 'sexo':
        options = sexOptions
        break
      case 'faixaEtaria':
        options = ageRanges.map((r) => r.label)
        break
      case 'status':
        options = statusOptions.map((s) => {
          const labels = { desaparecido: 'Desaparecido', encontrado: 'Encontrado', 'em-verificacao': 'Em Verificação' }
          return labels[s] || s
        })
        break
    }

    return (
      <div className="mx-5 mb-3 bg-white rounded-2xl shadow-soft-lg border border-surface-100 overflow-hidden animate-fadeIn">
        <div className="p-2">
          {options.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-3">
              {filters.provincia ? 'Seleccione uma província primeiro' : 'Nenhuma opção disponível'}
            </p>
          ) : (
            options.map((opt) => {
              const isSelected = filters[chip] === opt
              return (
                <button
                  key={opt}
                  onClick={() => handleFilterSelect(chip, isSelected ? '' : opt)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                    isSelected
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary-500 bg-primary-500' : 'border-surface-300'
                    }`}
                  >
                    {isSelected && <Icon name="check" size={12} className="text-white" />}
                  </span>
                  {opt}
                </button>
              )
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-surface-100">
        <div className="flex items-center gap-2 screen-padding pt-3 pb-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-100 active:bg-surface-200 transition-colors shrink-0"
            aria-label="Abrir menu"
          >
            <Icon name="menu" size={22} />
          </button>
          <div className="flex-1">
            <Input
              icon="search"
              placeholder="Pesquisar por nome, local..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide px-5 pb-3">
          <div className="flex items-center gap-2 min-w-max">
            {filterChips.map((chip) => {
              const isActive = activeChip === chip.key
              const hasValue = !!filters[chip.key]
              return (
                <button
                  key={chip.key}
                  onClick={() => handleChipClick(chip.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive || hasValue
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                  }`}
                  aria-pressed={isActive || hasValue}
                >
                  {getChipLabel(chip.key)}
                  {hasValue && (
                    <Icon name="close" size={12} />
                  )}
                </button>
              )
            })}
            <div className="w-px h-5 bg-surface-200 mx-1" />
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  sortKey === opt.key
                    ? 'bg-surface-800 text-white'
                    : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
            {hasActiveFilters() && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium text-alert-600 bg-alert-50 hover:bg-alert-100 whitespace-nowrap transition-colors"
              >
                <Icon name="close" size={12} />
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {renderDropdown()}

      <div className="screen-padding pt-2 pb-28">
        {filteredAlerts.length === 0 ? (
          <EmptyState
            icon="search"
            title="Nenhum resultado encontrado"
            description="Tente ajustar os filtros ou pesquisar por outro termo."
          />
        ) : (
          <>
            <p className="text-xs text-surface-400 font-medium mb-3">
              {filteredAlerts.length}{' '}
              {filteredAlerts.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
            {filteredAlerts.map((alert) => (
              <CompactAlertCard
                key={alert.id}
                alert={alert}
                onClick={(a) => setCurrentScreen(`detail-${a.id}`)}
              />
            ))}
          </>
        )}
      </div>

      <BottomNav active="pesquisar" onNavigate={(key) => { const map = { inicio: 'feed', pesquisar: 'search', publicar: 'create', notificacoes: 'notifications', perfil: 'profile' }; setCurrentScreen(map[key] || key); }} />
    </div>
  )
}

export default Search
