import { useState } from 'react'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Button from '../components/Button'
import AppBar from '../components/AppBar'
import PhotoUpload from '../components/PhotoUpload'
import { useApp } from '../context/AppContext'
import { alerts, locations } from '../data/mockData'

function EditPublication() {
  const { currentScreen, setCurrentScreen } = useApp()
  const alertId = parseInt(currentScreen.replace('edit-', ''), 10)
  const alert = alerts.find((a) => a.id === alertId)

  const [status, setStatus] = useState(alert?.status || 'desaparecido')
  const [foundDate, setFoundDate] = useState(alert?.foundDate?.split('T')[0] || '')
  const [showFoundDate, setShowFoundDate] = useState(
    alert?.status === 'encontrado'
  )

  const [form, setForm] = useState({
    nome: alert?.name || '',
    idade: alert?.age?.toString() || '',
    sexo: alert?.sexo || '',
    ultimoLocal: alert?.lastSeen || '',
    provincia: '',
    distrito: '',
    dataDesaparecimento: alert?.dateMissing || '',
    caracteristicas: alert?.physicalDesc || '',
    roupa: alert?.clothing || '',
    descricao: alert?.description || '',
    contacto: alert?.contact || '',
    foto: alert?.photo || null,
  })

  const provincias = locations.map((l) => l.provincia)
  const distritos = form.provincia
    ? locations.find((l) => l.provincia === form.provincia)?.distritos || []
    : []

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'provincia' ? { distrito: '' } : {}),
    }))
  }

  function handleMarkFound() {
    setShowFoundDate(true)
    if (status !== 'encontrado') {
      setStatus('encontrado')
    }
  }

  function handleSave() {
    setCurrentScreen('feed')
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <AppBar title="Editar Alerta" onBack={() => setCurrentScreen('feed')} />
        <div className="flex-1 flex items-center justify-center screen-padding">
          <div className="text-center">
            <Icon name="alert" size={48} className="text-surface-300 mx-auto mb-3" />
            <p className="text-surface-500 font-medium">
              Alerta não encontrado
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar
        title="Editar Alerta"
        onBack={() => setCurrentScreen('feed')}
        subtitle={alert.name}
      />

      <div className="flex-1 screen-padding pt-6 pb-8 max-w-mobile mx-auto w-full">
        <div className="slide-up">
          <h2 className="text-lg font-bold text-surface-800 mb-1">
            Estado do caso
          </h2>
          <p className="text-sm text-surface-500 mb-4">
            Atualize o status do alerta
          </p>

          <div className="flex gap-2 mb-6">
            {[
              { key: 'desaparecido', label: 'Activo', color: 'alert' },
              { key: 'encontrado', label: 'Encontrado', color: 'success' },
              { key: 'encerrado', label: 'Encerrado', color: 'surface' },
            ].map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => {
                  setStatus(chip.key)
                  if (chip.key === 'encontrado') {
                    setShowFoundDate(true)
                  } else {
                    setShowFoundDate(false)
                    setFoundDate('')
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                  status === chip.key
                    ? chip.color === 'alert'
                      ? 'border-alert-500 bg-alert-50 text-alert-600'
                      : chip.color === 'success'
                      ? 'border-success-500 bg-success-50 text-success-600'
                      : 'border-surface-400 bg-surface-100 text-surface-600'
                    : 'border-surface-200 bg-white text-surface-500 hover:border-surface-300'
                }`}
              >
                {chip.key === 'encontrado' && (
                  <Icon name="checkCircle" size={14} className="inline mr-1" />
                )}
                {chip.label}
              </button>
            ))}
          </div>

          {showFoundDate && (
            <div className="mb-6 slide-up">
              <Input
                label="Data que foi encontrado(a)"
                type="date"
                value={foundDate}
                onChange={(e) => setFoundDate(e.target.value)}
                icon="calendar"
              />
            </div>
          )}

          <h2 className="text-lg font-bold text-surface-800 mb-1">
            Informações
          </h2>
          <p className="text-sm text-surface-500 mb-6">
            Edite os dados do alerta
          </p>

          <div className="flex flex-col gap-4">
            <Input
              label="Nome da pessoa"
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) => setField('nome', e.target.value)}
              icon="user"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Idade aproximada"
                placeholder="Ex: 25"
                type="number"
                value={form.idade}
                onChange={(e) => setField('idade', e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">
                  Sexo
                </label>
                <select
                  value={form.sexo}
                  onChange={(e) => setField('sexo', e.target.value)}
                  className="input-field appearance-none cursor-pointer"
                  aria-label="Sexo"
                >
                  <option value="">Selecionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
            </div>

            <Input
              label="Último local visto"
              placeholder="Ex: Bairro da Polana, Maputo"
              value={form.ultimoLocal}
              onChange={(e) => setField('ultimoLocal', e.target.value)}
              icon="location"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">
                  Província
                </label>
                <select
                  value={form.provincia}
                  onChange={(e) => setField('provincia', e.target.value)}
                  className="input-field appearance-none cursor-pointer"
                  aria-label="Província"
                >
                  <option value="">Selecionar</option>
                  {provincias.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">
                  Distrito
                </label>
                <select
                  value={form.distrito}
                  onChange={(e) => setField('distrito', e.target.value)}
                  className="input-field appearance-none cursor-pointer"
                  aria-label="Distrito"
                  disabled={!form.provincia}
                >
                  <option value="">Selecionar</option>
                  {distritos.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Data do desaparecimento"
              type="date"
              value={form.dataDesaparecimento}
              onChange={(e) => setField('dataDesaparecimento', e.target.value)}
              icon="calendar"
            />

            <Input
              label="Características físicas"
              placeholder="Ex: 1.60m, cabelo crespo preto, olhos castanhos"
              value={form.caracteristicas}
              onChange={(e) => setField('caracteristicas', e.target.value)}
              multiline
              rows={3}
            />

            <Input
              label="Roupa / itens visíveis"
              placeholder="Ex: Vestido azul claro, sandálias brancas"
              value={form.roupa}
              onChange={(e) => setField('roupa', e.target.value)}
              multiline
              rows={2}
            />

            <Input
              label="Descrição adicional"
              placeholder="Circunstâncias do desaparecimento, informações relevantes..."
              value={form.descricao}
              onChange={(e) => setField('descricao', e.target.value)}
              multiline
              rows={3}
            />

            <Input
              label="Contacto do responsável"
              placeholder="+258 84 000 0000"
              type="tel"
              value={form.contacto}
              onChange={(e) => setField('contacto', e.target.value)}
              icon="phone"
            />

            <div>
              <label className="text-sm font-medium text-surface-700 mb-1.5 block">
                Foto da pessoa
              </label>
              <PhotoUpload
                currentImage={form.foto}
                onUpload={(file) =>
                  setField('foto', URL.createObjectURL(file))
                }
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button onClick={handleSave}>
              Salvar alterações
            </Button>
            <Button
              variant="secondary"
              onClick={handleMarkFound}
              className={status === 'encontrado' ? '!border-success-500 !text-success-600' : ''}
            >
              <Icon name="checkCircle" size={16} />
              Marcar como encontrado
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPublication
