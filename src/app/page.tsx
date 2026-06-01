"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  const { credits, cart, addToCart, removeFromCart, cartTotal, checkout, isCartOpen, setIsCartOpen, globalProducts, categories } = useStore();
  const products = globalProducts;
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['/slide3.jpg', '/slide4.jpg'];
  const carouselRef = useRef<HTMLDivElement>(null);
  const catCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Carousel Autoplay Logic
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let isPaused = false;
    const scrollInterval = setInterval(() => {
      if (!isPaused && carousel) {
        const scrollAmount = carousel.clientWidth;

        // If reached the end, scroll back to start
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Slide exactly one exact card width
          carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000);

    carousel.addEventListener('mouseenter', () => isPaused = true);
    carousel.addEventListener('mouseleave', () => isPaused = false);

    return () => clearInterval(scrollInterval);
  }, []);

  // Category Carousel Autoplay
  useEffect(() => {
    const carousel = catCarouselRef.current;
    if (!carousel) return;

    let isPaused = false;
    const scrollInterval = setInterval(() => {
      if (!isPaused && carousel) {
        const scrollAmount = carousel.clientWidth;

        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000);

    carousel.addEventListener('mouseenter', () => isPaused = true);
    carousel.addEventListener('mouseleave', () => isPaused = false);

    return () => clearInterval(scrollInterval);
  }, []);

  const scrollCarousel = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const carousel = ref.current;
      const scrollAmount = carousel.clientWidth;
      carousel.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <ProtectedRoute>
      {/* Dynamic Hero Section */}
      <header className="hero">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url('${slide}')` }}
            ></div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">EMPLOYEE EXCLUSIVE PORTAL</div>
          <h1 className="hero-title">WELCOME TO <br /><span className="text-gradient">AIRSYSTEMS1</span></h1>
          <p className="hero-subtitle">Equip yourself with premium, job-site ready gear using your admin-assigned credits.
            No credit cards required.</p>
          <div className="hero-buttons">
            <a href="#shop" className="btn btn-glow">Shop New Arrivals <i className='bx bx-right-arrow-alt'></i></a>
          </div>
        </div>
        <div className="scroll-indicator">
          <i className='bx bx-chevron-down'></i>
        </div>
      </header>

      {/* Infinite Marquee Section */}
      <div className="marquee-section">
        <div className="marquee-content">
          <div className="marquee-group">
            <span>✦ PREMIUM WORKWEAR</span>
            <span>✦ SAFETY FIRST</span>
            <span>✦ EMPLOYEE EXCLUSIVE</span>
            <span>✦ BUILT FOR THE CREW</span>
            <span>✦ MAXIMUM COMFORT</span>
            <span>✦ FIELD READY</span>
          </div>
          <div className="marquee-group" aria-hidden="true">
            <span>✦ PREMIUM WORKWEAR</span>
            <span>✦ SAFETY FIRST</span>
            <span>✦ EMPLOYEE EXCLUSIVE</span>
            <span>✦ BUILT FOR THE CREW</span>
            <span>✦ MAXIMUM COMFORT</span>
            <span>✦ FIELD READY</span>
          </div>
        </div>
      </div>

      {/* Category Grid Section */}
      <section id="categories" className="category-section">
        <div className="section-container">
          <div className="carousel-header">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Use Your Airsystems Credits Here!</h2>
            <div className="carousel-controls">
              <button className="control-btn" onClick={() => scrollCarousel('left', catCarouselRef)}><i className='bx bx-chevron-left'></i></button>
              <button className="control-btn" onClick={() => scrollCarousel('right', catCarouselRef)}><i className='bx bx-chevron-right'></i></button>
            </div>
          </div>
          <div className="carousel-container" ref={catCarouselRef} style={{ paddingBottom: '2rem' }}>
            {categories.map((cat, idx) => {
              const bgImages: { [key: string]: string } = {
                'SWEATSHIRTS': '/jacket_assc_front.jpg',
                'TSHIRTS': '/tshirt_assc_front.jpg',
                'T-SHIRTS': '/tshirt_assc_front.jpg',
                'HATS': '/assc_cap.jpg',
                'HEADWEAR': '/assc_cap.jpg'
              };
              const bg = bgImages[cat.name.toUpperCase()] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';
              
              return (
                <div key={cat.id} className="bento-item category-card" style={{ 
                  backgroundImage: `url('${bg}')`
                }}>
                  <div className="bento-overlay"></div>
                  <div className="bento-content">
                    <h3>{cat.name.toUpperCase()}</h3>
                    <Link href={`/category/${cat.id}`} className="btn-link">View Collection <i className='bx bx-right-arrow-alt'></i></Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Picks Carousel */}
      <section className="top-picks-section">
        <div className="section-container">
          <div className="section-header-row">
            <h2 className="section-title">Top Picks For You</h2>
            <div className="carousel-controls">
              <button className="control-btn" onClick={() => scrollCarousel('left', carouselRef)}><i className='bx bx-chevron-left'></i></button>
              <button className="control-btn" onClick={() => scrollCarousel('right', carouselRef)}><i className='bx bx-chevron-right'></i></button>
            </div>
          </div>
          <div className="carousel-container" id="top-picks-carousel" ref={carouselRef}>
            {products.filter(p => p.is_top_pick).map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <Link href={`/product/${product.id}`}>
                    <img src={product.image} alt={product.title} className="product-image" />
                  </Link>
                  <div className="product-image-overlay">
                    <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Add to Order</button>
                  </div>
                </div>
                <div className="product-info">
                  <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 className="product-title">{product.title}</h3>
                  </Link>
                  <p className="product-desc">{product.desc}</p>
                  <span className="product-price">{product.price} <i className='bx bxs-coin-stack'></i></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-Page Banner */}
      <section className="mid-banner">
        <div className="banner-bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1920')" }}>
        </div>
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h2>GET YOUR GEAR</h2>
          <p>Essential styles here all-year-round and offered in a variety of colors, inseams and fits</p>
        </div>
      </section>

      {/* Featured Products */}
      <section id="shop" className="shop-section">
        <div className="section-container">
          <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>Featured Products</h2>
          <div className="product-grid" id="product-grid" style={{ paddingTop: '1rem' }}>
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <Link href={`/product/${product.id}`}>
                    <img src={product.image} alt={product.title} className="product-image" />
                  </Link>
                  <div className="product-image-overlay">
                    <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Add to Order</button>
                  </div>
                </div>
                <div className="product-info">
                  <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 className="product-title">{product.title}</h3>
                  </Link>
                  <p className="product-desc">{product.desc}</p>
                  <span className="product-price">{product.price} <i className='bx bxs-coin-stack'></i></span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4" style={{ marginTop: '3rem' }}>
            <button className="btn btn-secondary load-more">Load More Gear</button>
          </div>
        </div>
      </section>

    </ProtectedRoute>
  );
}
