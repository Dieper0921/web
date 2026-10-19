import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    total,
    storeConfig,
    submitOrder,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = storeConfig.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg('Por favor ingresa un teléfono o WhatsApp de contacto.');
      return;
    }
    if (!deliveryAddress.trim() || !city.trim()) {
      setErrorMsg('Por favor completa la dirección y ciudad de entrega.');
      return;
    }

    setErrorMsg('');
    submitOrder({
      customerName,
      customerPhone,
      deliveryAddress,
      city,
      notes,
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tu Carrito de Compras</h2>
              <p className="text-xs text-slate-500">
                {cart.length === 0
                  ? 'Aún no has agregado productos'
                  : `${cart.reduce((a, b) => a + b.quantity, 0)} artículo(s) importado(s)`}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Truck className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explora nuestro catálogo de productos importados exclusivos y agrégalos a tu pedido.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Free Shipping Progress Indicator */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      {remainingForFreeShipping === 0 ? (
                        <span className="text-emerald-600 font-bold">¡Calificas para Envío Gratis! 🎉</span>
                      ) : (
                        <span>
                          Faltan{' '}
                          <strong className="text-slate-900 tabular-nums">
                            {storeConfig.currencySymbol}
                            {remainingForFreeShipping}
                          </strong>{' '}
                          para Envío Gratis
                        </span>
                      )}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px] tabular-nums">
                      {freeShippingProgress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-4 flex gap-3.5 items-center">
                      {/* Thumbnail */}
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />

                      {/* Info & Quantity controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate" title={item.product.name}>
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            title="Eliminar producto"
                            aria-label={`Eliminar ${item.product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center gap-1 my-1">
                          <span>{item.product.originFlag}</span>
                          <span>{item.product.originCountry}</span>
                          <span>·</span>
                          <span className="font-semibold text-slate-800 tabular-nums">
                            {storeConfig.currencySymbol}
                            {item.product.price} c/u
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-l-lg transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-slate-900 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (item.quantity < item.product.stockCount) {
                                  updateQuantity(item.product.id, item.quantity + 1);
                                }
                              }}
                              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-r-lg transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-slate-900 tabular-nums">
                            {storeConfig.currencySymbol}
                            {item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="text-right">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors underline"
                  >
                    Vaciar todo el carrito
                  </button>
                </div>

                {/* Delivery Information Form */}
                <form id="checkout-form" onSubmit={handleCheckout} className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Datos de Envío & Entrega
                    </span>
                    <span className="text-[10px] text-slate-400">Requerido para WhatsApp</span>
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Tu Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Martínez"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+54 9 11..."
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Ciudad / Región *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Buenos Aires"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Dirección de Entrega Completa *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Calle, número, depto o referencia"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Método de Pago Preferido
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full text-xs px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                      >
                        <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                        <option value="Contra Entrega / Efectivo">Pago Contra Entrega</option>
                        <option value="Tarjeta / Link de Pago">Tarjeta de Crédito / Débito</option>
                        <option value="Cripto (USDT / BTC)">Cripto (USDT / BTC)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Notas Opcionales
                      </label>
                      <input
                        type="text"
                        placeholder="Horario preferido, etc."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Drawer Footer with Subtotals & WhatsApp Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {storeConfig.currencySymbol}
                    {subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío a domicilio:</span>
                  <span className="font-semibold tabular-nums text-slate-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">¡GRATIS!</span>
                    ) : (
                      `${storeConfig.currencySymbol}${shipping}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Total Estimado:</span>
                  <span className="tabular-nums">
                    {storeConfig.currencySymbol}
                    {total} {storeConfig.currencyCode}
                  </span>
                </div>
              </div>

              {/* WhatsApp Checkout Button */}
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>Pedir por WhatsApp Directo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Confirmación automática y atención inmediata en WhatsApp</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
