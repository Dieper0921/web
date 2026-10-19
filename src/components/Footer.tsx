import React from 'react';
import { ShieldCheck, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { storeConfig, setIsAdminOpen } = useStore();
  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Store Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                NX
              </div>
              <span>{storeConfig.storeName}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {storeConfig.storeTagline}. Garantizamos autenticidad y los mejores precios en productos extranjeros originales.
            </p>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {storeConfig.whatsappNumber}</span>
            </a>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Navegación
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#productos-top" className="hover:text-white transition-colors">
                  Productos TOP Destacados
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  Catálogo General
                </a>
              </li>
              <li>
                <a href="#garantia" className="hover:text-white transition-colors">
                  Garantía & Proceso de Importación
                </a>
              </li>
              <li>
                <a href="#opiniones" className="hover:text-white transition-colors">
                  Reseñas de Clientes
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Policies & Guarantees */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Garantía & Envíos
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>100% Mercancía Original Certificada</li>
              <li>Factura y Seriales Oficiales</li>
              <li>Seguro Contra Pérdida en Tránsito</li>
              <li>Cambio Inmediato por Falla de Fábrica</li>
            </ul>
          </div>

          {/* Col 4: Store Management Access */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Administración
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Panel exclusivo para el propietario de la tienda para actualizar precios, productos y WhatsApp.
            </p>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Acceder al Panel Admin</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {storeConfig.storeName}. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Envíos Seguros a Todo el País</span>
            <span aria-hidden="true">·</span>
            <span>Atención Personalizada 24/7 vía WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
