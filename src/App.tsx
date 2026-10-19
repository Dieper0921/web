import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { TopProductsHero } from './components/TopProductsHero';
import { ProductCatalog } from './components/ProductCatalog';
import { CustomerReviews } from './components/CustomerReviews';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminPanel } from './components/AdminPanel';
import { FloatingActions } from './components/FloatingActions';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950">
        {/* Navigation & Announcement */}
        <Header />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* 1. Publicación Central al Inicio: Productos TOP */}
          <TopProductsHero />

          {/* 2. Catálogo General de Productos con Filtros, Precios y Descripciones */}
          <ProductCatalog />

          {/* 3. Proceso de Importación & Garantías de Autenticidad */}
          <TrustSection />

          {/* 4. En la parte baja: Reseñas de Personas */}
          <CustomerReviews />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating WhatsApp and Cart Shortcuts */}
        <FloatingActions />

        {/* Overlays, Drawers & Modals */}
        <CartDrawer />
        <OrderConfirmationModal />
        <ProductDetailModal />
        <AdminPanel />
      </div>
    </StoreProvider>
  );
}
