import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { salonApi, appointmentApi } from '../lib/api'
import { Link } from 'react-router-dom'
import { Calendar, Star, DollarSign, Plus, Building2 } from 'lucide-react'
import SalonCard from '../components/SalonCard'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: mySalons, isLoading: loadingSalons } = useQuery({
    queryKey: ['my-salons'],
    queryFn: salonApi.getMine,
    enabled: user?.role === 'SALON_OWNER',
  })

  const { data: appointments, isLoading: loadingAppts } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: appointmentApi.getMine,
  })

  const completed = appointments?.filter((a: any) => a.status === 'COMPLETED') || []
  const pending = appointments?.filter((a: any) => a.status === 'PENDING') || []
  const totalRevenue = completed.reduce((sum: number, a: any) => sum + Number(a.totalAmount), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Olá, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 mb-8">
          {user?.role === 'SALON_OWNER' ? 'Gerencie seus salões' :
           user?.role === 'PROFESSIONAL' ? 'Seus atendimentos' : 'Seus agendamentos'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: appointments?.length || 0, icon: Calendar, color: 'text-blue-600 bg-blue-50' },
            { label: 'Pendentes', value: pending.length, icon: Calendar, color: 'text-yellow-600 bg-yellow-50' },
            { label: 'Concluídos', value: completed.length, icon: Star, color: 'text-green-600 bg-green-50' },
            ...(user?.role === 'SALON_OWNER' ? [{ label: 'Meus Salões', value: mySalons?.length || 0, icon: Building2, color: 'text-purple-600 bg-purple-50' }] : []),
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Salon Owner: Meus Salões */}
        {user?.role === 'SALON_OWNER' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Meus Salões</h2>
              <Link to="/salons/manage/new" className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Novo Salão
              </Link>
            </div>
            {loadingSalons ? <LoadingSpinner /> : mySalons?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySalons.map((s: any) => <SalonCard key={s.id} salon={s} />)}
              </div>
            ) : (
              <div className="card p-8 text-center text-gray-400">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Você ainda não tem salões cadastrados.</p>
                <Link to="/search" className="text-primary-600 font-semibold mt-2 inline-block">Cadastrar meu primeiro salão →</Link>
              </div>
            )}
          </div>
        )}

        {/* Últimos agendamentos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Agendamentos Recentes</h2>
            <Link to="/appointments" className="text-primary-600 font-semibold text-sm hover:underline">Ver todos →</Link>
          </div>
          {loadingAppts ? <LoadingSpinner /> : appointments?.slice(0, 5).map((a: any) => (
            <div key={a.id} className="card p-4 mb-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{a.salonName} — {a.serviceName}</p>
                <p className="text-gray-500 text-sm">{new Date(a.scheduledAt).toLocaleString('pt-BR')}</p>
              </div>
              <span className="text-sm font-medium text-gray-500">{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
