import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, Package, MapPin, CreditCard, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationModal: React.FC = () => {
  const { confirmedOrder, setConfirmedOrder, storeConfig } = useStore();
  const [copied, setCopied] = useState(false);

  if (!confirmedOrder) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(confirmedOrder.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header with Celebration Banner */}
        <div className="bg-emerald-600 text-white p-6 text-center relative">
          <button
            onClick={() => setConfirmedOrder(null)}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg"
            aria-label="Cerrar confirmación"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-xl font-black tracking-tight">
            ¡Confirmación Automática de Pedido!
          </h3>
          <p className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
            Tu pedido ha sido generado y redirigido a la línea oficial de WhatsApp de {storeConfig.storeName}.
          </p>

          {/* Reference Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 rounded-full border border-white/20 text-xs font-mono font-bold">
            <span>Referencia: #{confirmedOrder.orderNumber}</span>
            <button
              onClick={handleCopyCode}
              className="text-emerald-100 hover:text-white transition-colors"
              title="Copiar código"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Content & Receipt */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Status Tracker */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Estado de tu solicitud:
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>1. Pedido Emitido</span>
              </div>
              <span className="text-slate-300">→</span>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>2. Confirmación WhatsApp</span>
              </div>
              <span className="text-slate-300">→</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-200" />
                <span>3. Despacho</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Destinatario:</strong> {confirmedOrder.customerName} ({confirmedOrder.customerPhone})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Destino:</strong> {confirmedOrder.deliveryAddress}, {confirmedOrder.city}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Método de Pago:</strong> {confirmedOrder.paymentMethod}
              </span>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="border-t border-slate-200 pt-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Resumen de Productos:</h4>
            <div className="space-y-2">
              {confirmedOrder.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono font-bold text-slate-700 tabular-nums">
                      {item.quantity}x
                    </span>
                    <span className="truncate text-slate-800">{item.product.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900 tabular-nums shrink-0 ml-2">
                    {storeConfig.currencySymbol}
                    {item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="border-t border-slate-200 pt-2 space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="tabular-nums">
                {storeConfig.currencySymbol}
                {confirmedOrder.subtotal}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Costo de Envío:</span>
              <span>
                {confirmedOrder.shipping === 0 ? (
                  <strong className="text-emerald-600">¡GRATIS!</strong>
                ) : (
                  `${storeConfig.currencySymbol}${confirmedOrder.shipping}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1">
              <span>Total a Pagar:</span>
              <span className="tabular-nums">
                {storeConfig.currencySymbol}
                {confirmedOrder.total} {storeConfig.currencyCode}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            Reabrir WhatsApp
          </a>

          <button
            onClick={() => setConfirmedOrder(null)}
            className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
