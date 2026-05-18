import { useState, useEffect } from 'react';
import { ChefHat, Award, Users, Sparkles, Star, ArrowRight, ChevronLeft, ChevronRight,Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbaar from '../Components/Navbaar';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import ImageModal from '../Components/ImageModal';
import type { Section } from '../services/section';
import type { ContentItem } from '../services/content';
import { fetchSectionContents } from '../services/content';
import { fetchHomepageSections } from '../services/section';





export default function ModularKitchenWebsite() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const heroSlides = [
    { image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200', title: 'Luxury Modular Kitchens', subtitle: 'Where Elegance Meets Functionality' },
    { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200', title: 'Contemporary Designs', subtitle: 'Crafted to Perfection' },
    { image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1200', title: 'Timeless Beauty', subtitle: 'Transform Your Cooking Space' },
  ];

  const { data: sections = [] } = useQuery<Section[]>({
    queryKey: ['homepage-sections'],
    queryFn: fetchHomepageSections,
  });

  const { data: sectionContent = [], isLoading: contentLoading } = useQuery<ContentItem[]>({
    queryKey: ['section-content', activeSection],
    queryFn: () => fetchSectionContents(activeSection!,"homepage"),
    enabled: !!activeSection,
  });

  useEffect(() => {
    if (sections.length > 0 && activeSection === null) {
      setActiveSection(sections[0].name);
    }
  }, [sections]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const reviews = [
    { id: 1, name: 'Priya Sharma', rating: 5, text: 'Absolutely stunning work! They transformed our kitchen into a dream space. Professional, timely, and attention to detail is exceptional.', location: 'Mumbai' },
    { id: 2, name: 'Rajesh Kumar', rating: 5, text: 'Best decision we made for our home. The modular kitchen is not only beautiful but also highly functional. Highly recommend!', location: 'Delhi' },
    { id: 3, name: 'Anita Desai', rating: 5, text: 'From design to installation, everything was perfect. The team understood our needs and delivered beyond expectations.', location: 'Bangalore' },
  ];

  return (
    <div className="relative min-h-screen bg-stone-50">
      <Navbaar />

      {/* Hero Carousel */}
      <section id="home" className="relative h-[65vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
          </div>
        ))}

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">{heroSlides[currentSlide].title}</h1>
              <p className="text-xl md:text-2xl text-amber-100 mb-8 leading-relaxed">{heroSlides[currentSlide].subtitle}</p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/view-all')}
                  className="bg-linear-to-r from-amber-700 to-amber-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2">
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

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110">
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-12 bg-amber-500' : 'w-2 bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, value: '500+', label: 'Projects Completed' },
              { icon: Users, value: '450+', label: 'Happy Clients' },
              { icon: Sparkles, value: '15+', label: 'Years Experience' },
              { icon: Clock, value: '30 Days', label: 'Avg. Completion Time' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center group">
                <div className="inline-block bg-amber-700/30 backdrop-blur-sm p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-12 w-12 text-amber-300 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
                <p className="text-amber-200 text-lg">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-24 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-stone-900">Our Portfolio</h2>
            <div className="w-24 h-1 bg-linear-to-r from-amber-700 to-amber-900 mx-auto mb-6" />
            <p className="text-xl text-stone-600">Discover our finest kitchen transformations</p>
          </div>

          {/* Section filter tabs */}
          {sections.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {sections.map((section) => (
                <button
                  key={section._id}
                  onClick={() => setActiveSection(section.name)}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 capitalize ${
                    activeSection === section.name
                      ? 'bg-linear-to-r from-amber-700 to-amber-900 text-white shadow-xl scale-105'
                      : 'bg-white text-stone-700 hover:bg-stone-100 shadow-md hover:shadow-lg'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </div>
          )}

          {/* Content grid */}
          {contentLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl bg-stone-200 animate-pulse h-80" />
              ))}
            </div>
          ) : sectionContent.length === 0 ? (
            <div className="text-center py-20 text-stone-400 text-lg">No content available for this section.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
                {sectionContent.map((item, index) => (
                  <button
                    key={item._id}
                    onClick={() => openImageModal(index)}
                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                  >
                    <img src={item.imageUrl} alt={activeSection ?? ''} className="w-full lg:h-80 h-40 object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-linear-to-t from-amber-900/90 via-amber-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-white text-2xl font-bold mb-2 capitalize">{activeSection}</h3>
                        <div className="w-16 h-1 bg-amber-400" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={() => navigate('/view-all')}
                  className="bg-linear-to-r from-amber-700 to-amber-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <span>View All</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24 px-4 bg-linear-to-br from-stone-100 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-stone-900">Client Testimonials</h2>
            <div className="w-24 h-1 bg-linear-to-r from-amber-700 to-amber-900 mx-auto mb-6" />
            <p className="text-xl text-stone-600">Hear from our satisfied clients</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
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

      {/* Contact */}
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
            <div className="h-px w-64 bg-linear-to-r from-transparent via-amber-800 to-transparent" />
            <p className="text-stone-500 text-sm">© 2026 KitchenCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ImageModal
        isOpen={isModalOpen}
        images={sectionContent.map(item => item.imageUrl)}
        initialIndex={selectedImageIndex ?? 0}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}