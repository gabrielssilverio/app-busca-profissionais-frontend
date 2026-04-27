import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  function handleEnter() {
    setLoading(true)
    setTimeout(() => navigate('/home'), 2200)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-glow-dark">
      {/* Background glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-glow-purple opacity-20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-glow-pink opacity-20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary-700 opacity-10 blur-[100px]" />
      </div>

      {/* Floating particles */}
      {!loading && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute block w-1 h-1 rounded-full bg-glow-pink opacity-40 animate-bounce"
              style={{
                left: `${10 + (i * 8) % 85}%`,
                top: `${15 + (i * 13) % 70}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Logo + tagline */}
      <div
        className="relative z-10 flex flex-col items-center gap-6 mb-16 transition-all duration-700"
        style={{ opacity: loading ? 0.3 : 1, transform: loading ? 'scale(0.95)' : 'scale(1)' }}
      >
        {/* Logo mark */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-glow-pink to-glow-purple flex items-center justify-center shadow-2xl shadow-glow-purple/50">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
          </div>
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-glow-pink to-glow-purple opacity-40 blur-xl scale-110" />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-fuchsia-100 to-glow-pink bg-clip-text text-transparent">
            GlowConnect
          </h1>
          <p className="mt-2 text-lg text-white/50 font-light tracking-widest uppercase text-sm">
            Beleza ao seu alcance
          </p>
        </div>
      </div>

      {/* THE button */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {!loading ? (
          <button
            onClick={handleEnter}
            className="group relative px-14 py-5 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-glow-purple/40"
          >
            {/* Button background */}
            <span className="absolute inset-0 bg-gradient-to-r from-glow-purple to-glow-pink" />
            {/* Shine sweep on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {/* Border glow */}
            <span className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
            <span className="relative flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Entrar no App
            </span>
          </button>
        ) : (
          /* Loading state */
          <div className="flex flex-col items-center gap-5">
            {/* Spinner */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-glow-pink border-r-glow-purple animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-fuchsia-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
            </div>
            {/* Loading dots text */}
            <LoadingText />
          </div>
        )}
      </div>

      {/* Bottom tagline */}
      <p className="absolute bottom-8 z-10 text-white/20 text-xs tracking-widest">
        © 2025 GlowConnect
      </p>
    </div>
  )
}

function LoadingText() {
  return (
    <div className="flex items-center gap-1 text-white/70 text-sm font-medium">
      <span>Carregando</span>
      <span className="flex gap-1 ml-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="inline-block w-1.5 h-1.5 rounded-full bg-glow-pink animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
    </div>
  )
}
