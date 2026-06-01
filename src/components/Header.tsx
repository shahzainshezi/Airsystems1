"use client";

import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { credits, cart, cartTotal, isCartOpen, setIsCartOpen, removeFromCart, currentUser, logout, categories } = useStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const avatarUrl = currentUser
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=008558&color=fff&bold=true`
    : `https://ui-avatars.com/api/?name=Guest&background=64748b&color=fff&bold=true`;

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <Link href="/" className="logo">
            <img src="/logo.png" alt="Airsystems1" className="brand-logo" />
          </Link>

          <div className="nav-links">
            {currentUser?.role === 'super_admin' ? (
              <span className="nav-link active">Admin Management Portal</span>
            ) : (
              <>
                <Link href="/" className="nav-link active">Home</Link>
                <div className="dropdown">
                  <Link href="/#categories" className="nav-link">Apparel <i className='bx bx-chevron-down'></i></Link>
                  <div className="dropdown-content">
                    {categories.map(cat => (
                      <Link key={cat.id} href={`/category/${cat.id}`}>{cat.name}</Link>
                    ))}
                  </div>
                </div>
                <Link href="/#shop" className="nav-link">All Products</Link>
              </>
            )}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="nav-actions">
            {/* Credits Badge — only when logged in and not admin */}
            {currentUser && currentUser.role !== 'super_admin' && (
              <div className="credit-badge" title="Your available balance">
                <div className="credit-icon-wrapper"><i className='bx bxs-coin-stack'></i></div>
                <div className="credit-text">
                  <span className="credit-label">Balance</span>
                  <span className="credit-amount">{credits}</span>
                </div>
              </div>
            )}

            {/* Cart Icon — only when logged in and not admin */}
            {currentUser && currentUser.role !== 'super_admin' && (
              <div className="cart-icon" onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer' }}>
                <i className='bx bx-cart-alt'></i>
                <span className="cart-count">{cart.length}</span>
              </div>
            )}

            {/* Profile / Login */}
            {currentUser ? (
              <div className="dropdown">
                <div className="profile-icon">
                  <img src={avatarUrl} alt={currentUser.name} title={currentUser.name} />
                </div>
                <div className="dropdown-content profile-dropdown">
                  <div style={{ padding: '0.8rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{currentUser.id}</div>
                  </div>
                  {currentUser?.role !== 'super_admin' && (
                    <Link href="/dashboard"><i className='bx bx-user'></i> Employee Portal</Link>
                  )}
                  {currentUser?.role === 'super_admin' && (
                    <Link href="/admin"><i className='bx bx-shield-quarter'></i> Admin Dashboard</Link>
                  )}
                  <a href="#" className="logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    <i className='bx bx-log-out'></i> Logout
                  </a>
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
                <i className='bx bx-log-in'></i> Login
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={`bx ${isMobileMenuOpen ? 'bx-x' : 'bx-menu'}`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <img src="/logo.png" alt="Airsystems1" style={{ height: '80px', objectFit: 'contain' }} />
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#0f172a', cursor: 'pointer' }}>
            <i className='bx bx-x'></i>
          </button>
        </div>
        <div className="mobile-menu-links">
          <Link href="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <div style={{ padding: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Departments</span>
            {categories.map(cat => (
              <Link key={cat.id} href={`/category/${cat.id}`} className="mobile-link" onClick={() => setIsMobileMenuOpen(false)} style={{ paddingLeft: '1rem' }}>
                {cat.name}
              </Link>
            ))}
          </div>
          <Link href="/#shop" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>All Products</Link>
          {currentUser && (
            <Link href="/dashboard" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>My Dashboard</Link>
          )}
          {currentUser?.role === 'admin' && (
            <Link href="/admin" className="mobile-link" style={{ color: '#00593b' }} onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
          )}
          
          <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>Language</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* Cart Drawer — only render when logged in */}
      {currentUser && (
        <>
          <div className={`cart-drawer ${isCartOpen ? 'active' : ''}`} style={isCartOpen ? { right: 0 } : {}}>
            <div className="cart-header">
              <h2>Your Order <span className="cart-count-badge">{cart.length} Items</span></h2>
              <button className="close-cart" onClick={() => setIsCartOpen(false)}><i className='bx bx-x'></i></button>
            </div>

            <div className="credit-summary-card">
              <div className="summary-row">
                <span>Available Balance:</span>
                <span className="balance-amount"><span>{credits}</span> <i className='bx bxs-coin-stack'></i></span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, ((credits - cartTotal) / 250) * 100))}%` }}></div>
              </div>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>Your order is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className="cart-item">
                    <img src={item.image} alt={item.title} />
                    <div className="cart-item-details">
                      <div className="cart-item-title">{item.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0' }}>
                        {item.selectedSize && `Size: ${item.selectedSize} `}
                        {item.selectedSize && item.selectedColor && '| '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </div>
                      <div className="cart-item-price">{item.price} <i className='bx bxs-coin-stack'></i></div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>Qty: {item.quantity}</div>
                    </div>
                    <button className="remove-item" onClick={() => removeFromCart(item.cartItemId)}><i className='bx bx-trash'></i></button>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-totals">
                <span>Order Total:</span>
                <span className="total-credits"><span>{cartTotal}</span> <i className='bx bxs-coin-stack'></i></span>
              </div>
              <div className={`cart-balance-check ${cartTotal > credits ? 'insufficient' : ''}`}>
                Balance After Purchase: <span>{credits - cartTotal}</span>
              </div>

              {cartTotal > credits && <p className="error-msg" style={{ display: 'block', marginBottom: '1rem', color: '#ef4444' }}>Insufficient Airsystems Credits for this order.</p>}

              {cart.length > 0 && cartTotal <= credits ? (
                <Link href="/checkout" style={{ textDecoration: 'none' }} onClick={() => setIsCartOpen(false)}>
                  <button className="btn btn-glow btn-block checkout-btn" style={{ width: '100%' }}>
                    Proceed to Checkout <i className='bx bx-check-shield'></i>
                  </button>
                </Link>
              ) : (
                <button className="btn btn-glow btn-block checkout-btn" disabled style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}>
                  Proceed to Checkout <i className='bx bx-check-shield'></i>
                </button>
              )}
            </div>
          </div>
          <div className={`cart-overlay ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}></div>
        </>
      )}
    </>
  );
}
