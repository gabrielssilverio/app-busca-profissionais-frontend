import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Star, MapPin, Clock, Phone, Calendar, Crown } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import StarRating from '../components/StarRating'
import LoadingSpinner from '../components/LoadingSpinner'
import { salonApi, serviceApi, professionalApi, appointmentApi, reviewApi } from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function SalonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [bookingStep, setBookingStep] = useState<'idle' | 'booking'>('idle')
  const [selectedService, setSelectedService] = useState('')
  const [selectedPro, setSelectedPro] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  const { data: salon, isLoading } = useQuery({
    queryKey: ['salon', id],
    queryFn: () => salonApi.getById(id!),
  })

  const { data: services } = useQuery({
    queryKey: ['services', id],
    queryFn: () => serviceApi.getBySalon(id!),
    enabled: !!id,
  })

  const { data: professionals } = useQuery({
    queryKey: ['professionals', id],
    queryFn: () => professionalApi.getBySalon(id!),
    enabled: !!id,
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewApi.getBySalon(id!),
    enabled: !!id,
  })

  const bookMutation = useMutation({
    mutationFn: () => appointmentApi.create({
      salonId: id!,
      professionalId: selectedPro,
      serviceId: selectedService,
      scheduledAt,
    }),
    onSuccess: () => {
      toast.success('Agendamento realizado! Aguarde a confirmação.')
      setBookingStep('idle')
      navigate('/appointments')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao agendar'),
  })

  if (isLoading) return <><Navbar /><LoadingSpinner /></>
  if (!salon) return <><Navbar /><div className="p-8 text-center text-gray-500">Salão não encontrado.</div></>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Cover */}
      <div className="relative h-64 bg-gradient-to-br from-primary-200 to-purple-200 overflow-hidden">
        {salon.coverImage && (
          <img src={salon.coverImage} alt={salon.name} className="w-full h-full object-cover" />
        )}
        {salon.highlighted && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Crown className="w-4 h-4" />
            Destaque
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 pb-16">
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{salon.name}</h1>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{salon.averageRating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({salon.reviewCount} avaliações)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <MapPin className="w-4 h-4" />
                {salon.address}, {salon.city} — {salon.state}
              </div>
              {salon.phone && (
                <div className="flex items-center gap-1 text-gray-500 mt-1 text-sm">
                  <Phone className="w-4 h-4" />
                  {salon.phone}
                </div>
              )}
            </div>
            {user?.role === 'CLIENT' && bookingStep === 'idle' && (
              <button onClick={() => setBookingStep('booking')} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                <Calendar className="w-4 h-4" />
                Agendar Serviço
              </button>
            )}
          </div>
          {salon.description && <p className="text-gray-600 mt-4">{salon.description}</p>}

          {/* Opening hours */}
          {salon.openingHours?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Horários
              </h3>
              <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                {salon.openingHours.map((h: any) => (
                  <div key={h.dayOfWeek} className="flex justify-between">
                    <span className="font-medium capitalize">{h.dayOfWeek.toLowerCase()}</span>
                    <span>{h.closed ? 'Fechado' : `${h.openTime} – ${h.closeTime}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking form */}
        {bookingStep === 'booking' && (
          <div className="card p-6 mb-6 border-2 border-primary-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Novo Agendamento</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Serviço</label>
                <select value={selectedService} onChange={e => setSelectedService(e.target.value)} className="input-field">
                  <option value="">Selecione o serviço</option>
                  {services?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} — R$ {s.price} ({s.durationMinutes}min)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Profissional</label>
                <select value={selectedPro} onChange={e => setSelectedPro(e.target.value)} className="input-field">
                  <option value="">Selecione o profissional</option>
                  {professionals?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Data e Hora</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => bookMutation.mutate()}
                  disabled={!selectedService || !selectedPro || !scheduledAt || bookMutation.isPending}
                  className="btn-primary flex-1"
                >
                  {bookMutation.isPending ? 'Agendando...' : 'Confirmar Agendamento'}
                </button>
                <button onClick={() => setBookingStep('idle')} className="btn-secondary">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Services */}
        {services && services.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Serviços</h2>
            <div className="space-y-3">
              {services.map((s: any) => (
                <div key={s.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{s.name}</p>
                    {s.description && <p className="text-gray-500 text-sm">{s.description}</p>}
                    <p className="text-gray-400 text-xs mt-0.5">{s.durationMinutes} minutos</p>
                  </div>
                  <span className="font-bold text-primary-600 text-lg">R$ {Number(s.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Avaliações ({reviews?.length || 0})
          </h2>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r: any) => (
                <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{r.clientName}</span>
                    <StarRating value={r.rating} readonly size="sm" />
                  </div>
                  {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
                  <p className="text-gray-400 text-xs mt-1">
                    {format(new Date(r.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Nenhuma avaliação ainda.</p>
          )}
        </div>
      </div>
    </div>
  )
}
