import { Outlet, useNavigate } from "react-router-dom"
import { FaHome } from "react-icons/fa"

function Layout() {
    const navigate = useNavigate()
    return (
        <>
            <header className="sticky  top-0 z-20 border-b border-white/8 bg-black/30 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
                <button className="flex items-center gap-2 cursor-pointer" onClick={()=>{
                    navigate("/")
                }}>
                    <FaHome width={20} height={20} color="white" />
                    <span className="text-xs text-white/50 tracking-widest uppercase">Home</span>
                </button>
            </header>
            <Outlet />
        </>
    )
}

export default Layout
