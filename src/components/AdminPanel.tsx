import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
  Phone,
  Image,
  Store,
  DollarSign,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import { CATEGORIES } from '../data/initialData';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateAdminCredentials,
    storeConfig,
    updateStoreConfig,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleTopProduct,
    reviews,
    deleteReview,
    resetToDefaults,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'config' | 'products' | 'reviews' | 'security'>('config');

  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Security Credentials Update State
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Store Config Edit State
  const [tempConfig, setTempConfig] = useState(storeConfig);
  const [savedConfigSuccess, setSavedConfigSuccess] = useState(false);

  // Product Form State (Add / Edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<{
    name: string;
    description: string;
    detailedDescription: string;
    price: number;
    originalPrice: number;
    category: string;
    imageUrl: string;
    originCountry: string;
    originFlag: string;
    isTop: boolean;
    inStock: boolean;
    stockCount: number;
    tags: string;
  }>({
    name: '',
    description: '',
    detailedDescription: '',
    price: 0,
    originalPrice: 0,
    category: CATEGORIES[1],
    imageUrl: '',
    originCountry: 'Estados Unidos',
    originFlag: '🇺🇸',
    isTop: true,
    inStock: true,
    stockCount: 10,
    tags: 'Importado, Original',
  });

  // Keep temp config in sync when storeConfig changes
  useEffect(() => {
    setTempConfig(storeConfig);
  }, [storeConfig]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  if (!isAdminOpen) return null;

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    if (!usernameInput.trim() || !passwordInput) {
      setAuthError('Por favor ingresa tu nombre de usuario y contraseña.');
      return;
    }

    const result = loginAdmin(usernameInput, passwordInput);
    if (result.success) {
      setAuthError(null);
      setUsernameInput('');
      setPasswordInput('');
      setFailedAttempts(0);
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 5) {
        setLockoutSeconds(30);
        setAuthError('Has superado 5 intentos fallidos. Por seguridad, espera 30 segundos.');
      } else {
        setAuthError(`${result.message || 'Credenciales incorrectas.'} (Intento ${attempts} de 5)`);
      }
    }
  };

  // Helper to pre-fill demo credentials
  const fillDemoCredentials = () => {
    setUsernameInput(storeConfig.adminUsername || 'admin');
    setPasswordInput(storeConfig.adminPassword || 'admin123');
    setAuthError(null);
  };

  // Handle Save Store Config
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig(tempConfig);
    setSavedConfigSuccess(true);
    setTimeout(() => setSavedConfigSuccess(false), 2000);
  };

  // Handle Security Credentials Change
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (newPasswordInput !== confirmPasswordInput) {
      setSecurityMessage({
        type: 'error',
        text: 'La nueva contraseña y su confirmación no coinciden.',
      });
      return;
    }

    const res = updateAdminCredentials(
      currentPassInput,
      newUsernameInput || storeConfig.adminUsername,
      newPasswordInput
    );

    if (res.success) {
      setSecurityMessage({ type: 'success', text: res.message });
      setCurrentPassInput('');
      setNewUsernameInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } else {
      setSecurityMessage({ type: 'error', text: res.message });
    }
  };

  // Open Edit Product Modal
  const startEditing = (p: Product) => {
    setEditingProduct(p);
    setIsAddingProduct(false);
    setProductForm({
      name: p.name,
      description: p.description,
      detailedDescription: p.detailedDescription || '',
      price: p.price,
      originalPrice: p.originalPrice || 0,
      category: p.category,
      imageUrl: p.imageUrl,
      originCountry: p.originCountry,
      originFlag: p.originFlag,
      isTop: p.isTop,
      inStock: p.inStock,
      stockCount: p.stockCount,
      tags: p.tags ? p.tags.join(', ') : '',
    });
  };

  const startAdding = () => {
    setEditingProduct(null);
    setIsAddingProduct(true);
    setProductForm({
      name: '',
      description: '',
      detailedDescription: '',
      price: 99,
      originalPrice: 130,
      category: CATEGORIES[1],
      imageUrl: '/src/assets/images/hero_imported_showcase_1792451247969.jpg',
      originCountry: 'Estados Unidos',
      originFlag: '🇺🇸',
      isTop: true,
      inStock: true,
      stockCount: 10,
      tags: 'Importado USA, Original',
    });
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = productForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productForm.name,
        description: productForm.description,
        detailedDescription: productForm.detailedDescription,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || undefined,
        category: productForm.category,
        imageUrl: productForm.imageUrl,
        originCountry: productForm.originCountry,
        originFlag: productForm.originFlag,
        isTop: productForm.isTop,
        inStock: productForm.inStock,
        stockCount: Number(productForm.stockCount),
        tags: tagsArray,
      });
      setEditingProduct(null);
    } else if (isAddingProduct) {
      addProduct({
        name: productForm.name,
        description: productForm.description,
        detailedDescription: productForm.detailedDescription,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || undefined,
        category: productForm.category,
        imageUrl: productForm.imageUrl,
        originCountry: productForm.originCountry,
        originFlag: productForm.originFlag,
        isTop: productForm.isTop,
        inStock: productForm.inStock,
        stockCount: Number(productForm.stockCount),
        rating: 5.0,
        reviewsCount: 1,
        tags: tagsArray,
        features: ['100% Original Sellado', 'Garantía Internacional'],
      });
      setIsAddingProduct(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Admin Top Banner */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Panel de Administración</h2>
                {isAdminAuthenticated && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    SESIÓN ACTIVA
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAdminAuthenticated
                  ? `Conectado como: ${storeConfig.adminUsername || 'admin'}`
                  : 'Control seguro de catálogo, pedidos y WhatsApp'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Cerrar panel de administración"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================================
            AUTH GATE (Nombre de Usuario & Contraseña)
           ========================================================================= */}
        {!isAdminAuthenticated ? (
          <div className="p-6 sm:p-10 max-w-md mx-auto my-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-800 shadow-xs border border-slate-200">
                <Lock className="w-7 h-7 text-slate-800" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Iniciar Sesión de Administrador</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ingresa con tu nombre de usuario y contraseña autorizados para gestionar la tienda.
              </p>
            </div>

            {/* Error banner */}
            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ej: admin"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      setAuthError(null);
                    }}
                    disabled={lockoutSeconds > 0}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 disabled:opacity-50"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Ingresa tu contraseña"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError(null);
                    }}
                    disabled={lockoutSeconds > 0}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={lockoutSeconds > 0}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>
                  {lockoutSeconds > 0
                    ? `Bloqueado temporalmente (${lockoutSeconds}s)`
                    : 'Acceder al Panel de Control'}
                </span>
              </button>
            </form>

            {/* Quick Demo Credentials Assistant */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Credenciales iniciales:</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Autocompletar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono bg-white p-2 rounded-lg border border-slate-200/80">
                <div>
                  <span className="text-slate-400">Usuario:</span>{' '}
                  <strong className="text-slate-800">{storeConfig.adminUsername || 'admin'}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Clave:</span>{' '}
                  <strong className="text-slate-800">{storeConfig.adminPassword || 'admin123'}</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                * Puedes cambiar el usuario y contraseña dentro de la pestaña "Seguridad".
              </p>
            </div>
          </div>
        ) : (
          /* =========================================================================
             AUTHENTICATED ADMIN VIEWS (All Management Tools)
             ========================================================================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 bg-slate-50 shrink-0 overflow-x-auto">
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveTab('config')}
                  className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'config'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Tienda & WhatsApp</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'products'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Productos ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reseñas ({reviews.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'security'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Seguridad</span>
                </button>
              </div>

              {/* Right Admin Utilities */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm('¿Seguro que deseas reiniciar los datos al catálogo inicial predeterminado?')) {
                      resetToDefaults();
                      setTempConfig(storeConfig);
                    }
                  }}
                  className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 py-1 px-2 rounded hover:bg-slate-200/50"
                  title="Restaurar datos predeterminados"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reiniciar</span>
                </button>

                <button
                  onClick={logoutAdmin}
                  className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-rose-600 font-semibold py-1.5 px-3 rounded-lg bg-slate-200/80 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: General Settings & WhatsApp Configuration */}
              {activeTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="max-w-2xl mx-auto space-y-6">
                  {savedConfigSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ¡Configuración guardada correctamente! Los cambios ya están visibles en la tienda.
                    </div>
                  )}

                  {/* WhatsApp Highlight Box */}
                  <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-emerald-950">
                            Número Telefónico de WhatsApp para Pedidos
                          </h4>
                          <p className="text-[11px] text-emerald-800">
                            Aquí llegarán los pedidos con los productos seleccionados y confirmación automática.
                          </p>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${tempConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=Prueba%20de%20conexion`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1 shadow-2xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Probar
                      </a>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Número con código de país (Ej: +1 555 123 4567, +54 9 11 1234 5678, +52 1 55...)
                      </label>
                      <input
                        type="text"
                        required
                        value={tempConfig.whatsappNumber}
                        onChange={(e) =>
                          setTempConfig({ ...tempConfig, whatsappNumber: e.target.value })
                        }
                        className="w-full text-sm font-mono px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-600 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Store Branding */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nombre de la Tienda
                      </label>
                      <input
                        type="text"
                        required
                        value={tempConfig.storeName}
                        onChange={(e) =>
                          setTempConfig({ ...tempConfig, storeName: e.target.value })
                        }
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Eslogan / Subtítulo
                      </label>
                      <input
                        type="text"
                        value={tempConfig.storeTagline}
                        onChange={(e) =>
                          setTempConfig({ ...tempConfig, storeTagline: e.target.value })
                        }
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  {/* Logo Custom Image URL */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      URL del Logotipo Personalizado (opcional)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="url"
                        placeholder="https://... o ruta de imagen"
                        value={tempConfig.logoCustomUrl || ''}
                        onChange={(e) =>
                          setTempConfig({ ...tempConfig, logoCustomUrl: e.target.value })
                        }
                        className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                      />
                      {tempConfig.logoCustomUrl && (
                        <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white p-1 shrink-0">
                          <img
                            src={tempConfig.logoCustomUrl}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Currency & Free Shipping */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Símbolo de Moneda
                      </label>
                      <input
                        type="text"
                        value={tempConfig.currencySymbol}
                        onChange={(e) =>
                          setTempConfig({ ...tempConfig, currencySymbol: e.target.value })
                        }
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Código de Moneda
                      </label>
                      <input
                        type="text"
                        value={tempConfig.currencyCode}
                        onChange={(e) =>
                          setTempConfig({ ...tempConfig, currencyCode: e.target.value })
                        }
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Monto para Envío Gratis
                      </label>
                      <input
                        type="number"
                        value={tempConfig.freeShippingThreshold}
                        onChange={(e) =>
                          setTempConfig({
                            ...tempConfig,
                            freeShippingThreshold: Number(e.target.value),
                          })
                        }
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Announcement banner */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mensaje de la Barra Superior de Anuncios
                    </label>
                    <input
                      type="text"
                      value={tempConfig.announcementText}
                      onChange={(e) =>
                        setTempConfig({ ...tempConfig, announcementText: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      Guardar Configuración de Tienda
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Products CRUD */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {/* Top Bar: Add Product Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Catálogo de Productos ({products.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Modifica precios, fotos, descripciones o destaca productos en la publicación central TOP.
                      </p>
                    </div>

                    <button
                      onClick={startAdding}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nuevo Producto Importado</span>
                    </button>
                  </div>

                  {/* Products Table / List */}
                  <div className="space-y-3">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {p.name}
                              </span>
                              {p.isTop && (
                                <span className="px-2 py-0.2 text-[10px] font-bold bg-amber-400 text-slate-900 rounded-md">
                                  ★ TOP
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>{p.category}</span>
                              <span>·</span>
                              <span>
                                {p.originFlag} {p.originCountry}
                              </span>
                              <span>·</span>
                              <span className="font-bold text-slate-900 tabular-nums">
                                {storeConfig.currencySymbol}
                                {p.price}
                              </span>
                              {p.originalPrice && (
                                <span className="line-through text-slate-400 tabular-nums">
                                  {storeConfig.currencySymbol}
                                  {p.originalPrice}
                                </span>
                              )}
                              <span>·</span>
                              <span>Stock: {p.stockCount}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions for this item */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            onClick={() => toggleTopProduct(p.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                              p.isTop
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-200/80 text-slate-600 hover:bg-slate-200'
                            }`}
                            title="Alternar producto TOP en la publicación central"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{p.isTop ? 'En Top' : 'Hacer Top'}</span>
                          </button>

                          <button
                            onClick={() => startEditing(p)}
                            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                            title="Editar producto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar ${p.name}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">
                      Reseñas de Clientes ({reviews.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{r.author}</span>
                            <span className="text-[11px] text-slate-500">({r.location})</span>
                            <span className="text-amber-500 text-xs">
                              {'★'.repeat(r.rating)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 mt-1 italic">"{r.comment}"</p>
                          {r.productTitle && (
                            <p className="text-[10px] text-slate-400 mt-1">
                              Producto: {r.productTitle}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => deleteReview(r.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                          title="Eliminar reseña"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Security & Credentials Management */}
              {activeTab === 'security' && (
                <div className="max-w-xl mx-auto space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-500" />
                      <span>Cambiar Credenciales de Acceso Administrador</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Aquí puedes actualizar tu nombre de usuario y tu contraseña segura.
                    </p>
                  </div>

                  {securityMessage && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                        securityMessage.type === 'success'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      {securityMessage.type === 'success' ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{securityMessage.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSecuritySubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contraseña Actual *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Ingresa tu contraseña actual"
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-200/80">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nuevo Nombre de Usuario
                      </label>
                      <input
                        type="text"
                        placeholder={storeConfig.adminUsername || 'admin'}
                        value={newUsernameInput}
                        onChange={(e) => setNewUsernameInput(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Deja en blanco si deseas mantener "{storeConfig.adminUsername || 'admin'}".
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nueva Contraseña *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Mínimo 5 caracteres"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirmar Nueva Contraseña *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Repite la nueva contraseña"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Actualizar Credenciales</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for Adding or Editing Product */}
        {(isAddingProduct || editingProduct) && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  {editingProduct ? 'Editar Producto Importado' : 'Agregar Nuevo Producto Importado'}
                </h3>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddingProduct(false);
                  }}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Precio de Venta ({storeConfig.currencySymbol}) *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({ ...productForm, price: Number(e.target.value) })
                      }
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Precio Original (Tachado)
                    </label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) =>
                        setProductForm({ ...productForm, originalPrice: Number(e.target.value) })
                      }
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full text-xs px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      {CATEGORIES.filter((c) => c !== 'Todos').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Stock Disponible
                    </label>
                    <input
                      type="number"
                      value={productForm.stockCount}
                      onChange={(e) =>
                        setProductForm({ ...productForm, stockCount: Number(e.target.value) })
                      }
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      País de Origen
                    </label>
                    <input
                      type="text"
                      value={productForm.originCountry}
                      onChange={(e) =>
                        setProductForm({ ...productForm, originCountry: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bandera (Emoji)
                    </label>
                    <input
                      type="text"
                      value={productForm.originFlag}
                      onChange={(e) =>
                        setProductForm({ ...productForm, originFlag: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Image URL with Preview */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL de la Imagen *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Ruta local o URL"
                      value={productForm.imageUrl}
                      onChange={(e) =>
                        setProductForm({ ...productForm, imageUrl: e.target.value })
                      }
                      className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                    {productForm.imageUrl && (
                      <img
                        src={productForm.imageUrl}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descripción Corta (Catálogo) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descripción Detallada (Modal)
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.detailedDescription}
                    onChange={(e) =>
                      setProductForm({ ...productForm, detailedDescription: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                {/* Checkbox for Top Product */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isTop"
                    checked={productForm.isTop}
                    onChange={(e) => setProductForm({ ...productForm, isTop: e.target.checked })}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                  <label htmlFor="isTop" className="text-xs font-semibold text-slate-800">
                    Mostrar en la Publicación Central de Productos TOP
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsAddingProduct(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
                  >
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
