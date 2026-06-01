"use client";

import { useStore } from "@/context/StoreContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { useState } from "react";


export default function UserDashboard() {
  const { credits, orders, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  const balanceBadge = (
    <div style={{ background: 'rgba(0,133,88,0.55)', border: '1px solid rgba(0,133,88,0.7)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '0.8rem 1.3rem', textAlign: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Airsystems Credits</div>
      <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>{credits} <i className='bx bxs-coin-stack' style={{ fontSize: '1.2rem', color: '#ffd700' }}></i></div>
    </div>
  );

  return (
    <ProtectedRoute>
      <PageHero
        bgType="dark"
        badge={{ icon: 'bx-user-circle', label: 'Employee Portal' }}
        title="My"
        titleHighlight="Dashboard"
        subtitle={`Welcome back, ${currentUser?.name?.split(' ')[0] || ''}! Here's your account overview.`}
        rightContent={balanceBadge}
      />

      <div className="section-container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '60vh' }}>
        <div className="dashboard-grid">
          
          {/* Sidebar Menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('overview')}
              style={{ padding: '1rem', textAlign: 'left', background: activeTab === 'overview' ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: activeTab === 'overview' ? '700' : '500', color: activeTab === 'overview' ? '#0f172a' : '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <i className='bx bx-grid-alt'></i> Overview
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{ padding: '1rem', textAlign: 'left', background: activeTab === 'orders' ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: activeTab === 'orders' ? '700' : '500', color: activeTab === 'orders' ? '#0f172a' : '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <i className='bx bx-receipt'></i> Order History
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              style={{ padding: '1rem', textAlign: 'left', background: activeTab === 'settings' ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: activeTab === 'settings' ? '700' : '500', color: activeTab === 'settings' ? '#0f172a' : '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <i className='bx bx-cog'></i> Account Settings
            </button>
          </div>

          {/* Main Content Area */}
          <div>
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#0f172a' }}>Welcome back, {currentUser?.name?.split(' ')[0] || 'Employee'}! 👋</h2>
                
                <div className="responsive-two-col" style={{ marginBottom: '3rem' }}>
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1rem' }}>Available Airsystems Credits</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <i className='bx bxs-coin-stack' style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
                      <span style={{ fontSize: '3.5rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{credits}</span>
                    </div>
                    <div style={{ marginTop: '1.5rem', width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(credits/250)*100}%`, background: 'var(--primary)' }}></div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.8rem' }}>Resets annually. Max 250 Credits.</p>
                  </div>

                  <div style={{ background: '#171717', color: 'white', border: '1px solid #333', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Need New Gear?</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', lineHeight: '1.6' }}>Use your allocated budget to order premium Airsystems1 approved workwear directly to your site.</p>
                    <Link href="/#shop" className="btn btn-glow" style={{ alignSelf: 'flex-start' }}>Browse Catalog</Link>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>Recent Orders</h3>
                {orders.length === 0 ? <p style={{ color: '#64748b' }}>No recent orders.</p> : orders.slice(0,1).map(order => (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.3rem' }}>{order.id}</div>
                      <div style={{ color: '#64748b', fontSize: '0.95rem' }}>{order.date} • {order.items} Items</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '0.3rem' }}>{order.total} Credits</div>
                      <span style={{ padding: '0.3rem 0.8rem', background: '#ecfdf5', color: '#10b981', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600' }}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                 <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#0f172a' }}>Order History</h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.length === 0 ? <p style={{ color: '#64748b' }}>You haven't placed any orders yet.</p> : orders.map(order => (
                      <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.3rem' }}>{order.id}</div>
                          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>{order.date} • {order.items} Items</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '0.3rem' }}>{order.total} Credits</div>
                          <span style={{ 
                            padding: '0.3rem 0.8rem', 
                            background: order.status === 'Delivered' || order.status === 'Fulfilled' ? '#ecfdf5' : 
                                       order.status === 'Processing' ? '#fff7ed' : 
                                       order.status === 'Shipped' ? '#eff6ff' : 
                                       order.status === 'Refunded' ? '#fef2f2' : '#f8fafc',
                            color: order.status === 'Delivered' || order.status === 'Fulfilled' ? '#10b981' : 
                                   order.status === 'Processing' ? '#f97316' : 
                                   order.status === 'Shipped' ? '#3b82f6' : 
                                   order.status === 'Refunded' ? '#dc2626' : '#64748b',
                            borderRadius: '50px', 
                            fontSize: '0.85rem', 
                            fontWeight: '700' 
                          }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                 <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#0f172a' }}>Account Settings</h2>
                 <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Full Name</label>
                      <input type="text" value={currentUser?.name || ''} disabled style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontWeight: '500' }} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Employee Email</label>
                      <input type="email" value={currentUser?.email || ''} disabled style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontWeight: '500' }} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Delivery Site Location</label>
                      <input type="text" defaultValue={currentUser?.site || ''} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a', fontWeight: '500' }} />
                    </div>
                    <button className="btn btn-glow" style={{ marginTop: '1rem' }}>Save Changes</button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
