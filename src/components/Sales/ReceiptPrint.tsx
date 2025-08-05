import React, { forwardRef } from 'react';
import { Transaction } from '@/utils/localStorage';

interface ReceiptPrintProps {
  transaction: Transaction;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

export const ReceiptPrint = forwardRef<HTMLDivElement, ReceiptPrintProps>(
  ({ transaction, storeName = "Toko Serbaguna", storeAddress = "Jl. Merdeka No. 123", storePhone = "0821-1234-5678" }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };

    const getPaymentMethodText = (method: string) => {
      switch (method) {
        case 'cash': return 'Tunai';
        case 'card': return 'Kartu';
        case 'digital': return 'Digital';
        default: return method;
      }
    };

    return (
      <div 
        ref={ref}
        className="bg-white text-black p-4 max-w-sm mx-auto font-mono text-sm"
        style={{ 
          width: '302px', // 80mm thermal printer width
          fontSize: '12px',
          lineHeight: '1.2'
        }}
      >
        {/* Header */}
        <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-2">
          <h1 className="font-bold text-lg uppercase">{storeName}</h1>
          <p className="text-xs">{storeAddress}</p>
          <p className="text-xs">Telp: {storePhone}</p>
        </div>

        {/* Transaction Info */}
        <div className="text-xs mb-2 space-y-1">
          <div className="flex justify-between">
            <span>No. Transaksi:</span>
            <span>{transaction.id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{formatDate(transaction.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            <span>{transaction.cashierName}</span>
          </div>
          {transaction.customerName && (
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span>{transaction.customerName}</span>
            </div>
          )}
        </div>

        <div className="border-b border-dashed border-gray-400 mb-2"></div>

        {/* Items */}
        <div className="space-y-1 mb-2">
          {transaction.items.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between">
                <span className="truncate flex-1 pr-2">{item.productName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>{item.quantity} x {formatCurrency(item.price)}</span>
                <span>{formatCurrency(item.total)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-b border-dashed border-gray-400 mb-2"></div>

        {/* Totals */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(transaction.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pajak (10%):</span>
            <span>{formatCurrency(transaction.tax)}</span>
          </div>
          <div className="border-t border-gray-400 pt-1 mt-1">
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>{formatCurrency(transaction.total)}</span>
            </div>
          </div>
        </div>

        <div className="border-b border-dashed border-gray-400 my-2"></div>

        {/* Payment Method */}
        <div className="text-xs mb-3">
          <div className="flex justify-between">
            <span>Metode Bayar:</span>
            <span>{getPaymentMethodText(transaction.paymentMethod)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs space-y-1">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
          <p className="mt-2">*** STRUK PEMBAYARAN ***</p>
        </div>
      </div>
    );
  }
);

ReceiptPrint.displayName = 'ReceiptPrint';