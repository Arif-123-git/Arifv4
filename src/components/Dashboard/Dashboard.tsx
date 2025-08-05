import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, DollarSign, TrendingUp } from 'lucide-react';
import { getTransactions, getProducts } from '@/utils/localStorage';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    todaySales: 0,
    totalProducts: 0,
    lowStockProducts: 0
  });

  useEffect(() => {
    const transactions = getTransactions();
    const products = getProducts();
    
    const today = new Date().toDateString();
    const todayTransactions = transactions.filter(t => 
      new Date(t.createdAt).toDateString() === today
    );
    
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
    const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
    const lowStockProducts = products.filter(p => p.stock <= 10).length;
    
    setStats({
      totalSales,
      todaySales,
      totalProducts: products.length,
      lowStockProducts
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
      <div className="bg-gradient-to-r from-primary to-green-600 text-primary-foreground p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-primary-foreground/90">Selamat datang di sistem POS Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penjualan Hari Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.todaySales)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.lowStockProducts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <ShoppingCart className="h-4 w-4 text-muted-foreground mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Transaksi baru berhasil</p>
                  <p className="text-xs text-muted-foreground">2 menit yang lalu</p>
                </div>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-muted-foreground mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Stok produk diperbarui</p>
                  <p className="text-xs text-muted-foreground">15 menit yang lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transaksi Hari Ini</span>
                <span className="font-medium">{getTransactions().filter(t => 
                  new Date(t.createdAt).toDateString() === new Date().toDateString()
                ).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rata-rata Transaksi</span>
                <span className="font-medium">{formatCurrency(stats.todaySales / Math.max(1, getTransactions().filter(t => 
                  new Date(t.createdAt).toDateString() === new Date().toDateString()
                ).length))}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};