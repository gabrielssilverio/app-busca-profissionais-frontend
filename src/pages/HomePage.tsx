import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search, Star, Shield, Zap, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import SalonCard from '../components/SalonCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { salonApi } from '../lib/api'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const { data: highlighted, isLoading } = useQuery({
    queryKey: ['highlighted-salons'],
    queryFn: salonApi.getHighlighted,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Beleza ao alcance<br />
            <span className="text-yellow-300">dos seus dedos</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Encontre os melhores salões de estética, agende online e avalie o serviço — tudo em um só lugar.
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por salão, serviço ou cidade..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
            <button type="submit" className="bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-colors whitespace-nowrap">
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: 'Encontre', desc: 'Busque salões por localização, serviço ou avaliação.' },
            { icon: Zap, title: 'Agende', desc: 'Marque seu horário em segundos, sem telefonemas.' },
            { icon: Star, title: 'Avalie', desc: 'Compartilhe sua experiência e ajude outros clientes.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-8 card hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlighted Salons */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Salões em Destaque</h2>
            <p className="text-gray-500 mt-1">Os melhores da região, selecionados para você</p>
          </div>
          <Link to="/search" className="flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : highlighted && highlighted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {highlighted.map((salon: any) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>Nenhum salão em destaque no momento.</p>
            <Link to="/search" className="text-primary-600 font-semibold mt-2 inline-block">Explorar salões →</Link>
          </div>
        )}
      </section>

      {/* CTA para salões */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Shield className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Você tem um salão?</h2>
          <p className="text-gray-400 text-lg mb-8">Cadastre-se gratuitamente e comece a receber clientes hoje mesmo.</p>
          <Link to="/register" className="btn-primary text-lg py-4 px-10 inline-block">
            Cadastrar meu salão — Grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          © 2025 GlowConnect — Marketplace de serviços de estética
        </div>
      </footer>
    </div>
  )
}
