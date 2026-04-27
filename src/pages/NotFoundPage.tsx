import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-32 px-4 text-center">
        <div>
          <p className="text-8xl mb-6">✂️</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <p className="text-gray-500 mb-8">A página que você procura não existe ou foi removida.</p>
          <Link to="/" className="btn-primary text-lg py-3 px-10 inline-block">Voltar ao início</Link>
        </div>
      </div>
    </div>
  )
}
