import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../lib/api'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  phone: z.string().optional(),
  role: z.enum(['CLIENT', 'PROFESSIONAL', 'SALON_OWNER']),
})

type FormData = z.infer<typeof schema>

const roleLabels = {
  CLIENT: { label: 'Cliente', desc: 'Quero agendar serviços' },
  PROFESSIONAL: { label: 'Profissional', desc: 'Quero oferecer serviços' },
  SALON_OWNER: { label: 'Dono de Salão', desc: 'Tenho ou quero cadastrar um salão' },
}

export default function RegisterPage() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'CLIENT' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: FormData) => {
    try {
      const response = await authApi.register(data)
      setAuth({ userId: response.userId, name: response.name, email: response.email, role: response.role }, response.accessToken, response.refreshToken)
      toast.success('Conta criada com sucesso!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao criar conta')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">GlowConnect</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Criar conta grátis</h1>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de conta</label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.entries(roleLabels) as [FormData['role'], typeof roleLabels[keyof typeof roleLabels]][]).map(([value, { label, desc }]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('role', value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${selectedRole === value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="font-semibold text-gray-900 text-sm">{label}</div>
                    <div className="text-gray-500 text-xs">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
              <input {...register('name')} type="text" placeholder="Seu nome" className="input-field" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input {...register('email')} type="email" placeholder="seu@email.com" className="input-field" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone (opcional)</label>
              <input {...register('phone')} type="tel" placeholder="(11) 99999-9999" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <input {...register('password')} type="password" placeholder="Mínimo 8 caracteres" className="input-field" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-lg py-3">
              {isSubmitting ? 'Criando conta...' : 'Criar conta grátis'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
