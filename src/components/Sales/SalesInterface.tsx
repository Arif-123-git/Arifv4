import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Search, CreditCard, Banknote, Smartphone, Trash2, Receipt } from 'lucide-react';
import { getProducts, addTransaction, type Product, type TransactionItem, type Transaction } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import { ReceiptDialog } from './ReceiptDialog';

export const SalesInterface = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [customerName, setCustomerName] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "Stok Habis",
        description: `Produk ${product.name} tidak tersedia`,
        variant: "destructive"
      });
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Stok Tidak Cukup",
          description: `Stok ${product.name} hanya tersisa ${product.stock}`,
          variant: "destructive"
        });
        return;
      }
      updateCartQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: TransactionItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      };
      setCart([...cart, newItem]);
    }
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      toast({
        title: "Stok Tidak Cukup",
        description: `Stok ${product.name} hanya tersisa ${product.stock}`,
        variant: "destructive"
      });
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tambahkan produk ke keranjang terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    const transaction = {
      items: cart,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      paymentMethod,
      customerName: customerName || undefined,
      cashierName: 'Admin' // In a real app, this would come from authentication
    };

    try {
      const completedTransaction = addTransaction(transaction);
      
      // Set transaction for receipt
      setLastTransaction(completedTransaction);
      
      // Clear cart and reset form
      setCart([]);
      setCustomerName('');
      setSearchTerm('');
      
      // Refresh products to show updated stock
      setProducts(getProducts());
      
      toast({
        title: "Transaksi Berhasil",
        description: `Total: ${formatCurrency(transaction.total)}`,
      });

      // Show receipt dialog
      setShowReceipt(true);
    } catch (error) {
      toast({
        title: "Transaksi Gagal",
        description: "Terjadi kesalahan saat memproses transaksi",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kasir</h1>
          <p className="text-muted-foreground">Pilih produk untuk ditambahkan ke keranjang</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk, barcode, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          {filteredProducts.map(product => (
            <Card 
              key={product.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium line-clamp-2">{product.name}</h3>
                    <Badge variant={product.stock <= 10 ? "destructive" : "secondary"}>
                      {product.stock}
                    </Badge>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart and Checkout */}
      <div className="space-y-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Keranjang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Name */}
            <div>
              <Input
                placeholder="Nama pelanggan (opsional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            {/* Cart Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map(item => (
                <div key={item.productId} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {cart.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Keranjang kosong
                </p>
              )}
            </div>

            {cart.length > 0 && (
              <>
                <Separator />
                
                {/* Payment Method */}
                <div>
                  <p className="text-sm font-medium mb-2">Metode Pembayaran</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <Banknote className="h-4 w-4 mr-1" />
                      Tunai
                    </Button>
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Kartu
                    </Button>
                    <Button
                      variant={paymentMethod === 'digital' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPaymentMethod('digital')}
                    >
                      <Smartphone className="h-4 w-4 mr-1" />
                      Digital
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pajak (10%):</span>
                    <span>{formatCurrency(calculateTax())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proses Pembayaran
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Receipt Dialog */}
      <ReceiptDialog 
        open={showReceipt}
        onOpenChange={setShowReceipt}
        transaction={lastTransaction}
      />
    </div>
  );
};