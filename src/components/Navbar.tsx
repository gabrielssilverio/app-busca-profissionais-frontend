import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Sparkles, Menu, X, User, LogOut, Calendar, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              GlowConnect
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Buscar Salões
            </Link>
            {user ? (
              <>
                <Link to="/appointments" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                  Agendamentos
                </Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                  Dashboard
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm">
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary py-2 px-5 text-sm">Entrar</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">Cadastrar</Link>
              </div>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <Link to="/search" className="block px-2 py-2 text-gray-700 hover:text-primary-600 font-medium">
              Buscar Salões
            </Link>
            {user ? (
              <>
                <Link to="/appointments" className="block px-2 py-2 text-gray-700 font-medium">Agendamentos</Link>
                <Link to="/dashboard" className="block px-2 py-2 text-gray-700 font-medium">Dashboard</Link>
                <Link to="/profile" className="block px-2 py-2 text-gray-700 font-medium">Perfil</Link>
                <button onClick={handleLogout} className="block px-2 py-2 text-red-600 font-medium">Sair</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-2 py-2 text-gray-700 font-medium">Entrar</Link>
                <Link to="/register" className="block px-2 py-2 text-primary-600 font-medium">Cadastrar</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
