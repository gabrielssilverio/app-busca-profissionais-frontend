import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import StarRating from '../components/StarRating'
import LoadingSpinner from '../components/LoadingSpinner'
import { appointmentApi, reviewApi } from '../lib/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuthStore } from '../store/authStore'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-50', icon: AlertCircle },
  CONFIRMED: { label: 'Confirmado', color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
  COMPLETED: { label: 'Concluído', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'text-red-600 bg-red-50', icon: XCircle },
}

export default function AppointmentsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: appointmentApi.getMine,
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => appointmentApi.cancel(id),
    onSuccess: () => {
      toast.success('Agendamento cancelado')
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao cancelar'),
  })

  const confirmMutation = useMutation({
    mutationFn: (id: string) => appointmentApi.confirm(id),
    onSuccess: () => {
      toast.success('Agendamento confirmado')
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
    },
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => appointmentApi.complete(id),
    onSuccess: () => {
      toast.success('Agendamento concluído')
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
    },
  })

  const reviewMutation = useMutation({
    mutationFn: ({ appointmentId }: { appointmentId: string }) =>
      reviewApi.create({ appointmentId, rating, comment }),
    onSuccess: () => {
      toast.success('Avaliação enviada!')
      setReviewingId(null)
      setRating(5)
      setComment('')
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao avaliar'),
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Meus Agendamentos</h1>

        {isLoading ? <LoadingSpinner /> : appointments?.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((a: any) => {
              const status = statusConfig[a.status] || statusConfig.PENDING
              const StatusIcon = status.icon
              return (
                <div key={a.id} className="card p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{a.salonName}</h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{a.serviceName} — R$ {Number(a.totalAmount).toFixed(2)}</p>
                      <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(a.scheduledAt), "d/MM/yyyy 'às' HH:mm")}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {a.professionalName}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {a.status === 'PENDING' && (
                        <button onClick={() => cancelMutation.mutate(a.id)} className="btn-secondary text-sm py-1.5 px-4 text-red-600">
                          Cancelar
                        </button>
                      )}
                      {user?.role === 'SALON_OWNER' && a.status === 'PENDING' && (
                        <button onClick={() => confirmMutation.mutate(a.id)} className="btn-primary text-sm py-1.5 px-4">
                          Confirmar
                        </button>
                      )}
                      {user?.role === 'SALON_OWNER' && a.status === 'CONFIRMED' && (
                        <button onClick={() => completeMutation.mutate(a.id)} className="btn-primary text-sm py-1.5 px-4">
                          Concluir
                        </button>
                      )}
                      {user?.role === 'CLIENT' && a.status === 'COMPLETED' && !a.hasReview && (
                        <button onClick={() => setReviewingId(a.id)} className="btn-secondary text-sm py-1.5 px-4">
                          Avaliar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Review form */}
                  {reviewingId === a.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-3">Avaliar serviço</h4>
                      <div className="mb-3">
                        <StarRating value={rating} onChange={setRating} />
                      </div>
                      <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Conte sua experiência (opcional)"
                        className="input-field text-sm resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => reviewMutation.mutate({ appointmentId: a.id })}
                          disabled={reviewMutation.isPending}
                          className="btn-primary text-sm py-2"
                        >
                          {reviewMutation.isPending ? 'Enviando...' : 'Enviar avaliação'}
                        </button>
                        <button onClick={() => setReviewingId(null)} className="btn-secondary text-sm py-2">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Nenhum agendamento ainda</p>
          </div>
        )}
      </div>
    </div>
  )
}
