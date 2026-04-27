import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { userApi } from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { User, Lock } from 'lucide-react'

export default function ProfilePage() {
  const { user, setAuth, token, refreshToken } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: userApi.getMe,
  })

  const { register, handleSubmit, reset } = useForm<{ name: string; phone: string }>()

  useEffect(() => {
    if (profile) reset({ name: profile.name, phone: profile.phone || '' })
  }, [profile, reset])

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; phone: string }) => userApi.updateMe(data),
    onSuccess: (updated) => {
      toast.success('Perfil atualizado!')
      setAuth({ userId: updated.id, name: updated.name, email: updated.email, role: updated.role }, token!, refreshToken!)
      queryClient.invalidateQueries({ queryKey: ['my-profile'] })
    },
    onError: () => toast.error('Erro ao atualizar perfil'),
  })

  if (isLoading) return <><Navbar /><LoadingSpinner /></>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

        <div className="card p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Dados Pessoais</h2>
          </div>
          <form onSubmit={handleSubmit(data => updateMutation.mutate(data))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
              <input {...register('name')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input value={profile?.email} disabled className="input-field bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
              <input {...register('phone')} className="input-field" placeholder="(11) 99999-9999" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de conta</label>
              <input value={profile?.role} disabled className="input-field bg-gray-50 text-gray-500" />
            </div>
            <button type="submit" disabled={updateMutation.isPending} className="btn-primary">
              {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
