import { useState, useEffect } from 'react';
import { ChefHat, Award, Users, Sparkles, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
// import Navbaar from './Components/Navbaar';

export default function ModularKitchenWebsite() {

  const [activeFilter, setActiveFilter] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);





  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200',
      title: 'Luxury Modular Kitchens',
      subtitle: 'Where Elegance Meets Functionality'
    },
    {
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
      title: 'Contemporary Designs',
      subtitle: 'Crafted to Perfection'
    },
    {
      image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1200',
      title: 'Timeless Beauty',
      subtitle: 'Transform Your Cooking Space'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Sample portfolio items
  const portfolioItems = [
    { id: 1, category: 'modern', image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800', title: 'Contemporary White Kitchen' },
    { id: 2, category: 'luxury', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', title: 'Luxury Marble Kitchen' },
    { id: 3, category: 'modern', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800', title: 'Minimalist Design' },
    { id: 4, category: 'traditional', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800', title: 'Classic Wood Finish' },
    { id: 5, category: 'luxury', image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=800', title: 'Premium Island Kitchen' },
    { id: 6, category: 'modern', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', title: 'Sleek Urban Kitchen' },
  ];

  // Sample reviews
  const reviews = [
    { id: 1, name: 'Priya Sharma', rating: 5, text: 'Absolutely stunning work! They transformed our kitchen into a dream space. Professional, timely, and attention to detail is exceptional.', location: 'Mumbai' },
    { id: 2, name: 'Rajesh Kumar', rating: 5, text: 'Best decision we made for our home. The modular kitchen is not only beautiful but also highly functional. Highly recommend!', location: 'Delhi' },
    { id: 3, name: 'Anita Desai', rating: 5, text: 'From design to installation, everything was perfect. The team understood our needs and delivered beyond expectations.', location: 'Bangalore' },
  ];

  const filteredItems = activeFilter === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      {/* <Navbaar /> */}

      {/* Hero Carousel Section */}
      <section id="home" className="relative h-screen overflow-hidden">
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
          </div>
        ))}

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-amber-100 mb-8 leading-relaxed">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-linear-to-r from-amber-700 to-amber-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2">
                  <span>Explore Portfolio</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-300">
                  Get Consultation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-12 bg-amber-500' : 'w-2 bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-block bg-amber-700/30 backdrop-blur-sm p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-12 w-12 text-amber-300 mx-auto" />
              </div>
              <h3 className="text-5xl font-bold text-white mb-2">500+</h3>
              <p className="text-amber-200 text-lg">Projects Completed</p>
            </div>
            <div className="text-center group">
              <div className="inline-block bg-amber-700/30 backdrop-blur-sm p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-12 w-12 text-amber-300 mx-auto" />
              </div>
              <h3 className="text-5xl font-bold text-white mb-2">450+</h3>
              <p className="text-amber-200 text-lg">Happy Clients</p>
            </div>
            <div className="text-center group">
              <div className="inline-block bg-amber-700/30 backdrop-blur-sm p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-12 w-12 text-amber-300 mx-auto" />
              </div>
              <h3 className="text-5xl font-bold text-white mb-2">15+</h3>
              <p className="text-amber-200 text-lg">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-stone-900">Our Portfolio</h2>
            <div className="w-24 h-1 bg-linear-to-r from-amber-700 to-amber-900 mx-auto mb-6"></div>
            <p className="text-xl text-stone-600">Discover our finest kitchen transformations</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['all', 'modern', 'luxury', 'traditional'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${activeFilter === filter
                    ? 'bg-linear-to-r from-amber-700 to-amber-900 text-white shadow-xl scale-105'
                    : 'bg-white text-stone-700 hover:bg-stone-100 shadow-md hover:shadow-lg'
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-amber-900/90 via-amber-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                    <div className="w-16 h-1 bg-amber-400"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 px-4 bg-linear-to-br from-stone-100 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-stone-900">Client Testimonials</h2>
            <div className="w-24 h-1 bg-linear-to-r from-amber-700 to-amber-900 mx-auto mb-6"></div>
            <p className="text-xl text-stone-600">Hear from our satisfied clients</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-stone-100">
                <div className="flex mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-amber-600 fill-amber-600" />
                  ))}
                </div>
                <p className="text-stone-600 mb-6 text-lg leading-relaxed italic">"{review.text}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-bold text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">{review.name}</p>
                    <p className="text-sm text-stone-500">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-linear-to-br from-amber-900 to-stone-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">Ready to Transform Your Kitchen?</h2>
          <p className="text-xl text-amber-100 mb-10 leading-relaxed">Let's bring your dream kitchen to life with our expert design and craftsmanship</p>
          <button className="bg-white text-amber-900 px-10 py-5 rounded-lg text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-amber-50">
            Schedule Free Consultation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-br from-amber-700 to-amber-900 p-2 rounded-lg">
                <ChefHat className="h-8 w-8 text-amber-50" />
              </div>
              <span className="text-3xl font-bold text-white">KitchenCraft</span>
            </div>
            <p className="text-stone-400 text-center">Crafting exceptional modular kitchens since 2009</p>
            <div className="h-px w-64 bg-linear-to-r from-transparent via-amber-800 to-transparent"></div>
            <p className="text-stone-500 text-sm">© 2026 KitchenCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}