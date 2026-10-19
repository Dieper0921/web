import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, MessageCircle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const { storeConfig, cartCount, setIsCartOpen, setIsAdminOpen } = useStore();
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Announcement Bar */}
      {showAnnouncement && storeConfig.announcementText && (
        <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs flex items-center justify-between transition-all">
          <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-hidden text-center truncate">
            <span className="truncate">{storeConfig.announcementText}</span>
            <a
              href={`https://wa.me/${cleanPhone}?text=Hola!%20Tengo%20una%20consulta%20sobre%20los%20productos%20importados`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Directo
            </a>
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="text-slate-400 hover:text-white p-1 shrink-0 ml-2"
            aria-label="Cerrar anuncio"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation - Strict Top Bar Contract: Brand — 4-5 single-line links — Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark / logo */}
        <a href="#" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
          {storeConfig.logoCustomUrl ? (
            <img
              src={storeConfig.logoCustomUrl}
              alt={storeConfig.storeName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black tracking-wider text-sm shadow-sm group-hover:bg-slate-800 transition-colors">
              NX
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
              {storeConfig.storeName}
            </span>
            <span className="text-[11px] text-slate-500 font-medium tracking-normal hidden sm:inline">
              {storeConfig.storeTagline}
            </span>
          </div>
        </a>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#productos-top"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Productos TOP
          </a>
          <a
            href="#catalogo"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Catálogo
          </a>
          <a
            href="#garantia"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Importación & Garantía
          </a>
          <a
            href="#opiniones"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Reseñas
          </a>
        </nav>

        {/* Zone 3: Actions - Admin Logo + Shopping Bag Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Admin Section Access Logo Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Panel de Administrador"
            aria-label="Abrir panel de administración"
          >
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
            aria-label={`Ver carrito de compras con ${cartCount} productos`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-slate-900 bg-amber-400 rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
