import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { adminApi } from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { Users, Building2, Star, DollarSign, Ban, Check, Flag, DoorOpen } from 'lucide-react'

type Tab = 'dashboard' | 'users' | 'salons' | 'reviews'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const { data: dashboard } = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminApi.getDashboard })
  const { data: users, isLoading: loadingUsers } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminApi.getUsers(), enabled: tab === 'users' })
  const { data: salons, isLoading: loadingSalons } = useQuery({ queryKey: ['admin-salons'], queryFn: () => adminApi.getSalons(), enabled: tab === 'salons' })
  const { data: reviews, isLoading: loadingReviews } = useQuery({ queryKey: ['admin-reviews'], queryFn: adminApi.getReviews, enabled: tab === 'reviews' })

  const banMutation = useMutation({
    mutationFn: ({ id, ban }: { id: string; ban: boolean }) => ban ? adminApi.banUser(id) : adminApi.unbanUser(id),
    onSuccess: (_, { ban }) => { toast.success(ban ? 'Usuário banido' : 'Usuário desbanido'); queryClient.invalidateQueries({ queryKey: ['admin-users'] }) },
  })

  const flagMutation = useMutation({
    mutationFn: (id: string) => adminApi.flagReview(id),
    onSuccess: () => { toast.success('Avaliação marcada como spam'); queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }) },
  })

  const [impersonating, setImpersonating] = useState<string | null>(null)

  async function handleImpersonate(u: any) {
    setImpersonating(u.id)
    try {
      const res = await adminApi.impersonateUser(u.id)
      setAuth({ userId: res.userId, name: res.name, email: res.email, role: res.role }, res.accessToken, res.refreshToken)
      toast.success(`Entrando como ${res.name}...`)
      navigate('/dashboard')
    } catch {
      toast.error('Erro ao entrar como usuário')
    } finally {
      setImpersonating(null)
    }
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'salons', label: 'Salões', icon: Building2 },
    { id: 'reviews', label: 'Avaliações', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Painel Admin</h1>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                tab === id ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === 'dashboard' && dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Agendamentos', value: dashboard.totalAppointments, icon: Star },
              { label: 'Avaliações', value: dashboard.totalReviews, icon: Star },
              { label: 'Comissão Total', value: `R$ ${Number(dashboard.totalRevenue || 0).toFixed(2)}`, icon: DollarSign },
              { label: 'Usuários', value: dashboard.totalProfessionals, icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="card p-5">
                <Icon className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-gray-500 text-sm">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          loadingUsers ? <LoadingSpinner /> : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Nome</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">E-mail</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Ação</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Entrar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users?.content?.map((u: any) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3 text-gray-500">{u.role}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.active ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                          {u.active ? 'Ativo' : 'Banido'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => banMutation.mutate({ id: u.id, ban: u.active })}
                          className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg ${u.active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        >
                          {u.active ? <><Ban className="w-3 h-3" /> Banir</> : <><Check className="w-3 h-3" /> Desbanir</>}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleImpersonate(u)}
                          disabled={impersonating === u.id}
                          title={`Entrar como ${u.name}`}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-primary-600 hover:bg-primary-50 disabled:opacity-40 transition-colors"
                        >
                          <DoorOpen className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Reviews */}
        {tab === 'reviews' && (
          loadingReviews ? <LoadingSpinner /> : (
            <div className="space-y-3">
              {reviews?.map((r: any) => (
                <div key={r.id} className="card p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{r.clientName}</span>
                      <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                    </div>
                    {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
                  </div>
                  <button onClick={() => flagMutation.mutate(r.id)} className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg whitespace-nowrap">
                    <Flag className="w-3 h-3" /> Spam
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
