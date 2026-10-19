import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, ShieldCheck, Plane, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TopProductsHero: React.FC = () => {
  const { products, storeConfig, addToCart, setSelectedProduct } = useStore();
  const topProducts = products.filter((p) => p.isTop);
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no top products, fallback to first few products
  const displayList = topProducts.length > 0 ? topProducts : products.slice(0, 3);
  const currentProduct = displayList[currentIndex] || displayList[0];

  useEffect(() => {
    if (displayList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [displayList.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayList.length);
  };

  if (!currentProduct) return null;

  const discountPercent = currentProduct.originalPrice
    ? Math.round(
        ((currentProduct.originalPrice - currentProduct.price) /
          currentProduct.originalPrice) *
          100
      )
    : 0;

  return (
    <section id="productos-top" className="relative bg-slate-900 text-white overflow-hidden py-10 lg:py-16">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent" />
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">
              <Plane className="w-3.5 h-3.5" />
              <span>Colección Exclusiva de Importación</span>
              <span aria-hidden="true">·</span>
              <span>Edición Especial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Publicación Central: Productos TOP
            </h2>
          </div>

          {/* Carousel Controls */}
          {displayList.length > 1 && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-mono text-slate-400 mr-2 tabular-nums">
                0{currentIndex + 1} / 0{displayList.length}
              </span>
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
                aria-label="Producto anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
                aria-label="Siguiente producto"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Featured Showcase Item */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-800/60 rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-700/80 backdrop-blur-sm">
          {/* Left Column: Image with badges & interactive viewer */}
          <div className="lg:col-span-6 relative group">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-700/60 relative">
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback styled visual container
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Top Tag & Origin Flag */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-bold text-slate-900 bg-amber-400 rounded-md shadow">
                  ★ TOP VENTAS
                </span>
                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 rounded-md shadow">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {/* Origin badge bottom right */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-lg text-xs font-medium text-slate-200 border border-slate-700">
                <span className="text-base">{currentProduct.originFlag}</span>
                <span>Origen: {currentProduct.originCountry}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Information & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & Status */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span className="uppercase tracking-wider font-semibold text-slate-300">
                  {currentProduct.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Original Sellado
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  Stock: {currentProduct.stockCount} unid.
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-3">
                {currentProduct.name}
              </h3>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5">
                {currentProduct.detailedDescription || currentProduct.description}
              </p>

              {/* Highlights */}
              {currentProduct.features && currentProduct.features.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {currentProduct.features.slice(0, 4).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/40 px-2.5 py-1.5 rounded-md border border-slate-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing Display */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                  {storeConfig.currencySymbol}
                  {currentProduct.price}
                </span>
                {currentProduct.originalPrice && (
                  <span className="text-base sm:text-lg text-slate-400 line-through tabular-nums">
                    {storeConfig.currencySymbol}
                    {currentProduct.originalPrice}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  {storeConfig.currencyCode}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => addToCart(currentProduct, 1)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                Agregar al Carrito
              </button>

              <button
                onClick={() => setSelectedProduct(currentProduct)}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-slate-200 hover:text-white bg-slate-700/70 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 whitespace-nowrap"
              >
                <Eye className="w-4 h-4" />
                Ver Detalles
              </button>

              <a
                href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hola!%20Me%20interesa%20el%20producto%20TOP%20*${encodeURIComponent(currentProduct.name)}*%20(${storeConfig.currencySymbol}${currentProduct.price})`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/80 rounded-lg transition-colors whitespace-nowrap"
              >
                Consulta Rápida
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Mini pagination indicator thumbnails */}
        {displayList.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {displayList.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all ${
                  currentIndex === idx
                    ? 'bg-amber-400 text-slate-900 font-bold shadow'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                <span>{item.originFlag}</span>
                <span className="truncate max-w-[120px] sm:max-w-xs">{item.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
