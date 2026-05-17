import { useLocation, useNavigate } from 'react-router-dom'
import Bg from '../assets/add-bg.avif'

function Add() {
    const navigate = useNavigate()
    const location = useLocation()

    console.log(location.pathname);
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:`url(${Bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-white text-4xl font-semibold tracking-tight drop-shadow-lg">
            Build Your Page
          </h1>
          <p className="text-white/50 text-sm tracking-widest uppercase">
            Start by adding a section or content
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Add Section */}
          <button
          onClick={()=>{
            navigate(`${location.pathname}section`)
          }}
            className="
              group relative flex items-center gap-3 px-8 py-4 rounded-2xl
              bg-linear-to-br from-amber-900 to-stone-900
              text-white font-medium text-base tracking-wide
              shadow-lg shadow-amber-950/40
              hover:shadow-xl hover:shadow-amber-900/50
              hover:scale-[1.03] active:scale-[0.97]
              transition-all duration-200
              border border-white/10
              cursor-pointer
            "
          >
            <span className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
            </svg>
            <span>Add Section</span>
          </button>

          <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/20" />

          {/* Add Content */}
          <button
            className="
              group relative flex items-center gap-3 px-8 py-4 rounded-2xl
              bg-gradient-to-br from-amber-900 to-stone-900
              text-white font-medium text-base tracking-wide
              shadow-lg shadow-amber-950/40
              hover:shadow-xl hover:shadow-amber-900/50
              hover:scale-[1.03] active:scale-[0.97]
              transition-all duration-200
              border border-white/10
              cursor-pointer
            "
          >
            <span className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-3-3v6M4 6h16M4 18h16"
              />
            </svg>
            <span>Add Content</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Add