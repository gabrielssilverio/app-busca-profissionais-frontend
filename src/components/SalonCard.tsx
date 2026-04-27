import { Link } from 'react-router-dom'
import { Star, MapPin, Crown } from 'lucide-react'
import clsx from 'clsx'

interface SalonCardProps {
  salon: {
    id: string
    name: string
    description?: string
    city: string
    state: string
    coverImage?: string
    averageRating: number
    reviewCount: number
    highlighted: boolean
  }
}

export default function SalonCard({ salon }: SalonCardProps) {
  return (
    <Link to={`/salons/${salon.id}`} className="block group">
      <div className={clsx(
        'card hover:shadow-md transition-all duration-200 group-hover:-translate-y-0.5',
        salon.highlighted && 'ring-2 ring-primary-400 ring-offset-1'
      )}>
        <div className="relative h-44 bg-gradient-to-br from-primary-100 to-purple-100 overflow-hidden">
          {salon.coverImage ? (
            <img
              src={salon.coverImage}
              alt={salon.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">✂️</span>
            </div>
          )}
          {salon.highlighted && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Destaque
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">{salon.name}</h3>
          {salon.description && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-2">{salon.description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{salon.city}, {salon.state}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-800 text-sm">{salon.averageRating.toFixed(1)}</span>
              <span className="text-gray-400 text-xs">({salon.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
