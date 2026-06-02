"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  cartItemId: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
  details?: any;
  employee_id?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  balance: number;
  site: string;
  role: string; // 'super_admin' | 'employee'
}

interface StoreContextType {
  credits: number;
  cart: CartItem[];
  addToCart: (product: any, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  cartTotal: number;
  checkout: (deliveryInfo?: any) => Promise<boolean>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // AUTH
  currentUser: Employee | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // LIVE DATA EXPORTS
  globalProducts: any[];
  categories: any[];
  addProduct: (product: any, imageFile?: File) => Promise<void>;
  editProduct: (id: number, product: any, imageFile?: File) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  editCategory: (id: number, name: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  employees: Employee[];
  updateEmployeeBalance: (id: string, newBalance: number) => Promise<void>;
  issueAnnualBucks: () => Promise<void>;
  addEmployee: (emp: { name: string; email: string; password: string; site: string; balance: number }) => Promise<void>;
  editEmployee: (id: string, empData: any) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // --- Live Data States ---
  const [credits, setCredits] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [globalProducts, setGlobalProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Load auth from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem('airsystems_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setCredits(user.balance);
      } catch {
        localStorage.removeItem('airsystems_user');
      }
    }
    setIsAuthLoading(false);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // --- Load Categories ---
      let localCats = localStorage.getItem('airsystems_local_categories');
      if (localCats) {
        try {
          const parsedCats = JSON.parse(localCats);
          if (parsedCats.length > 3) {
            localStorage.removeItem('airsystems_local_categories');
            localCats = null;
          }
        } catch {
          localStorage.removeItem('airsystems_local_categories');
          localCats = null;
        }
      }
      let cats = [];
      if (!localCats) {
        cats = [
          { id: 5, name: "Hats", created_at: new Date().toISOString() },
          { id: 1, name: "SWEATSHIRTS", created_at: new Date().toISOString() },
          { id: 3, name: "T-SHIRTS", created_at: new Date().toISOString() }
        ];
        localStorage.setItem('airsystems_local_categories', JSON.stringify(cats));
      } else {
        cats = JSON.parse(localCats);
      }
      setCategories(cats);

      // --- Load Products ---
      let localProducts = localStorage.getItem('airsystems_local_products');
      if (localProducts) {
        try {
          const parsedProds = JSON.parse(localProducts);
          if (parsedProds.length > 3 || localProducts.includes('srfapparel.com')) {
            localStorage.removeItem('airsystems_local_products');
            localProducts = null;
          }
        } catch {
          localStorage.removeItem('airsystems_local_products');
          localProducts = null;
        }
      }
      let prods = [];
      if (!localProducts) {
        prods = [
          {
            id: 1,
            title: "ASSC Cap",
            price: 25,
            description: "Premium Airsystems1 ASSC branded cap. Comfortable, durable, and adjustable back strap. Perfect for sunny days on the job site.",
            image: "/assc_cap.jpg",
            is_top_pick: true,
            created_at: new Date().toISOString(),
            category_id: 5,
            sizes: ["One Size"],
            colors: ["Black", "Green"],
            gallery: []
          },
          {
            id: 2,
            title: "Jacket ASSC Front",
            price: 110,
            description: "Heavy-duty windbreaker and waterproof jacket with Airsystems1 logo branding. Built for comfort and safety in tough outdoor environments.",
            image: "/jacket_assc_front.jpg",
            is_top_pick: true,
            created_at: new Date().toISOString(),
            category_id: 1,
            sizes: ["S", "M", "L", "XL", "2XL"],
            colors: ["Black", "Grey"],
            gallery: []
          },
          {
            id: 3,
            title: "Tshirt ASSC Front",
            price: 35,
            description: "Premium cotton workwear T-Shirt with the Airsystems1 emblem. Soft fabric, breathable fit, and job-site ready durability.",
            image: "/tshirt_assc_front.jpg",
            is_top_pick: true,
            created_at: new Date().toISOString(),
            category_id: 3,
            sizes: ["S", "M", "L", "XL", "2XL"],
            colors: ["Black", "Green", "White"],
            gallery: []
          }
        ];
        localStorage.setItem('airsystems_local_products', JSON.stringify(prods));
      } else {
        prods = JSON.parse(localProducts);
      }

      // Map both desc and description to avoid key mismatches in page templates
      const productsMapped = prods.map((p: any) => ({
        ...p,
        desc: p.description || p.desc || "",
        description: p.description || p.desc || "",
        category: cats.find((c: any) => c.id === p.category_id) || null
      }));
      setGlobalProducts(productsMapped);

      // --- Load Employees ---
      let localEmployees = localStorage.getItem('airsystems_local_employees');
      if (localEmployees && (localEmployees.includes('vancebrown.com') || localEmployees.includes('richard22@gmail.com'))) {
        localStorage.removeItem('airsystems_local_employees');
        localStorage.removeItem('airsystems_user');
        localEmployees = null;
      }
      
      let emps = [];
      if (!localEmployees) {
        emps = [
          { id: "EMP-007", name: "Richard", email: "richard@airsystems1.com", balance: 250, created_at: new Date().toISOString(), password: "airsystems2026", role: "employee", site: "Site 33" },
          { id: "EMP-001", name: "Vance Admin", email: "admin@airsystems1.com", balance: 250, created_at: new Date().toISOString(), password: "airsystems2026", role: "super_admin", site: "" },
          { id: "EMP-006", name: "Carlos Silva", email: "carlos@airsystems1.com", balance: 250, created_at: new Date().toISOString(), password: "airsystems2026", role: "employee", site: "Site 42 - Main Hub" },
          { id: "EMP-003", name: "Mike Ross", email: "mike@airsystems1.com", balance: 250, created_at: new Date().toISOString(), password: "airsystems2026", role: "employee", site: "" },
          { id: "EMP-004", name: "Sarah Connor", email: "sarah@airsystems1.com", balance: 250, created_at: new Date().toISOString(), password: "airsystems2026", role: "employee", site: "" },
          { id: "EMP-005", name: "Shezi Dev", email: "developer@airsystems1.com", balance: 250, created_at: new Date().toISOString(), password: "airsystems2026", role: "employee", site: "Site 42" }
        ];
        localStorage.setItem('airsystems_local_employees', JSON.stringify(emps));
      } else {
        emps = JSON.parse(localEmployees);
      }
      setEmployees(emps);

      // --- Load Orders ---
      let localOrders = localStorage.getItem('airsystems_local_orders');
      let ords = [];
      if (localOrders) {
        ords = JSON.parse(localOrders);
      }
      setOrders(ords);

      // Sync active user balance from local storage mock
      const savedUser = localStorage.getItem('airsystems_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        const freshUser = emps.find((e: Employee) => e.id === user.id);
        if (freshUser) {
          setCredits(freshUser.balance);
          setCurrentUser(freshUser);
          localStorage.setItem('airsystems_user', JSON.stringify(freshUser));
        }
      }
    } catch (error) {
      console.error("Error fetching local data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- AUTH FUNCTIONS ---
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const freshEmps = JSON.parse(localStorage.getItem('airsystems_local_employees') || '[]');
      const data = freshEmps.find((emp: any) => emp.email === email && emp.password === password);
      
      if (!data) return false;

      const user: Employee = {
        id: data.id,
        name: data.name,
        email: data.email,
        balance: data.balance,
        site: data.site,
        role: data.role || 'employee'
      };
      setCurrentUser(user);
      setCredits(user.balance);
      localStorage.setItem('airsystems_user', JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCredits(0);
    setCart([]);
    localStorage.removeItem('airsystems_user');
    localStorage.removeItem('airsystems_cart');
  };

  // Keep cart in localStorage
  useEffect(() => {
    if (isMounted && cart.length > 0) {
      localStorage.setItem('airsystems_cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  useEffect(() => {
    if (isMounted) {
      const savedCart = localStorage.getItem('airsystems_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    }
  }, [isMounted]);

  // --- CART FUNCTIONS ---
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const addToCart = (product: any, selectedSize?: string, selectedColor?: string) => {
    setCart((prevCart) => {
      const cartItemId = `${product.id}-${selectedSize || 'nosize'}-${selectedColor || 'nocolor'}`;
      const existing = prevCart.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, selectedSize, selectedColor, cartItemId }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const checkout = async (deliveryInfo?: any) => {
    if (!currentUser) return false;
    if (cartTotal <= credits && cart.length > 0) {
      const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
      const newBalance = credits - cartTotal;

      // Update employee balance locally
      const freshEmps = JSON.parse(localStorage.getItem('airsystems_local_employees') || '[]');
      const updatedEmps = freshEmps.map((emp: Employee) => {
        if (emp.id === currentUser.id) {
          return { ...emp, balance: newBalance };
        }
        return emp;
      });
      localStorage.setItem('airsystems_local_employees', JSON.stringify(updatedEmps));
      setEmployees(updatedEmps);
      
      // Update orders locally
      const newOrderLocal = {
        id: newOrderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        total: cartTotal,
        status: 'Processing',
        items: itemsCount,
        details: { deliveryInfo, cart },
        employee_id: currentUser.id
      };

      const freshOrders = JSON.parse(localStorage.getItem('airsystems_local_orders') || '[]');
      const updatedOrders = [newOrderLocal, ...freshOrders];
      localStorage.setItem('airsystems_local_orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);

      setCredits(newBalance);
      const updatedUser = { ...currentUser, balance: newBalance };
      setCurrentUser(updatedUser);
      localStorage.setItem('airsystems_user', JSON.stringify(updatedUser));

      setCart([]);
      localStorage.removeItem('airsystems_cart');
      setIsCartOpen(false);
      return true;
    }
    return false;
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const freshOrders = JSON.parse(localStorage.getItem('airsystems_local_orders') || '[]');
    const updatedOrders = freshOrders.map((o: any) => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem('airsystems_local_orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  // --- ADMIN FUNCTIONS ---
  const addCategory = async (name: string) => {
    const freshCats = JSON.parse(localStorage.getItem('airsystems_local_categories') || '[]');
    const maxId = freshCats.reduce((max: number, c: any) => c.id > max ? c.id : max, 0);
    const newCat = {
      id: maxId + 1,
      name,
      created_at: new Date().toISOString()
    };
    const updatedCats = [...freshCats, newCat];
    localStorage.setItem('airsystems_local_categories', JSON.stringify(updatedCats));
    setCategories(updatedCats);
  };

  const editCategory = async (id: number, name: string) => {
    const freshCats = JSON.parse(localStorage.getItem('airsystems_local_categories') || '[]');
    const updatedCats = freshCats.map((c: any) => c.id === id ? { ...c, name } : c);
    localStorage.setItem('airsystems_local_categories', JSON.stringify(updatedCats));
    setCategories(updatedCats);
  };

  const deleteCategory = async (id: number) => {
    const freshCats = JSON.parse(localStorage.getItem('airsystems_local_categories') || '[]');
    const updatedCats = freshCats.filter((c: any) => c.id !== id);
    localStorage.setItem('airsystems_local_categories', JSON.stringify(updatedCats));
    setCategories(updatedCats);
  };

  const addProduct = async (productData: any, imageFile?: File) => {
    let imageUrl = productData.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800";
    if (imageFile) {
      imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    const freshProds = JSON.parse(localStorage.getItem('airsystems_local_products') || '[]');
    const maxId = freshProds.reduce((max: number, p: any) => p.id > max ? p.id : max, 0);
    const newProd = {
      id: maxId + 1,
      title: productData.title,
      price: Number(productData.price),
      description: productData.desc,
      image: imageUrl,
      is_top_pick: productData.isTopPick,
      category_id: Number(productData.categoryId) || null,
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      gallery: productData.gallery || [],
      created_at: new Date().toISOString()
    };
    
    const updatedProds = [newProd, ...freshProds];
    localStorage.setItem('airsystems_local_products', JSON.stringify(updatedProds));

    const productsMapped = updatedProds.map((p: any) => ({
      ...p,
      desc: p.description || p.desc || "",
      description: p.description || p.desc || "",
      category: categories.find((c: any) => c.id === p.category_id) || null
    }));
    setGlobalProducts(productsMapped);
  };

  const editProduct = async (id: number, updatedData: any, imageFile?: File) => {
    let imageUrl = updatedData.image;
    if (imageFile) {
      imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    const freshProds = JSON.parse(localStorage.getItem('airsystems_local_products') || '[]');
    const updatedProds = freshProds.map((p: any) => {
      if (p.id === id) {
        return {
          ...p,
          title: updatedData.title,
          price: Number(updatedData.price),
          description: updatedData.desc,
          image: imageUrl,
          is_top_pick: updatedData.isTopPick,
          category_id: Number(updatedData.categoryId) || null,
          sizes: updatedData.sizes || [],
          colors: updatedData.colors || [],
          gallery: updatedData.gallery || []
        };
      }
      return p;
    });

    localStorage.setItem('airsystems_local_products', JSON.stringify(updatedProds));

    const productsMapped = updatedProds.map((p: any) => ({
      ...p,
      desc: p.description || p.desc || "",
      description: p.description || p.desc || "",
      category: categories.find((c: any) => c.id === p.category_id) || null
    }));
    setGlobalProducts(productsMapped);
  };

  const deleteProduct = async (id: number) => {
    const freshProds = JSON.parse(localStorage.getItem('airsystems_local_products') || '[]');
    const updatedProds = freshProds.filter((p: any) => p.id !== id);
    localStorage.setItem('airsystems_local_products', JSON.stringify(updatedProds));

    const productsMapped = updatedProds.map((p: any) => ({
      ...p,
      desc: p.description || p.desc || "",
      description: p.description || p.desc || "",
      category: categories.find((c: any) => c.id === p.category_id) || null
    }));
    setGlobalProducts(productsMapped);
  };

  const updateEmployeeBalance = async (id: string, newBalance: number) => {
    const freshEmps = JSON.parse(localStorage.getItem('airsystems_local_employees') || '[]');
    const updatedEmps = freshEmps.map((emp: Employee) => emp.id === id ? { ...emp, balance: newBalance } : emp);
    localStorage.setItem('airsystems_local_employees', JSON.stringify(updatedEmps));
    setEmployees(updatedEmps);

    if (currentUser && id === currentUser.id) {
      setCredits(newBalance);
      const updatedUser = { ...currentUser, balance: newBalance };
      setCurrentUser(updatedUser);
      localStorage.setItem('airsystems_user', JSON.stringify(updatedUser));
    }
  };

  const issueAnnualBucks = async () => {
    const freshEmps = JSON.parse(localStorage.getItem('airsystems_local_employees') || '[]');
    const updatedEmps = freshEmps.map((emp: Employee) => ({ ...emp, balance: 250 }));
    localStorage.setItem('airsystems_local_employees', JSON.stringify(updatedEmps));
    setEmployees(updatedEmps);

    if (currentUser) {
      setCredits(250);
      const updatedUser = { ...currentUser, balance: 250 };
      setCurrentUser(updatedUser);
      localStorage.setItem('airsystems_user', JSON.stringify(updatedUser));
    }
  };

  const addEmployee = async (empData: { name: string; email: string; password: string; site: string; balance: number }) => {
    const freshEmps = JSON.parse(localStorage.getItem('airsystems_local_employees') || '[]');
    const maxIdNum = freshEmps.reduce((max: number, emp: Employee) => {
      const match = emp.id.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const newId = `EMP-${String(maxIdNum + 1).padStart(3, '0')}`;
    
    const newEmp = {
      id: newId,
      name: empData.name,
      email: empData.email,
      password: empData.password,
      balance: Number(empData.balance),
      role: 'employee',
      site: empData.site || "",
      created_at: new Date().toISOString()
    };
    
    const updatedEmps = [...freshEmps, newEmp];
    localStorage.setItem('airsystems_local_employees', JSON.stringify(updatedEmps));
    setEmployees(updatedEmps);
  };

  const editEmployee = async (id: string, empData: any) => {
    const freshEmps = JSON.parse(localStorage.getItem('airsystems_local_employees') || '[]');
    const updatedEmps = freshEmps.map((e: Employee) => {
      if (e.id === id) {
        const updateData: any = {
          ...e,
          name: empData.name,
          email: empData.email,
          balance: Number(empData.balance),
        };
        if (empData.site !== undefined) updateData.site = empData.site;
        if (empData.password) updateData.password = empData.password;
        if (empData.role) updateData.role = empData.role;
        return updateData;
      }
      return e;
    });

    localStorage.setItem('airsystems_local_employees', JSON.stringify(updatedEmps));
    setEmployees(updatedEmps);
    
    if (currentUser && id === currentUser.id) {
      const freshUser = updatedEmps.find((e: Employee) => e.id === id);
      if (freshUser) {
        setCredits(freshUser.balance);
        setCurrentUser(freshUser);
        localStorage.setItem('airsystems_user', JSON.stringify(freshUser));
      }
    }
  };

  const deleteEmployee = async (id: string) => {
    const freshEmps = JSON.parse(localStorage.getItem('airsystems_local_employees') || '[]');
    const updatedEmps = freshEmps.filter((e: Employee) => e.id !== id);
    localStorage.setItem('airsystems_local_employees', JSON.stringify(updatedEmps));
    setEmployees(updatedEmps);
  };

  if (!isMounted) return null;

  return (
    <StoreContext.Provider
      value={{
        credits,
        cart,
        addToCart,
        removeFromCart,
        cartTotal,
        checkout,
        isCartOpen,
        setIsCartOpen,
        currentUser,
        isAuthLoading,
        login,
        logout,
        globalProducts,
        categories,
        addProduct,
        editProduct,
        deleteProduct,
        addCategory,
        editCategory,
        deleteCategory,
        employees,
        updateEmployeeBalance,
        issueAnnualBucks,
        addEmployee,
        editEmployee,
        deleteEmployee,
        orders,
        updateOrderStatus
      }}
    >
      {isLoading ? (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a' }}>
          <div className="circle-animation" style={{ width: '50px', height: '50px' }}></div>
        </div>
      ) : children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
