import { useState } from 'react'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Button from '../components/Button'
import PhotoUpload from '../components/PhotoUpload'
import { useApp } from '../context/AppContext'
import { locations } from '../data/mockData'
import { savePublication } from '../services/storage'

const initialForm = {
  tipo: null,
  nome: '',
  idade: '',
  sexo: '',
  ultimoLocal: '',
  provincia: '',
  distrito: '',
  dataDesaparecimento: '',
  caracteristicas: '',
  roupa: '',
  descricao: '',
  contacto: '',
  foto: null,
}

function CreatePublication() {
  const { setCurrentScreen } = useApp()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...initialForm })
  const [errors, setErrors] = useState({})

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
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function validateStep1() {
    if (!form.tipo) {
      setErrors({ tipo: 'Selecione o tipo de alerta' })
      return false
    }
    return true
  }

  function validateStep2() {
    const errs = {}
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório'
    if (!form.contacto.trim()) errs.contacto = 'Contacto é obrigatório'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleContinue() {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1)
  }

  function handlePublish() {
    savePublication({
      name: form.nome,
      idade: form.idade ? Number(form.idade) : '',
      age: form.idade ? Number(form.idade) : '',
      sexo: form.sexo,
      lastSeen: form.ultimoLocal,
      dateMissing: form.dataDesaparecimento,
      physicalDesc: form.caracteristicas,
      clothing: form.roupa,
      description: form.descricao,
      contact: form.contacto,
      photo: form.foto,
      status: form.tipo === 'encontrado' ? 'encontrado' : 'desaparecido',
    })
    setCurrentScreen('feed')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-40 bg-white border-b border-surface-100">
        <div className="flex items-center justify-between h-14 screen-padding">
          <div className="w-9" />
          <h1 className="font-bold text-surface-800 text-base">
            Novo Alerta
          </h1>
          <button
            onClick={() => setCurrentScreen('feed')}
            className="text-sm text-surface-500 font-medium"
          >
            Cancelar
          </button>
        </div>
        <div className="screen-padding pb-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    s < step
                      ? 'bg-primary-500 text-white'
                      : s === step
                      ? 'bg-primary-500 text-white ring-2 ring-primary-200'
                      : 'bg-surface-200 text-surface-500'
                  }`}
                >
                  {s < step ? <Icon name="check" size={14} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                      s < step ? 'bg-primary-500' : 'bg-surface-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {['Tipo', 'Informações', 'Revisão'].map((label, i) => (
              <span
                key={label}
                className={`text-[11px] font-medium ${
                  i + 1 === step
                    ? 'text-primary-600'
                    : i + 1 < step
                    ? 'text-primary-500'
                    : 'text-surface-400'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 screen-padding pt-6 pb-8 max-w-mobile mx-auto w-full">
        {step === 1 && (
          <div className="slide-up">
            <h2 className="text-lg font-bold text-surface-800 mb-1">
              Tipo de Alerta
            </h2>
            <p className="text-sm text-surface-500 mb-6">
              Selecione o tipo de alerta que deseja publicar
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setField('tipo', 'desaparecido')}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
                  form.tipo === 'desaparecido'
                    ? 'border-alert-500 ring-2 ring-alert-100 bg-alert-50/30'
                    : 'border-surface-200 bg-white hover:border-surface-300'
                }`}
              >
                {form.tipo === 'desaparecido' && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-alert-500 flex items-center justify-center">
                    <Icon name="check" size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    form.tipo === 'desaparecido'
                      ? 'bg-alert-100'
                      : 'bg-surface-100'
                  }`}
                >
                  <Icon
                    name="user"
                    size={28}
                    className={
                      form.tipo === 'desaparecido'
                        ? 'text-alert-600'
                        : 'text-surface-400'
                    }
                  />
                </div>
                <span
                  className={`text-sm font-bold text-center ${
                    form.tipo === 'desaparecido'
                      ? 'text-alert-700'
                      : 'text-surface-600'
                  }`}
                >
                  Pessoa Desaparecida
                </span>
                <span className="text-[11px] text-surface-400 text-center leading-relaxed">
                  Alguém que não foi visto e precisa ser localizado
                </span>
              </button>

              <button
                type="button"
                onClick={() => setField('tipo', 'encontrado')}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
                  form.tipo === 'encontrado'
                    ? 'border-success-500 ring-2 ring-success-100 bg-success-50/30'
                    : 'border-surface-200 bg-white hover:border-surface-300'
                }`}
              >
                {form.tipo === 'encontrado' && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-success-500 flex items-center justify-center">
                    <Icon name="check" size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    form.tipo === 'encontrado'
                      ? 'bg-success-100'
                      : 'bg-surface-100'
                  }`}
                >
                  <Icon
                    name="checkCircle"
                    size={28}
                    className={
                      form.tipo === 'encontrado'
                        ? 'text-success-600'
                        : 'text-surface-400'
                    }
                  />
                </div>
                <span
                  className={`text-sm font-bold text-center ${
                    form.tipo === 'encontrado'
                      ? 'text-success-700'
                      : 'text-surface-600'
                  }`}
                >
                  Pessoa Encontrada
                </span>
                <span className="text-[11px] text-surface-400 text-center leading-relaxed">
                  Alguém foi localizado e está em segurança
                </span>
              </button>
            </div>

            {errors.tipo && (
              <p className="mt-3 text-xs text-alert-500 font-medium flex items-center gap-1">
                <Icon name="alert" size={14} />
                {errors.tipo}
              </p>
            )}

            <div className="mt-8">
              <Button
                onClick={handleContinue}
                disabled={!form.tipo}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="slide-up">
            <h2 className="text-lg font-bold text-surface-800 mb-1">
              Informações
            </h2>
            <p className="text-sm text-surface-500 mb-6">
              Preencha os dados da pessoa
            </p>

            <div className="flex flex-col gap-4">
              <Input
                label="Nome da pessoa *"
                placeholder="Nome completo"
                value={form.nome}
                onChange={(e) => setField('nome', e.target.value)}
                icon="user"
                error={errors.nome}
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
                label="Contacto do responsável *"
                placeholder="+258 84 000 0000"
                type="tel"
                value={form.contacto}
                onChange={(e) => setField('contacto', e.target.value)}
                icon="phone"
                error={errors.contacto}
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

            <div className="flex gap-3 mt-8">
              <Button variant="secondary" onClick={handleBack} fullWidth={false}>
                <span className="flex items-center justify-center gap-1">
                  <Icon name="arrowLeft" size={16} />
                  Voltar
                </span>
              </Button>
              <Button onClick={handleContinue}>
                Continuar
                <Icon name="arrowRight" size={16} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="slide-up">
            <h2 className="text-lg font-bold text-surface-800 mb-1">
              Revisão
            </h2>
            <p className="text-sm text-surface-500 mb-6">
              Verifique as informações antes de publicar
            </p>

            <div className="card p-5 divide-y divide-surface-100">
              {form.foto && (
                <div className="pb-4 mb-4">
                  <img
                    src={form.foto}
                    alt="Foto da pessoa"
                    className="w-full aspect-[4/3] object-cover rounded-2xl"
                  />
                </div>
              )}

              <div className="py-3 first:pt-0">
                <span className="text-xs text-surface-400 uppercase tracking-wider font-medium">
                  Tipo de Alerta
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      form.tipo === 'desaparecido'
                        ? 'bg-alert-500'
                        : 'bg-success-500'
                    }`}
                  />
                  <span className="text-sm font-semibold text-surface-800">
                    {form.tipo === 'desaparecido'
                      ? 'Pessoa Desaparecida'
                      : 'Pessoa Encontrada'}
                  </span>
                </div>
              </div>

              <Section title="Nome">
                {form.nome || '—'}
              </Section>

              <Section title="Idade aproximada">
                {form.idade ? `${form.idade} anos` : '—'}
              </Section>

              <Section title="Sexo">
                {form.sexo || '—'}
              </Section>

              <Section title="Último local visto">
                {form.ultimoLocal || '—'}
              </Section>

              <Section title="Província / Distrito">
                {form.provincia
                  ? `${form.provincia}${form.distrito ? `, ${form.distrito}` : ''}`
                  : '—'}
              </Section>

              <Section title="Data do desaparecimento">
                {form.dataDesaparecimento
                  ? new Date(form.dataDesaparecimento).toLocaleDateString(
                      'pt-MZ'
                    )
                  : '—'}
              </Section>

              <Section title="Características físicas">
                {form.caracteristicas || '—'}
              </Section>

              <Section title="Roupa / itens visíveis">
                {form.roupa || '—'}
              </Section>

              <Section title="Descrição adicional">
                {form.descricao || '—'}
              </Section>

              <Section title="Contacto">
                {form.contacto || '—'}
              </Section>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Button onClick={handlePublish}>
                Publicar alerta
              </Button>
              <button
                onClick={handleBack}
                className="text-sm text-surface-500 font-medium text-center py-2"
              >
                Voltar para editar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="py-3">
      <span className="text-xs text-surface-400 uppercase tracking-wider font-medium">
        {title}
      </span>
      <p className="text-sm text-surface-700 mt-1 leading-relaxed">
        {children}
      </p>
    </div>
  )
}

export default CreatePublication
