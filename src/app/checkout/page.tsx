"use client";

import { useStore } from "@/context/StoreContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, cartTotal, credits, checkout, currentUser } = useStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Delivery Info State
  const [deliverySite, setDeliverySite] = useState("Site 42 - Main Logistics Hub");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const handleCheckout = async () => {
    const deliveryInfo = {
      name: currentUser?.name,
      email: currentUser?.email,
      employeeId: currentUser?.id,
      site: deliverySite,
      notes: deliveryNotes
    };
    const success = await checkout(deliveryInfo);
    if (success) {
      setOrderPlaced(true);
    }
  };

  if (orderPlaced) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="success-icon" style={{ marginBottom: '2rem' }}>
            <div className="circle-animation"></div>
            <i className='bx bx-check' style={{ fontSize: '5rem', color: '#10b981' }}></i>
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Order Confirmed!</h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem' }}>
          Your Airsystems Credits have been deducted successfully. Your gear will be delivered to your site office shortly.
        </p>
        <Link href="/" className="btn btn-glow" style={{ padding: '1rem 3rem' }}>Return to Shop</Link>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <PageHero
        bgType="dark"
        badge={{ icon: 'bx-lock-alt', label: 'Secure Checkout' }}
        title="Complete Your"
        titleHighlight="Order"
        subtitle="Review your cart and confirm delivery details"
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', minHeight: '80vh' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', display: 'none' }}>
          Checkout
        </h1>

      <div className="checkout-grid">
        {/* Left Side: Form & Order Items */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Delivery Information</h2>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '3rem' }}>
             <div className="checkout-form-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Full Name</label>
                  <input type="text" defaultValue={currentUser?.name || ''} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Employee ID</label>
                  <input type="text" defaultValue={currentUser?.id || ''} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a' }} />
                </div>
             </div>
             
             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Company Email</label>
                <input type="email" defaultValue={currentUser?.email || ''} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a' }} />
             </div>

             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Delivery Site / Hub Location</label>
                <select 
                  value={deliverySite} 
                  onChange={(e) => setDeliverySite(e.target.value)} 
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a', backgroundColor: '#fff' }}
                >
                  <option>Site 42 - Main Logistics Hub</option>
                  <option>HQ - Corporate Office</option>
                  <option>Hub A - Northern District</option>
                  <option>Hub B - Southern District</option>
                </select>
             </div>

             <div>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Additional Delivery Notes (Optional)</label>
                <textarea 
                  rows={3} 
                  value={deliveryNotes} 
                  onChange={(e) => setDeliveryNotes(e.target.value)} 
                  placeholder="e.g. Leave at the front desk for Mike." 
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', resize: 'vertical' }}
                ></textarea>
             </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Summary ({cart.length} items)</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty. <Link href="/" style={{ color: '#008558' }}>Go back to shop.</Link></p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item) => (
                <div key={item.cartItemId} style={{ display: 'flex', gap: '1.5rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{item.title}</h3>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>
                      {item.selectedSize && `Size: ${item.selectedSize} `}
                      {item.selectedSize && item.selectedColor && ' | '}
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                    </div>
                    <p style={{ color: '#64748b' }}>Qty: {item.quantity}</p>
                    <p style={{ fontWeight: 'bold', color: '#008558', marginTop: 'auto', fontSize: '1.1rem' }}>{item.price} Airsystems Credits</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Payment / Credits */}
        <div>
          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Payment Method</h2>
            
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '2px solid #008558', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <i className='bx bxs-coin-stack' style={{ fontSize: '2rem', color: '#008558' }}></i>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>Airsystems Credits Balance</h3>
                  <p style={{ color: '#64748b' }}>No credit card required</p>
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{credits}</div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                <span>Subtotal</span>
                <span>{cartTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                <span>Shipping</span>
                <span style={{ color: '#10b981' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <span>Total</span>
                <span style={{ color: '#008558' }}>{cartTotal} Bucks</span>
              </div>
            </div>

            {cartTotal > credits ? (
              <div style={{ color: '#ef4444', background: '#fef2f2', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>
                Insufficient Airsystems Credits balance.
              </div>
            ) : (
              <div style={{ color: '#10b981', background: '#ecfdf5', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>
                Remaining Balance: {credits - cartTotal}
              </div>
            )}

            <button 
              className="btn btn-glow" 
              style={{ width: '100%', fontSize: '1.2rem', padding: '1.2rem' }}
              onClick={handleCheckout}
              disabled={cart.length === 0 || cartTotal > credits}
            >
              Place Order
            </button>
            <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#64748b', textDecoration: 'none' }}>
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
