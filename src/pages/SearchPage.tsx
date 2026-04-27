import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import Navbar from '../components/Navbar'
import SalonCard from '../components/SalonCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { salonApi } from '../lib/api'

const categories = [
  { value: '', label: 'Todos' },
  { value: 'HAIR', label: 'Cabelo' },
  { value: 'NAILS', label: 'Unhas' },
  { value: 'EYEBROWS', label: 'Sobrancelhas' },
  { value: 'SKINCARE', label: 'Skin Care' },
  { value: 'MAKEUP', label: 'Maquiagem' },
  { value: 'MASSAGE', label: 'Massagem' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['salons-search', query, city, category],
    queryFn: () => salonApi.search({ query, city, category }),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams({ query, city, category })
    refetch()
  }

  const salons = data?.content || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar salões..."
                className="input-field pl-12"
              />
            </div>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Cidade"
              className="input-field md:w-48"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="input-field md:w-48"
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary whitespace-nowrap">
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-500 text-sm mb-6">
          {isLoading ? 'Buscando...' : `${salons.length} salão(ões) encontrado(s)`}
        </p>

        {isLoading ? (
          <LoadingSpinner />
        ) : salons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {salons.map((salon: any) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Nenhum salão encontrado</p>
            <p className="text-sm mt-1">Tente outros termos de busca</p>
          </div>
        )}
      </div>
    </div>
  )
}
