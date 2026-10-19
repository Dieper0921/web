import React from 'react';
import { ShieldCheck, Plane, Box, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TrustSection: React.FC = () => {
  const { storeConfig } = useStore();
  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section id="garantia" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Garantía de Importación Total</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ¿Cómo Garantizamos Tu Compra?
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Eliminamos cualquier riesgo en tus compras de artículos extranjeros. Cada producto pasa por un riguroso control antes de llegar a tus manos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80">
            <div className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center text-amber-400 mb-4">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">1. Origen Certificado</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compramos directamente a distribuidores oficiales y marcas autorizadas en Estados Unidos, Europa y Japón.
            </p>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80">
            <div className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">2. Aduanas Gestionadas</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Todos los impuestos y nacionalizaciones están 100% resueltos. El precio que ves es el precio final a pagar.
            </p>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80">
            <div className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center text-blue-400 mb-4">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">3. Empaque Sellado</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recibes el producto en su caja original de fábrica con celofán, sellos y números de serie intactos.
            </p>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80">
            <div className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center text-purple-400 mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">4. Asesoría Personalizada</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Te acompañamos paso a paso por WhatsApp desde el momento en que realizas el pedido hasta que lo recibes en tu puerta.
            </p>
          </div>
        </div>

        {/* WhatsApp Banner Callout */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-emerald-900/60 via-slate-800/80 to-slate-800/60 rounded-2xl border border-emerald-700/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="text-lg font-bold text-white">¿Buscas un producto específico que no ves en catálogo?</h4>
            <p className="text-xs text-emerald-200 mt-1">
              Podemos cotizar cualquier producto o marca que desees traer bajo pedido especial.
            </p>
          </div>
          <a
            href={`https://wa.me/${cleanPhone}?text=Hola!%20Quisiera%20cotizar%20un%20producto%20importado%20bajo%20pedido%20especial`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            Consultar Importación Especial
          </a>
        </div>
      </div>
    </section>
  );
};
