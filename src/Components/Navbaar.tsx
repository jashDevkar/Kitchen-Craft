import { useEffect, useState } from "react";
import { ChefHat, Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbaar() {

  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-xl' : 'bg-linear-to-b from-black/50 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="bg-linear-to-br from-amber-700 to-amber-900 p-2 rounded-lg">
              <ChefHat className="h-7 w-7 text-amber-50" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-amber-900' : 'text-white'}`}>
              KitchenCraft
            </span>
          </div>

          <div className="hidden md:flex space-x-8">
            {['Home', 'Portfolio', 'Reviews', 'Contact'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`font-medium transition-all duration-300 hover:scale-105 ${scrolled
                    ? 'text-stone-700 hover:text-amber-800'
                    : 'text-white hover:text-amber-200'
                  }`}
              >
                {item}
              </a>
            ))}
          </div>

          <button
            className={`md:hidden ${scrolled ? 'text-stone-800' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-2xl">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {['Home', 'Portfolio', 'Reviews', 'Contact'].map(item => {
              const onHomePage = location.pathname === '/'

              
              return (
                <button
                onClick={()=>{
                  console.log(onHomePage)
                  if (onHomePage === false){
                navigate('/')
              }
                }}
                className="block py-3 text-stone-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg px-3 transition-colors"
                >
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
              </button>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  );

}