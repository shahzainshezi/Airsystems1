"use client";

import { useStore } from "@/context/StoreContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, globalProducts } = useStore();
  const [activeTab, setActiveTab] = useState('details');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<string>('');
  
  const colorMap: { [key: string]: string } = {
    'Black': '#000000',
    'White': '#ffffff',
    'Red': '#ef4444',
    'Blue': '#3b82f6',
    'Navy': '#1e3a8a',
    'Grey': '#64748b',
    'Gray': '#64748b',
    'Green': '#22c55e',
    'Yellow': '#eab308',
    'Orange': '#f97316',
    'Purple': '#a855f7',
    'Pink': '#ec4899',
    'Brown': '#78350f',
    'Beige': '#f5f5dc',
    'Maroon': '#800000',
    'Gold': '#ffd700',
    'Silver': '#c0c0c0',
    'Charcoal': '#36454f'
  };

  
  const product = globalProducts.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '80vh' }}>
        <h2>Product not found.</h2>
        <Link href="/" className="btn btn-glow" style={{ marginTop: '2rem' }}>Back to Shop</Link>
      </div>
    );
  }

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : null;
  const colors = product.colors && product.colors.length > 0 ? product.colors : null;

  // Auto-select first available option
  useEffect(() => {
    if (sizes && !selectedSize) setSelectedSize(sizes[0]);
    if (colors && !selectedColor) setSelectedColor(colors[0]);
    if (product && !activeImage) setActiveImage(product.image);
  }, [sizes, colors, selectedSize, selectedColor, product, activeImage]);

  const galleryImages = product.gallery && product.gallery.length > 0 
    ? [product.image, ...product.gallery] 
    : [product.image];

  return (
    <ProtectedRoute>
      <PageHero
        bgType="dark"
        badge={{ icon: 'bx-diamond', label: 'Premium Workwear' }}
        title="Gear"
        titleHighlight="Details"
        subtitle={product.title}
      />

      <div className="product-page-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="product-page-grid">
          
          {/* Left: Huge Premium Image + Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', borderRadius: '24px', overflow: 'hidden', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px', border: '1px solid #f1f5f9' }}>
              <img 
                src={activeImage || product.image} 
                alt={product.title} 
                style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'darken', transition: 'all 0.5s ease' }} 
              />
            </div>
            
            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {galleryImages.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{ 
                      aspectRatio: '1/1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: activeImage === img ? '2px solid #00593b' : '2px solid transparent',
                      padding: '4px',
                      background: '#fff',
                      transition: 'all 0.2s'
                    }}
                  >
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', opacity: activeImage === img ? 1 : 0.6 }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>AIRSYSTEMS1 EXCLUSIVE</span>
            </div>
            
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: '#0f172a', marginBottom: '1rem', lineHeight: '1.1' }}>
              {product.title}
            </h1>
            
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              {product.price} <i className='bx bxs-coin-stack'></i>
            </div>

            <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              {product.description || product.desc || 'Premium Airsystems1 workwear engineered for durability and comfort on the job site.'}
            </p>

            {sizes && (
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>Select Size</span>
                  <a href="#" style={{ color: '#64748b', textDecoration: 'underline', fontSize: '0.9rem' }}>Size Guide</a>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {sizes.map((size: string) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{ 
                        width: '60px', height: '60px', borderRadius: '12px', 
                        background: selectedSize === size ? '#0f172a' : '#f8fafc',
                        color: selectedSize === size ? '#fff' : '#0f172a',
                        border: selectedSize === size ? 'none' : '1px solid #e2e8f0',
                        fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colors && (
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>Select Color</span>
                </div>
                <div className="color-swatches">
                  {colors.map((color: string) => {
                    const colorHex = colorMap[color] || '#e2e8f0';
                    return (
                      <div 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`color-swatch-item ${selectedColor === color ? 'active' : ''}`}
                      >
                        <div className="swatch-circle" style={{ background: colorHex }}>
                          {selectedColor === color && (
                            <i className='bx bx-check' style={{ 
                              color: ['White', 'Yellow', 'Beige', 'Silver'].includes(color) ? '#000' : '#fff'
                            }}></i>
                          )}
                        </div>
                        <span className="swatch-label">{color}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button 
              className="add-to-cart-btn" 
              onClick={() => addToCart(product, selectedSize, selectedColor)}
              style={{ width: '100%', height: '65px', fontSize: '1.2rem', borderRadius: '16px', marginBottom: '3rem' }}
            >
              Add to Order <i className='bx bx-cart-alt' style={{ fontSize: '1.5rem' }}></i>
            </button>

            {/* Premium Details Tabs */}
            <div style={{ borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <button 
                  onClick={() => setActiveTab('details')}
                  style={{ padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: activeTab === 'details' ? '2px solid #0f172a' : '2px solid transparent', color: activeTab === 'details' ? '#0f172a' : '#64748b', fontWeight: '600', fontSize: '1.05rem', cursor: 'pointer' }}
                >
                  Product Details
                </button>
                <button 
                  onClick={() => setActiveTab('shipping')}
                  style={{ padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: activeTab === 'shipping' ? '2px solid #0f172a' : '2px solid transparent', color: activeTab === 'shipping' ? '#0f172a' : '#64748b', fontWeight: '600', fontSize: '1.05rem', cursor: 'pointer' }}
                >
                  Delivery Info
                </button>
              </div>
              
              {activeTab === 'details' && (
                <div style={{ color: '#475569', lineHeight: '1.8' }}>
                  {product.description || product.desc ? (
                    <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>{product.description || product.desc}</p>
                  ) : (
                    <ul style={{ paddingLeft: '1.5rem' }}>
                      <li>Heavy-duty 100% breathable material.</li>
                      <li>Airsystems1 Official Logo embroidered on left chest.</li>
                      <li>Machine wash cold, tumble dry low.</li>
                      <li>Approved for all active Airsystems1 field sites.</li>
                    </ul>
                  )}
                </div>
              )}
              {activeTab === 'shipping' && (
                <p style={{ color: '#475569', lineHeight: '1.6' }}>
                  Orders placed using Airsystems Credits are processed internally. Gear is typically delivered directly to your site supervisor's office within 5-7 business days. 
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
      
    </ProtectedRoute>
  );
}
