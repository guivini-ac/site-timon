import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, Thermometer, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useSlides, useSettings } from './AdminDataContext-hooks';

interface HeroSectionProps {
  onNavigateToNews?: (newsId?: number) => void;
}

const HeroSection = ({ onNavigateToNews }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { slides } = useSlides();
  const { siteSettings } = useSettings();
  
  // Filtrar apenas slides ativos
  const activeSlides = slides;

  // Preload das imagens para transições suaves
  useEffect(() => {
    const preloadImages = () => {
      activeSlides.forEach((slide) => {
        const img = new Image();
        img.src = slide.image;
      });
    };
    
    if (activeSlides.length > 0) {
      preloadImages();
      
      // Animação de entrada
      const loadTimer = setTimeout(() => setIsLoaded(true), 100);
      
      const timer = setInterval(() => {
        if (!isTransitioning) {
          const nextIndex = (currentSlide + 1) % activeSlides.length;
          changeSlide(nextIndex);
        }
      }, 6000);
      
      return () => {
        clearInterval(timer);
        clearTimeout(loadTimer);
      };
    }
  }, [activeSlides.length, currentSlide, isTransitioning]);

  // Reset current slide when slides change
  useEffect(() => {
    if (currentSlide >= activeSlides.length && activeSlides.length > 0) {
      setCurrentSlide(0);
    }
  }, [activeSlides.length, currentSlide]);

  const changeSlide = (newIndex: number) => {
    if (isTransitioning || newIndex === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(newIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const nextSlide = () => {
    if (activeSlides.length > 0) {
      const nextIndex = (currentSlide + 1) % activeSlides.length;
      changeSlide(nextIndex);
    }
  };

  const prevSlide = () => {
    if (activeSlides.length > 0) {
      const prevIndex = (currentSlide - 1 + activeSlides.length) % activeSlides.length;
      changeSlide(prevIndex);
    }
  };

  // Se não há slides ativos, mostrar mensagem padrão
  if (activeSlides.length === 0) {
    return (
      <section className="relative">
        <div className="relative h-[500px] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bem-vindo ao {siteSettings.siteName}
            </h2>
            <p className="text-lg opacity-90">
              {siteSettings.siteDescription}
            </p>
          </div>
        </div>
        
        {/* Cards de Informações Rápidas */}
        <div className="bg-[#144c9c] py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">127.454</p>
                    <p className="text-sm opacity-90">População Estimada</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-6">
                <div className="flex items-center">
                  <Thermometer className="h-8 w-8 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">28°C</p>
                    <p className="text-sm opacity-90">Temperatura Atual</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-6">
                <div className="flex items-center">
                  <Phone className="h-8 w-8 mr-4" />
                  <div>
                    <p className="text-lg font-bold">{siteSettings.contactPhone}</p>
                    <p className="text-sm opacity-90">Atendimento</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      {/* Carousel Principal */}
      <div 
        className={`carousel-container h-[400px] md:h-[500px] lg:h-[600px] transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}
      >
        {activeSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          const slideClass = isActive ? 'carousel-slide-active' : 'carousel-slide-inactive';
          
          return (
            <div
              key={slide.id}
              className={`carousel-slide ${slideClass}`}
            >
              <ImageWithFallback
                src={slide.image}
                alt={slide.title}
                className="carousel-image w-full h-full object-cover"
              />
              <div className="carousel-overlay absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
              <div className="absolute inset-0 flex items-center z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl text-white">
                    <div 
                      className={`transition-all duration-1200 ease-out ${
                        isActive 
                          ? 'transform translate-y-0 opacity-100 delay-300' 
                          : 'transform translate-y-8 opacity-0'
                      }`}
                    >
                      <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight transition-all duration-1200 ease-out ${
                        isActive 
                          ? 'transform translate-y-0 opacity-100 delay-400' 
                          : 'transform translate-y-12 opacity-0'
                      }`}>
                        {slide.title}
                      </h2>
                      
                      {slide.subtitle && (
                        <h3 className={`text-xl md:text-2xl mb-3 font-light opacity-95 transition-all duration-1200 ease-out ${
                          isActive 
                            ? 'transform translate-y-0 opacity-95 delay-500' 
                            : 'transform translate-y-12 opacity-0'
                        }`}>
                          {slide.subtitle}
                        </h3>
                      )}
                      
                      {slide.description && (
                        <p className={`text-lg md:text-xl mb-8 leading-relaxed max-w-xl transition-all duration-1200 ease-out ${
                          isActive 
                            ? 'transform translate-y-0 opacity-100 delay-600' 
                            : 'transform translate-y-12 opacity-0'
                        }`}>
                          {slide.description}
                        </p>
                      )}
                      
                      {slide.buttonText && (
                        <div className={`transition-all duration-1200 ease-out ${
                          isActive 
                            ? 'transform translate-y-0 opacity-100 delay-700' 
                            : 'transform translate-y-12 opacity-0'
                        }`}>
                          <Button 
                            size="lg" 
                            className="bg-[#144c9c] hover:bg-[#0d3b7a] text-lg px-8 py-3 h-auto transform hover:scale-105 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-white/20"
                            onClick={() => {
                              if (slide.buttonLink) {
                                if (slide.buttonLink.startsWith('#')) {
                                  const element = document.querySelector(slide.buttonLink);
                                  element?.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                  window.open(slide.buttonLink, '_blank');
                                }
                              }
                            }}
                          >
                            {slide.buttonText}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navegação do Carousel */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className={`absolute left-6 top-1/2 transform -translate-y-1/2 z-20 text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-white/30 hover:shadow-lg ${
                isTransitioning ? 'cursor-not-allowed opacity-50' : ''
              }`}
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className={`absolute right-6 top-1/2 transform -translate-y-1/2 z-20 text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-white/30 hover:shadow-lg ${
                isTransitioning ? 'cursor-not-allowed opacity-50' : ''
              }`}
              aria-label="Próximo slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  disabled={isTransitioning}
                  className={`h-1 rounded-full transition-all duration-500 ease-out transform hover:scale-110 backdrop-blur-sm ${
                    index === currentSlide 
                      ? 'bg-white w-12 shadow-2xl' 
                      : 'bg-white/40 hover:bg-white/70 w-6'
                  } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label={`Ir para slide ${index + 1}`}
                  style={{
                    boxShadow: index === currentSlide 
                      ? '0 4px 12px rgba(255, 255, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                      : '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Cards de Informações Rápidas */}
      <div className="bg-[#144c9c] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-2xl font-bold">127.454</p>
                  <p className="text-sm opacity-90">População Estimada</p>
                </div>
              </div>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-6">
              <div className="flex items-center">
                <Thermometer className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-2xl font-bold">28°C</p>
                  <p className="text-sm opacity-90">Temperatura Atual</p>
                </div>
              </div>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-6">
              <div className="flex items-center">
                <Phone className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-lg font-bold">{siteSettings.contactPhone}</p>
                  <p className="text-sm opacity-90">Atendimento</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;