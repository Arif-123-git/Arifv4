import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { ReceiptPrint } from './ReceiptPrint';
import { Transaction } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export const ReceiptDialog: React.FC<ReceiptDialogProps> = ({
  open,
  onOpenChange,
  transaction
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handlePrint = () => {
    if (!receiptRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk Pembayaran</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Courier New', monospace;
            }
            @media print {
              body { 
                width: 80mm;
                margin: 0;
                padding: 0;
              }
              @page {
                size: 80mm auto;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${receiptRef.current.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
    printWindow.close();

    toast({
      title: "Struk Dicetak",
      description: "Struk pembayaran berhasil dicetak"
    });
  };

  const handleDownload = () => {
    if (!receiptRef.current || !transaction) return;

    // Create a simple text version of the receipt
    const receiptText = `
TOKO SERBAGUNA
Jl. Merdeka No. 123
Telp: 0821-1234-5678

========================================
No. Transaksi: ${transaction.id.slice(-8).toUpperCase()}
Tanggal: ${new Date(transaction.createdAt).toLocaleString('id-ID')}
Kasir: ${transaction.cashierName}
${transaction.customerName ? `Pelanggan: ${transaction.customerName}\n` : ''}
========================================

DETAIL PEMBELIAN:
${transaction.items.map(item => 
  `${item.productName}\n${item.quantity} x ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)} = ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.total)}`
).join('\n\n')}

========================================
Subtotal: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.subtotal)}
Pajak (10%): ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.tax)}
TOTAL: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.total)}

Metode Bayar: ${transaction.paymentMethod === 'cash' ? 'Tunai' : transaction.paymentMethod === 'card' ? 'Kartu' : 'Digital'}

========================================
Terima kasih atas kunjungan Anda!
Barang yang sudah dibeli tidak dapat dikembalikan

*** STRUK PEMBAYARAN ***
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `struk-${transaction.id.slice(-8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Struk Diunduh",
      description: "File struk berhasil diunduh"
    });
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Struk Pembayaran</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <ReceiptPrint ref={receiptRef} transaction={transaction} />
          
          <div className="flex gap-2 justify-center">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Cetak
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Unduh
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};