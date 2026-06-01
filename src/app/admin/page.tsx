"use client";

import { useStore } from "@/context/StoreContext";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { useState } from "react";

export default function AdminDashboard() {
  const { 
    globalProducts: products, categories, employees, orders, 
    addProduct, editProduct, deleteProduct, 
    addCategory, editCategory, deleteCategory,
    updateEmployeeBalance, issueAnnualBucks, addEmployee, editEmployee, deleteEmployee, updateOrderStatus 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('inventory');
  const [isSaving, setIsSaving] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{id: number, name: string} | null>(null);

  // Add/Edit Employee Modal State
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [isSavingEmp, setIsSavingEmp] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const [empForm, setEmpForm] = useState({ name: '', email: '', password: '', site: '', balance: '250', role: 'employee' });
  const [empSearch, setEmpSearch] = useState('');
  
  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', price: '', desc: '', image: '', categoryId: '', sizes: '', colors: '', gallery: '', isTopPick: false });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ 
        title: product.title, 
        price: product.price.toString(), 
        desc: product.description || product.desc || '', 
        image: product.image, 
        categoryId: product.category_id?.toString() || '', 
        sizes: product.sizes ? product.sizes.join(', ') : '',
        colors: product.colors ? product.colors.join(', ') : '',
        gallery: product.gallery ? product.gallery.join(', ') : '',
        isTopPick: product.is_top_pick || false 
      });

    } else {
      setEditingProduct(null);
      setFormData({ title: '', price: '', desc: '', image: '', categoryId: '', sizes: '', colors: '', gallery: '', isTopPick: false });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.title || !formData.price || (!formData.image && !imageFile)) return alert("Please fill all required fields.");
    setIsSaving(true);
    try {
      const productData = { 
        ...formData, 
        price: Number(formData.price), 
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        gallery: formData.gallery ? formData.gallery.split(',').map(g => g.trim()).filter(Boolean) : []
      };
      if (editingProduct) {
        await editProduct(editingProduct.id, productData, imageFile || undefined);
      } else {
        await addProduct(productData, imageFile || undefined);
      }
      setIsModalOpen(false);
    } catch (e: any) {
      alert("Error saving product: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Category Tab State
  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    await addCategory(newCategoryName);
    setNewCategoryName('');
  };

  return (
    <AdminProtectedRoute>
      <>
      <PageHero
        bgType="dark"
        badge={{ icon: 'bx-shield-quarter', label: 'Super Admin Access' }}
        title="System"
        titleHighlight="Admin"
        subtitle="Manage products, employees & orders"
        height="380px"
      />


      <div className="section-container" style={{ padding: '4rem 0', minHeight: '60vh' }}>
        
        {/* Top Stats */}
        <div className="stats-grid">
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Inventory</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a' }}>{products.length}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Bucks Issued</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#00593b' }}>{employees.reduce((acc, emp) => acc + emp.balance, 0)} <i className='bx bxs-coin-stack' style={{ fontSize: '1.5rem' }}></i></div>
          </div>
          <div style={{ background: '#171717', border: '1px solid #333', color: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pending Orders</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{orders.filter(o => o.status === 'Processing').length}</div>
          </div>
        </div>

        <div className="admin-grid">
          
          {/* Sidebar Menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('inventory')}
              style={{ padding: '1rem', textAlign: 'left', background: activeTab === 'inventory' ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: activeTab === 'inventory' ? '700' : '500', color: activeTab === 'inventory' ? '#0f172a' : '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <i className='bx bx-box'></i> Manage Inventory
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              style={{ padding: '1rem', textAlign: 'left', background: activeTab === 'categories' ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: activeTab === 'categories' ? '700' : '500', color: activeTab === 'categories' ? '#0f172a' : '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <i className='bx bx-category'></i> Categories
            </button>
            <button 
              onClick={() => setActiveTab('employees')}
              style={{ padding: '1rem', textAlign: 'left', background: activeTab === 'employees' ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: activeTab === 'employees' ? '700' : '500', color: activeTab === 'employees' ? '#0f172a' : '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <i className='bx bx-group'></i> Employee Accounts
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{ padding: '1rem', textAlign: 'left', background: activeTab === 'orders' ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: activeTab === 'orders' ? '700' : '500', color: activeTab === 'orders' ? '#0f172a' : '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <i className='bx bx-receipt'></i> Fulfill Orders
            </button>
          </div>

          {/* Main Content Area */}
          <div>
            {activeTab === 'inventory' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '2rem', color: '#0f172a' }}>Product Inventory</h2>
                  <button className="btn btn-glow" onClick={() => handleOpenModal()}><i className='bx bx-plus'></i> Add New Product</button>
                </div>
                
                <div className="table-container">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600' }}>Product</th>
                        <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600' }}>Category</th>
                        <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600' }}>Price</th>
                        <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600' }}>Top Pick</th>
                        <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={product.image} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                            <span style={{ fontWeight: '600', color: '#0f172a' }}>{product.title}</span>
                          </td>
                          <td style={{ padding: '1.2rem', color: '#64748b' }}>{product.category?.name || 'Uncategorized'}</td>
                          <td style={{ padding: '1.2rem', fontWeight: '700', color: '#00593b' }}>{product.price} <i className='bx bxs-coin-stack'></i></td>
                          <td style={{ padding: '1.2rem' }}>
                            {product.is_top_pick ? <span style={{ background: '#ecfdf5', color: '#10b981', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Yes</span> : <span style={{ background: '#f1f5f9', color: '#64748b', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>No</span>}
                          </td>
                          <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                            <button onClick={() => handleOpenModal(product)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', marginRight: '0.5rem' }}><i className='bx bx-edit'></i></button>
                            <button onClick={() => deleteProduct(product.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}><i className='bx bx-trash'></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '2rem', color: '#0f172a' }}>Categories</h2>
                </div>
                
                <div className="table-container">
                  <div style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
                     <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New Category Name" style={{ flexGrow: 1, padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                     <button onClick={handleAddCategory} className="btn btn-glow" style={{ padding: '0 2rem' }}>Add</button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600' }}>Name</th>
                        <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(cat => (
                        <tr key={cat.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
                            {editingCategory?.id === cat.id ? (
                              <input 
                                type="text" 
                                value={editingCategory?.name || ''} 
                                onChange={e => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #00593b', width: '100%' }}
                                autoFocus
                              />
                            ) : (
                              cat.name
                            )}
                          </td>
                          <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                            {editingCategory?.id === cat.id ? (
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={async () => {
                                    if (editingCategory) {
                                      await editCategory(cat.id, editingCategory.name);
                                      setEditingCategory(null);
                                    }
                                  }} 
                                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingCategory(null)} 
                                  style={{ background: '#64748b', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => setEditingCategory({ id: cat.id, name: cat.name })} 
                                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                  <i className='bx bx-edit'></i>
                                </button>
                                <button 
                                  onClick={() => deleteCategory(cat.id)} 
                                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                  <i className='bx bx-trash'></i>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (() => {
              const filteredEmployees = employees.filter(emp => 
                emp.name?.toLowerCase().includes(empSearch.toLowerCase()) ||
                emp.email?.toLowerCase().includes(empSearch.toLowerCase()) ||
                emp.site?.toLowerCase().includes(empSearch.toLowerCase()) ||
                emp.id?.toLowerCase().includes(empSearch.toLowerCase())
              );

              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', color: '#0f172a' }}>Employee Accounts</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button className="btn btn-secondary" onClick={issueAnnualBucks}><i className='bx bx-refresh'></i> Issue Annual Bucks</button>
                      <button className="btn btn-glow" onClick={() => { setEditingEmpId(null); setEmpForm({ name: '', email: '', password: 'airsystems2026', site: '', balance: '250', role: 'employee' }); setIsEmpModalOpen(true); }}><i className='bx bx-user-plus'></i> Add Employee</button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <i className='bx bx-search' style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.2rem' }}></i>
                      <input 
                        type="text" 
                        placeholder="Search by name, email, ID, or site..." 
                        value={empSearch}
                        onChange={(e) => setEmpSearch(e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '0.8rem 1rem 0.8rem 2.8rem', 
                          borderRadius: '12px', 
                          border: '1px solid #e2e8f0', 
                          fontSize: '0.95rem', 
                          outline: 'none', 
                          background: '#fff',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                          transition: 'all 0.3s'
                        }} 
                      />
                      {empSearch && (
                        <button 
                          onClick={() => setEmpSearch('')}
                          style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        >
                          <i className='bx bx-x' style={{ fontSize: '1.2rem' }}></i>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600' }}>Employee</th>
                          <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600' }}>Location</th>
                          <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600' }}>Role</th>
                          <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600' }}>Balance</th>
                          <th style={{ padding: '1.2rem', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                              No employees found matching "{empSearch}"
                            </td>
                          </tr>
                        ) : filteredEmployees.map(emp => (
                          <tr key={emp.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '1.2rem' }}>
                              <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.2rem' }}>{emp.name}</div>
                              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{emp.id} • {emp.email}</div>
                            </td>
                            <td style={{ padding: '1.2rem', color: '#475569' }}>{emp.site}</td>
                            <td style={{ padding: '1.2rem' }}>
                              {emp.role === 'super_admin'
                                ? <span style={{ background: '#fef3c7', color: '#d97706', padding: '0.3rem 0.7rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700' }}>⭐ Super Admin</span>
                                : <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.3rem 0.7rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700' }}>Employee</span>
                              }
                            </td>
                            <td style={{ padding: '1.2rem' }}>
                              <span style={{ fontWeight: '800', color: emp.balance > 0 ? '#00593b' : '#ef4444' }}>{emp.balance} <i className='bx bxs-coin-stack'></i></span>
                            </td>
                            <td style={{ padding: '1.2rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                              <button onClick={() => {
                                setEditingEmpId(emp.id);
                                setEmpForm({ name: emp.name, email: emp.email, password: '', site: emp.site || '', balance: emp.balance.toString(), role: emp.role || 'employee' });
                                setIsEmpModalOpen(true);
                              }} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', marginRight: '0.5rem' }}><i className='bx bx-edit'></i></button>
                              {emp.role !== 'super_admin' && (
                                <button onClick={() => { if(confirm(`Delete ${emp.name}?`)) deleteEmployee(emp.id); }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}><i className='bx bx-trash'></i></button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {activeTab === 'orders' && (
              <div>
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                    <i className='bx bx-time' style={{ fontSize: '4rem', color: '#94a3b8', marginBottom: '1rem' }}></i>
                    <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>No Pending Orders</h2>
                    <p style={{ color: '#64748b' }}>All employee orders have been fulfilled.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map(order => (
                      <div key={order.id} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {order.id}
                              {order.status === 'Processing' && <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Processing</span>}
                              {order.status === 'Fulfilled' && <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Fulfilled</span>}
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>{order.date} • {order.items} Items</div>
                          </div>
                          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontWeight: '800', color: '#00593b', fontSize: '1.2rem' }}>{order.total} Bucks</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <select 
                                value={order.status} 
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                style={{ 
                                  padding: '0.5rem 1rem', 
                                  background: order.status === 'Fulfilled' || order.status === 'Delivered' ? '#ecfdf5' : 
                                             order.status === 'Processing' ? '#fff7ed' : 
                                             order.status === 'Shipped' ? '#eff6ff' : 
                                             order.status === 'Refunded' ? '#fef2f2' : '#f8fafc',
                                  color: order.status === 'Fulfilled' || order.status === 'Delivered' ? '#059669' : 
                                         order.status === 'Processing' ? '#d97706' : 
                                         order.status === 'Shipped' ? '#2563eb' : 
                                         order.status === 'Refunded' ? '#dc2626' : '#64748b',
                                  border: `1px solid ${
                                         order.status === 'Fulfilled' || order.status === 'Delivered' ? '#10b981' : 
                                         order.status === 'Processing' ? '#f59e0b' : 
                                         order.status === 'Shipped' ? '#3b82f6' : 
                                         order.status === 'Refunded' ? '#ef4444' : '#e2e8f0'
                                  }`,
                                  borderRadius: '8px', 
                                  cursor: 'pointer', 
                                  fontWeight: '700',
                                  fontSize: '0.85rem',
                                  outline: 'none'
                                }}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Fulfilled">Fulfilled</option>
                                <option value="Refunded">Refunded</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                            <i className={`bx bx-chevron-${expandedOrder === order.id ? 'up' : 'down'}`} style={{ fontSize: '1.5rem', color: '#94a3b8' }}></i>
                          </div>
                        </div>

                        {/* Order Details Accordion */}
                        {expandedOrder === order.id && order.details && (
                          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }} onClick={(e) => e.stopPropagation()}>
                            {/* Delivery Info */}
                            <div>
                              <h4 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem', fontWeight: '700' }}>Delivery Information</h4>
                              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem', color: '#0f172a' }}>
                                <div style={{ marginBottom: '0.4rem' }}><strong>Name:</strong> {order.details.deliveryInfo?.name || 'N/A'}</div>
                                <div style={{ marginBottom: '0.4rem' }}><strong>Email:</strong> {order.details.deliveryInfo?.email || 'N/A'}</div>
                                <div style={{ marginBottom: '0.4rem' }}><strong>Employee ID:</strong> {order.details.deliveryInfo?.employeeId || 'N/A'}</div>
                                <div style={{ marginBottom: '0.4rem' }}><strong>Site:</strong> {order.details.deliveryInfo?.site || 'N/A'}</div>
                                {order.details.deliveryInfo?.notes && (
                                  <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid #e2e8f0' }}>
                                    <strong>Notes:</strong> {order.details.deliveryInfo.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Items List */}
                            <div>
                              <h4 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem', fontWeight: '700' }}>Order Items</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {order.details.cart?.map((item: any) => (
                                  <div key={item.cartItemId} style={{ display: 'flex', gap: '1rem', background: '#f8fafc', padding: '0.8rem', borderRadius: '8px' }}>
                                    <img src={item.image} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.title}</div>
                                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                        {item.selectedSize && `Size: ${item.selectedSize}`} {item.selectedColor && `• Color: ${item.selectedColor}`}
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#00593b' }}>{item.price} Bucks</div>
                                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Qty: {item.quantity}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ===== PRODUCT MODAL (Scrollable, Responsive) ===== */}
      {isModalOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000 }} onClick={() => setIsModalOpen(false)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: '#fff', borderRadius: '20px', width: '95%', maxWidth: '640px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            zIndex: 1001, boxShadow: '0 30px 60px -12px rgba(0,0,0,0.35)'
          }}>
            {/* Sticky Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0, fontWeight: '800' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Fill in the details below</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                <i className='bx bx-x'></i>
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Title *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="e.g. Heavy Duty Parka" />
              </div>

              {/* Category + Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                  <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', backgroundColor: '#fff', color: '#0f172a', boxSizing: 'border-box' }}>
                    <option value="">Uncategorized</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price (Airsystems Credits) *</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                    placeholder="150" />
                </div>
              </div>

              {/* Image Section */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1.5px dashed #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Upload from device:</p>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)}
                      style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', boxSizing: 'border-box' }} />
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.6rem 0 0.4rem' }}>Or paste image URL:</p>
                    <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#0f172a', boxSizing: 'border-box' }}
                      placeholder="https://images.unsplash.com/..." />
                  </div>
                  {(imageFile || formData.image) && (
                    <img src={imageFile ? URL.createObjectURL(imageFile) : formData.image} alt="Preview"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #e2e8f0', flexShrink: 0 }} />
                  )}
                </div>
              </div>

              {/* Sizes + Colors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sizes</label>
                  <input type="text" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                    placeholder="S, M, L, XL" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Colors</label>
                  <input type="text" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                    placeholder="Black, Red, Blue" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</label>
                <textarea rows={2} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', resize: 'vertical', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="Product details..."></textarea>
              </div>

              {/* Gallery Images */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gallery Images (Comma separated URLs)</label>
                <textarea rows={2} value={formData.gallery} onChange={e => setFormData({...formData, gallery: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', resize: 'vertical', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="https://img1.jpg, https://img2.jpg"></textarea>
              </div>

              {/* Top Pick Toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: formData.isTopPick ? '#fff7ed' : '#fff' }}>
                <input type="checkbox" checked={formData.isTopPick} onChange={e => setFormData({...formData, isTopPick: e.target.checked})}
                  style={{ width: '18px', height: '18px', accentColor: '#00593b' }} />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>⭐ Show in Top Picks</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Display on homepage carousel</div>
                </div>
              </label>

            </div>

            {/* Sticky Footer Button */}
            <div style={{ padding: '1.2rem 2rem', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
              <button onClick={handleSaveProduct} className="btn btn-glow" disabled={isSaving}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', opacity: isSaving ? 0.7 : 1 }}>
                {isSaving ? <><i className='bx bx-loader-alt bx-spin'></i> Saving...</> : editingProduct ? <><i className='bx bx-save'></i> Save Changes</> : <><i className='bx bx-plus'></i> Add Product</>}
              </button>
            </div>

          </div>
        </>
      )}


      {/* ===== ADD EMPLOYEE MODAL ===== */}
      {isEmpModalOpen && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setIsEmpModalOpen(false)}></div>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '90%', maxWidth: '520px', zIndex: 1001, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.3rem' }}>{editingEmpId ? 'Edit Employee' : 'Add New Employee'}</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{editingEmpId ? 'Update employee details and balance' : 'New employee will be able to login with these credentials'}</p>
              </div>
              <button onClick={() => setIsEmpModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}><i className='bx bx-x'></i></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name *</label>
                <input
                  type="text"
                  value={empForm.name}
                  onChange={e => setEmpForm({...empForm, name: e.target.value})}
                  placeholder="e.g. John Smith"
                  style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address *</label>
                <input
                  type="email"
                  value={empForm.email}
                  onChange={e => setEmpForm({...empForm, email: e.target.value})}
                  placeholder="employee@airsystems1.com"
                  style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{editingEmpId ? 'Password (leave blank to keep)' : 'Password *'}</label>
                  <input
                    type="text"
                    value={empForm.password}
                    onChange={e => setEmpForm({...empForm, password: e.target.value})}
                    placeholder={editingEmpId ? '********' : 'airsystems2026'}
                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {/* Starting Balance */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Airsystems Credits</label>
                  <input
                    type="number"
                    value={empForm.balance}
                    onChange={e => setEmpForm({...empForm, balance: e.target.value})}
                    placeholder="250"
                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Site and Role */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Site / Location</label>
                  <input
                    type="text"
                    value={empForm.site}
                    onChange={e => setEmpForm({...empForm, site: e.target.value})}
                    placeholder="e.g. Site 42 - Main Hub"
                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</label>
                  <select
                    value={empForm.role}
                    onChange={e => setEmpForm({...empForm, role: e.target.value})}
                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="employee">Employee</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Info box */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.8rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <i className='bx bx-info-circle' style={{ color: '#16a34a', fontSize: '1.1rem', flexShrink: 0 }}></i>
                <span style={{ fontSize: '0.85rem', color: '#15803d' }}>Employee ID will be auto-generated. Role will be set to <strong>Employee</strong>.</span>
              </div>

              <button
                onClick={async () => {
                  if (!empForm.name || !empForm.email) return alert('Name and email are required.');
                  if (!editingEmpId && !empForm.password) return alert('Password is required for new employees.');
                  setIsSavingEmp(true);
                  try {
                    if (editingEmpId) {
                      await editEmployee(editingEmpId, { ...empForm, balance: Number(empForm.balance) || 0 });
                    } else {
                      await addEmployee({ name: empForm.name, email: empForm.email, password: empForm.password, site: empForm.site, balance: Number(empForm.balance) || 250 });
                    }
                    setIsEmpModalOpen(false);
                  } catch (e: any) {
                    alert('Error saving employee: ' + e.message);
                  } finally {
                    setIsSavingEmp(false);
                  }
                }}
                className="btn btn-glow"
                disabled={isSavingEmp}
                style={{ width: '100%', padding: '1.1rem', fontSize: '1rem', opacity: isSavingEmp ? 0.7 : 1 }}
              >
                {isSavingEmp ? 'Saving...' : editingEmpId ? <><i className='bx bx-save'></i> Save Changes</> : <><i className='bx bx-user-plus'></i> Add Employee</>}
              </button>
            </div>
          </div>
        </>
      )}
      </>
    </AdminProtectedRoute>
  );
}
