import React from 'react';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FloatingActions: React.FC = () => {
  const { storeConfig, cartCount, setIsCartOpen } = useStore();
  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-3 pointer-events-none">
      {/* Floating Cart Button (shows if items in cart) */}
      {cartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="pointer-events-auto flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-xl border border-slate-700 transition-all hover:scale-105"
          aria-label="Abrir carrito"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-xs font-bold tabular-nums">
            {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
          </span>
          <span className="w-2 h-2 rounded-full bg-amber-400" />
        </button>
      )}

      {/* Floating WhatsApp Action */}
      <a
        href={`https://wa.me/${cleanPhone}?text=Hola!%20Tengo%20una%20consulta%20sobre%20sus%20productos%20importados`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="text-xs font-bold hidden sm:inline">¿Dudas? Chatea por WhatsApp</span>
      </a>
    </div>
  );
};
