import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquarePlus, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CustomerReviews: React.FC = () => {
  const { reviews, addReview } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    addReview({
      author,
      location: location || 'Cliente Verificado',
      productTitle: productTitle || 'Producto Importado',
      rating,
      comment,
      verifiedPurchase: true,
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setIsModalOpen(false);
      setAuthor('');
      setLocation('');
      setProductTitle('');
      setComment('');
      setRating(5);
    }, 1500);
  };

  const avgRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section id="opiniones" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Experiencias Reales de Compradores</span>
              <span aria-hidden="true">·</span>
              <span>100% Verificadas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Lo Que Dicen Quienes Ya Importaron Con Nosotros
            </h2>
          </div>

          {/* Aggregate Rating & Add Review Button */}
          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-900 tabular-nums">{avgRating} / 5</span>
              <span className="text-xs text-slate-500">({reviews.length} reseñas)</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Dejar Reseña</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/90 flex flex-col justify-between hover:bg-slate-50 transition-colors"
            >
              <div>
                {/* Rating & Verified Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verificada
                    </span>
                  )}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Product details */}
              <div className="pt-3 border-t border-slate-200/60">
                <div className="font-bold text-xs text-slate-900">{review.author}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span>{review.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{review.date}</span>
                </div>
                {review.productTitle && (
                  <div className="text-[10px] text-slate-400 font-medium truncate mt-1">
                    Compró: {review.productTitle}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">+5,000</div>
            <div className="text-xs text-slate-600 mt-0.5">Entregas Internacionales</div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">100%</div>
            <div className="text-xs text-slate-600 mt-0.5">Artículos Originales</div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">24 / 48h</div>
            <div className="text-xs text-slate-600 mt-0.5">Despacho Inmediato</div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">Garantía</div>
            <div className="text-xs text-slate-600 mt-0.5">Protección de Compra</div>
          </div>
        </div>
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Compartir tu Experiencia
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Tu opinión ayuda a otros compradores a confiar en productos importados originales.
            </p>

            {successMsg ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h4 className="text-sm font-bold">¡Gracias por tu reseña!</h4>
                <p className="text-xs text-slate-500">Se ha publicado exitosamente.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Daniel Gómez"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ciudad y País
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Medellín, Col"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Calificación
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Estrellas)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Estrellas)</option>
                      <option value={3}>⭐⭐⭐ (3 Estrellas)</option>
                      <option value={2}>⭐⭐ (2 Estrellas)</option>
                      <option value={1}>⭐ (1 Estrella)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Producto Comprado
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Auriculares Hi-Fi Studio Pro"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tu Opinión *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Cuéntanos sobre el tiempo de entrega, el estado del producto y la atención..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
                  >
                    Publicar Reseña
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
