import { useState, useMemo, useRef, useEffect } from 'react'
import Icon from '../components/Icon'
import StatusBadge from '../components/StatusBadge'
import BottomNav from '../components/BottomNav'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import { alerts, locations } from '../data/mockData'
import { feedAlerts } from '../data/feedMockData'

const statusLabels = {
  desaparecido: 'Desaparecido',
  encontrado: 'Encontrado',
  'em-verificacao': 'Em verificação',
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function getAlertPhoto(alert) {
  if (alert.photo) return alert.photo
  const match = feedAlerts.find((f) => f.id === alert.id)
  return match?.photo || null
}

function SearchCard({ alert, onClick }) {
  const photo = getAlertPhoto(alert)
  const isUrgent = alert.urgency === 'urgente'

  return (
    <button
      onClick={() => onClick?.(alert)}
      className="w-full flex items-center gap-3 bg-white rounded-2xl shadow-soft p-3 text-left active:scale-[0.99] transition-transform relative overflow-hidden"
      aria-label={`Alerta: ${alert.name}`}
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-100 shrink-0">
        {photo ? (
          <img src={photo} alt={alert.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <span className="text-xs font-bold text-primary-600">
              {getInitials(alert.name)}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-bold text-surface-800 truncate">
            {alert.name}
          </h4>
          {isUrgent && (
            <span className="w-1.5 h-1.5 rounded-full bg-alert-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-surface-400">
          <span>{alert.idade || alert.age} anos</span>
          <span className="w-1 h-1 rounded-full bg-surface-300" />
          <span>{alert.sexo}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-surface-500">
          <Icon name="location" size={11} className="text-surface-300 shrink-0" />
          <span className="truncate">{alert.lastSeen}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-surface-400">
          <Icon name="calendar" size={10} className="text-surface-300 shrink-0" />
          <span>{alert.dateMissing}</span>
        </div>
      </div>

      <StatusBadge
        status={alert.status}
        size="sm"
        variant={alert.status === 'desaparecido' ? 'plain' : 'chip'}
      />
    </button>
  )
}

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'desaparecido', label: 'Desaparecido' },
  { value: 'encontrado', label: 'Encontrado' },
  { value: 'em-verificacao', label: 'Em verificação' },
]

const ageOptions = [
  { value: '', label: 'Todas' },
  { value: '0-17', label: '0-17 anos' },
  { value: '18-30', label: '18-30 anos' },
  { value: '31-45', label: '31-45 anos' },
  { value: '46-60', label: '46-60 anos' },
  { value: '61+', label: '61+ anos' },
]

function Search() {
  const { setCurrentScreen } = useApp()
  const [query, setQuery] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [filters, setFilters] = useState({
    provincia: '',
    distrito: '',
    status: '',
    faixaEtaria: '',
    sexo: '',
  })
  const [sortKey, setSortKey] = useState('recent')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const provincias = locations.map((l) => l.provincia)
  const distritos = locations.find((l) => l.provincia === filters.provincia)?.distritos ?? []

  const filteredAlerts = useMemo(() => {
    let list = [...alerts]

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.lastSeen.toLowerCase().includes(q) ||
          String(a.idade || a.age).includes(q)
      )
    }

    if (filters.provincia) {
      list = list.filter((a) => a.lastSeen.toLowerCase().includes(filters.provincia.toLowerCase()))
    }
    if (filters.distrito) {
      list = list.filter((a) => a.lastSeen.toLowerCase().includes(filters.distrito.toLowerCase()))
    }
    if (filters.status) {
      list = list.filter((a) => a.status === filters.status)
    }
    if (filters.sexo) {
      list = list.filter((a) => a.sexo === filters.sexo)
    }
    if (filters.faixaEtaria) {
      const [min, max] = filters.faixaEtaria.split('-').map(Number)
      list = list.filter((a) => {
        const age = a.idade || a.age
        return max ? age >= min && age <= max : age >= min
      })
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

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function hasActiveFilters() {
    return Object.values(filters).some((v) => v !== '')
  }

  function clearFilters() {
    setFilters({ provincia: '', distrito: '', status: '', faixaEtaria: '', sexo: '' })
    setQuery('')
    setSortKey('recent')
    if (inputRef.current) inputRef.current.focus()
  }

  function SelectFilter({ label, value, onChange, options, placeholder }) {
    return (
      <div className="flex-1 min-w-0">
        <label className="text-[11px] font-medium text-surface-400 mb-1 block">{label}</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-surface-200 rounded-xl px-3 py-2 text-sm text-surface-700 appearance-none cursor-pointer outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
        >
          <option value="">{placeholder || 'Todos'}</option>
          {options.map((opt) => {
            const val = opt.value ?? opt
            const lbl = opt.label ?? opt
            return (
              <option key={val} value={val}>{lbl}</option>
            )
          })}
        </select>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      <div className="sticky top-0 z-30 bg-white border-b border-surface-100">
        <div className="px-5 pt-4 pb-3">
          <h1 className="text-lg font-bold text-surface-900 mb-3">Pesquisar alertas</h1>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
              <Icon name="search" size={18} />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Pesquisar por nome, local ou idade"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-surface-50 border border-surface-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-surface-800 placeholder-surface-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              aria-label="Pesquisar por nome, local ou idade"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="px-5 pb-3 flex gap-2">
          <SelectFilter
            label="Província"
            value={filters.provincia}
            onChange={(v) => setFilter('provincia', v)}
            options={provincias}
            placeholder="Todas"
          />
          <SelectFilter
            label="Distrito"
            value={filters.distrito}
            onChange={(v) => setFilter('distrito', v)}
            options={distritos}
            placeholder={filters.provincia ? 'Selecionar' : '-'}
          />
          <SelectFilter
            label="Estado"
            value={filters.status}
            onChange={(v) => setFilter('status', v)}
            options={statusOptions}
            placeholder="Todos"
          />
          <div className="flex items-end pb-0.5">
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap ${
                showMore || filters.faixaEtaria || filters.sexo
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-white border-surface-200 text-surface-500 hover:bg-surface-50'
              }`}
            >
              <Icon name="filter" size={14} />
              Mais
            </button>
          </div>
        </div>

        {showMore && (
          <div className="px-5 pb-3 flex gap-2 fade-in">
            <SelectFilter
              label="Idade"
              value={filters.faixaEtaria}
              onChange={(v) => setFilter('faixaEtaria', v)}
              options={ageOptions}
              placeholder="Todas"
            />
            <SelectFilter
              label="Género"
              value={filters.sexo}
              onChange={(v) => setFilter('sexo', v)}
              options={['Masculino', 'Feminino']}
              placeholder="Todos"
            />
            <div className="flex items-end gap-1">
              {['recent', 'urgentes'].map((key) => (
                <button
                  key={key}
                  onClick={() => setSortKey(key)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap ${
                    sortKey === key
                      ? 'bg-surface-800 border-surface-800 text-white'
                      : 'bg-white border-surface-200 text-surface-500 hover:bg-surface-50'
                  }`}
                >
                  {key === 'recent' ? 'Recentes' : 'Urgentes'}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasActiveFilters() && (
          <div className="px-5 pb-3">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-medium text-alert-500 hover:text-alert-600 transition-colors"
            >
              <Icon name="close" size={12} />
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      <div className="screen-padding pt-4 pb-6">
        {filteredAlerts.length === 0 ? (
          <div className="pt-10">
            <EmptyState
              icon="search"
              title="Nenhum alerta encontrado"
              description="Tente ajustar os filtros ou pesquisar por outro termo."
            />
          </div>
        ) : (
          <>
            <p className="text-xs text-surface-400 font-medium mb-3">
              {filteredAlerts.length} alerta{filteredAlerts.length !== 1 ? 's' : ''} encontrado{filteredAlerts.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-col gap-3">
              {filteredAlerts.map((alert) => (
                <SearchCard
                  key={alert.id}
                  alert={alert}
                  onClick={(a) => setCurrentScreen(`detail-${a.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav
        active="pesquisar"
        onNavigate={(key) => {
          const map = { inicio: 'feed', pesquisar: 'search', publicar: 'create', notificacoes: 'notifications', perfil: 'profile' }
          setCurrentScreen(map[key] || key)
        }}
      />
    </div>
  )
}

export default Search
