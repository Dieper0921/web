import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, Star, Plus, Minus, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, storeConfig } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!selectedProduct) return null;

  const discountPercent = selectedProduct.originalPrice
    ? Math.round(
        ((selectedProduct.originalPrice - selectedProduct.price) /
          selectedProduct.originalPrice) *
          100
      )
    : 0;

  const handleAdd = () => {
    addToCart(selectedProduct, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelectedProduct(null);
    }, 1200);
  };

  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');
  const directWhatsappText = encodeURIComponent(
    `Hola! Quisiera comprar directamente el producto importado:\n*${selectedProduct.name}*\nPrecio: ${storeConfig.currencySymbol}${selectedProduct.price}\nCantidad: ${quantity}\n¿Tienen disponibilidad para envío inmediato?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-slate-500 hover:text-slate-900 flex items-center justify-center shadow-md hover:bg-white transition-colors"
          aria-label="Cerrar modal de producto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image & Badges */}
        <div className="md:w-1/2 bg-slate-100 relative min-h-[260px] md:min-h-full">
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {selectedProduct.isTop && (
              <span className="px-2.5 py-1 text-xs font-bold text-slate-900 bg-amber-400 rounded-md shadow-xs">
                ★ TOP IMPORTACIÓN
              </span>
            )}
            {discountPercent > 0 && (
              <span className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 rounded-md shadow-xs">
                AHORRA {discountPercent}%
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl text-white text-xs flex items-center justify-between border border-slate-700">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-base">{selectedProduct.originFlag}</span>
              <span>Importado de {selectedProduct.originCountry}</span>
            </span>
            <span className="text-emerald-400 font-bold">100% Original</span>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="uppercase tracking-wider font-semibold">
                {selectedProduct.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold tabular-nums">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{selectedProduct.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({selectedProduct.reviewsCount} opiniones)
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
              {selectedProduct.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="text-3xl font-black text-slate-900 tabular-nums">
                {storeConfig.currencySymbol}
                {selectedProduct.price}
              </span>
              {selectedProduct.originalPrice && (
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  {storeConfig.currencySymbol}
                  {selectedProduct.originalPrice}
                </span>
              )}
              <span className="text-xs font-mono text-slate-500">
                {storeConfig.currencyCode}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
              {selectedProduct.detailedDescription || selectedProduct.description}
            </p>

            {/* Features / Highlights */}
            {selectedProduct.features && selectedProduct.features.length > 0 && (
              <div className="mb-6 space-y-1.5">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Especificaciones destacadas:
                </span>
                {selectedProduct.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Guarantees */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-6 space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garantía de originalidad con número de serie oficial</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Despacho rápido con seguro contra pérdidas o daños</span>
              </div>
            </div>
          </div>

          {/* Quantity and Buy Actions */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Cantidad:</span>
              <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 text-slate-600 hover:text-slate-900"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedProduct.stockCount, q + 1))}
                  className="p-1.5 text-slate-600 hover:text-slate-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleAdd}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? '¡Agregado al Carrito!' : 'Agregar al Carrito'}</span>
              </button>

              <a
                href={`https://wa.me/${cleanPhone}?text=${directWhatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Comprar por WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
