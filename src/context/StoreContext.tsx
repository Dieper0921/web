import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Review, StoreConfig, CustomerOrderData } from '../types/store';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_STORE_CONFIG } from '../data/initialData';

interface StoreContextType {
  products: Product[];
  storeConfig: StoreConfig;
  reviews: Review[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (username: string, password?: string) => { success: boolean; message?: string };
  logoutAdmin: () => void;
  updateAdminCredentials: (currentPassword: string, newUsername: string, newPassword: string) => { success: boolean; message: string };
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  confirmedOrder: CustomerOrderData | null;
  setConfirmedOrder: (order: CustomerOrderData | null) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  
  // Order Action
  submitOrder: (orderInfo: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    city: string;
    notes?: string;
    paymentMethod: string;
  }) => void;

  // Admin Actions
  updateStoreConfig: (newConfig: Partial<StoreConfig>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleTopProduct: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  deleteReview: (id: string) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'nexus_products_v1',
  CONFIG: 'nexus_config_v1',
  REVIEWS: 'nexus_reviews_v1',
  CART: 'nexus_cart_v1',
  ADMIN_AUTH: 'nexus_admin_auth_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Config
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STORE_CONFIG,
          ...parsed,
          adminUsername: parsed.adminUsername || INITIAL_STORE_CONFIG.adminUsername,
          adminPassword: parsed.adminPassword || INITIAL_STORE_CONFIG.adminPassword,
        };
      }
      return INITIAL_STORE_CONFIG;
    } catch {
      return INITIAL_STORE_CONFIG;
    }
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrderData | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CONFIG, JSON.stringify(storeConfig));
    } catch (e) {
      console.error(e);
    }
  }, [storeConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= storeConfig.freeShippingThreshold ? 0 : 15;
  const total = subtotal + shipping;

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    // Open drawer gently to give clear visual feedback
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // WhatsApp Order Submission with automatic confirmation
  const submitOrder = (orderInfo: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    city: string;
    notes?: string;
    paymentMethod: string;
  }) => {
    if (cart.length === 0) return;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `IMP-${randomSuffix}`;

    const orderData: CustomerOrderData = {
      orderNumber,
      customerName: orderInfo.customerName,
      customerPhone: orderInfo.customerPhone,
      deliveryAddress: orderInfo.deliveryAddress,
      city: orderInfo.city,
      notes: orderInfo.notes || '',
      paymentMethod: orderInfo.paymentMethod,
      items: [...cart],
      subtotal,
      shipping,
      total,
      createdAt: new Date().toLocaleString('es-ES', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    // Format WhatsApp message cleanly
    const itemsList = cart
      .map(
        (item) =>
          `• ${item.quantity}x *${item.product.name}* (${item.product.originFlag} ${item.product.originCountry}) - ${storeConfig.currencySymbol}${item.product.price * item.quantity}`
      )
      .join('\n');

    const message = `🛍️ *PEDIDO CONFIRMADO EN ${storeConfig.storeName}*
Ref: *#${orderNumber}*
📅 Fecha: ${orderData.createdAt}

👤 *DATOS DEL CLIENTE:*
• Nombre: ${orderInfo.customerName}
• Teléfono: ${orderInfo.customerPhone}
• Dirección: ${orderInfo.deliveryAddress}
• Ciudad: ${orderInfo.city}
• Pago: ${orderInfo.paymentMethod}
${orderInfo.notes ? `• Notas: ${orderInfo.notes}\n` : ''}
📦 *PRODUCTOS IMPORTADOS:*
${itemsList}

━━━━━━━━━━━━━━━━━
💵 *Subtotal:* ${storeConfig.currencySymbol}${subtotal}
🚚 *Envío:* ${shipping === 0 ? '¡GRATIS!' : `${storeConfig.currencySymbol}${shipping}`}
💰 *TOTAL A PAGAR:* ${storeConfig.currencySymbol}${total}
━━━━━━━━━━━━━━━━━

Hola, acabo de realizar este pedido en la web. ¿Me pueden confirmar la disponibilidad y tiempo estimado de entrega? ¡Gracias!`;

    // Clean phone number (remove spaces, symbols)
    const rawNumber = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodedMessage}`;

    // Show automatic confirmation on site
    setConfirmedOrder(orderData);
    setIsCartOpen(false);
    clearCart();

    // Trigger WhatsApp redirect
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Popup blocked, customer can use the confirmation modal button', e);
    }
  };

  // Admin Auth with Username & Password
  const loginAdmin = (username: string, password?: string) => {
    const expectedUser = storeConfig.adminUsername || 'admin';
    const expectedPass = storeConfig.adminPassword || 'admin123';

    if (password !== undefined) {
      if (username.trim() === expectedUser && password === expectedPass) {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');
        return { success: true };
      }
      return { success: false, message: 'Usuario o contraseña incorrectos. Verifica tus credenciales.' };
    }

    // Fallback if called with single parameter
    if (username.trim() === expectedPass || username.trim() === storeConfig.adminPin) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');
      return { success: true };
    }
    return { success: false, message: 'Contraseña o credencial incorrecta.' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH);
  };

  const updateAdminCredentials = (currentPassword: string, newUsername: string, newPassword: string) => {
    const expectedPass = storeConfig.adminPassword || 'admin123';
    if (currentPassword !== expectedPass) {
      return { success: false, message: 'La contraseña actual no es correcta.' };
    }
    if (!newUsername.trim() || newUsername.trim().length < 3) {
      return { success: false, message: 'El nombre de usuario debe tener al menos 3 caracteres.' };
    }
    if (!newPassword || newPassword.length < 5) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 5 caracteres.' };
    }

    setStoreConfig((prev) => ({
      ...prev,
      adminUsername: newUsername.trim(),
      adminPassword: newPassword,
    }));

    return { success: true, message: '¡Credenciales actualizadas exitosamente!' };
  };

  // Admin Product Actions
  const updateStoreConfig = (newConfig: Partial<StoreConfig>) => {
    setStoreConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleTopProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isTop: !item.isTop } : item
      )
    );
  };

  // Admin Review Actions
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Reciente',
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((item) => item.id !== id));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setStoreConfig(INITIAL_STORE_CONFIG);
    setReviews(INITIAL_REVIEWS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CONFIG);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REVIEWS);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        storeConfig,
        reviews,
        cart,
        isCartOpen,
        setIsCartOpen,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        selectedProduct,
        setSelectedProduct,
        confirmedOrder,
        setConfirmedOrder,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        shipping,
        total,
        submitOrder,
        updateStoreConfig,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleTopProduct,
        addReview,
        deleteReview,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
