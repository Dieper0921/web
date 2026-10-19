import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Eye, Star, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';
import { Product } from '../types/store';

export const ProductCatalog: React.FC = () => {
  const { products, storeConfig, addToCart, setSelectedProduct } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'Todos' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.originCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // featured: top products first, then highest stock
        if (a.isTop && !b.isTop) return -1;
        if (!a.isTop && b.isTop) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  return (
    <section id="catalogo" className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title & Subtitle */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Catálogo Completo</span>
            <span aria-hidden="true">·</span>
            <span>Importaciones Auténticas</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-bold">Entrega Inmediata</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explora Nuestros Productos Importados
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Cada artículo es rigurosamente verificado, sellado de fábrica y listo para ser enviado a tu domicilio con garantía total.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, país de origen, categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap hidden sm:inline">
                Ordenar por:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                <option value="featured">Destacados & Top</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificados</option>
              </select>
            </div>
          </div>

          {/* Interactive Category Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-slate-100 mt-4 no-scrollbar">
            {CATEGORIES.map((category) => {
              const count =
                category === 'Todos'
                  ? products.length
                  : products.filter((p) => p.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded-full ${
                      selectedCategory === category
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-base font-semibold text-slate-800">
              No se encontraron productos con esos filtros.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Prueba cambiando el término de búsqueda o selecciona otra categoría.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todos');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const discountPercent = product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )
                : 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Card Image Container */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {product.isTop && (
                        <span className="px-2 py-0.5 text-[11px] font-bold text-slate-900 bg-amber-400 rounded-md shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          TOP
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="px-2 py-0.5 text-[11px] font-bold text-white bg-rose-600 rounded-md shadow-xs">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Origin Country Tag */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md text-[11px] font-medium text-slate-700 shadow-xs flex items-center gap-1">
                      <span>{product.originFlag}</span>
                      <span>{product.originCountry}</span>
                    </div>

                    {/* Quick view hover action button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-medium rounded-lg backdrop-blur-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Vista Rápida
                    </button>
                  </div>

                  {/* Product Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta header */}
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                        <span className="uppercase tracking-wider font-semibold text-[11px]">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold tabular-nums text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-slate-400 font-normal">
                            ({product.reviewsCount})
                          </span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="text-base font-bold text-slate-900 hover:text-slate-700 cursor-pointer tracking-tight leading-snug line-clamp-1 mb-2"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Product Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Cart Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                            {storeConfig.currencySymbol}
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through tabular-nums">
                              {storeConfig.currencySymbol}
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          Stock: {product.stockCount} disp.
                        </span>
                      </div>

                      {/* Add to Cart button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs whitespace-nowrap ${
                          addedProductId === product.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                        aria-label={`Agregar ${product.name} al carrito`}
                      >
                        {addedProductId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            ¡Agregado!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Agregar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
