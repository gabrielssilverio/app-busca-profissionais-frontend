import { Star } from 'lucide-react'
import clsx from 'clsx'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size]

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={clsx('transition-transform', !readonly && 'hover:scale-110 cursor-pointer')}
        >
          <Star
            className={clsx(sizeClass, star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')}
          />
        </button>
      ))}
    </div>
  )
}
