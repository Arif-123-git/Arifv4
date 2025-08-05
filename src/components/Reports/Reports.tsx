import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Download, TrendingUp, Package, DollarSign, BarChart, PieChart, Activity } from 'lucide-react';
import { getTransactions, getProducts, type Transaction } from '@/utils/localStorage';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

export const Reports = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    setTransactions(getTransactions());
    setProducts(getProducts());
    
    // Set default date range (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setDateFilter({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!dateFilter.start || !dateFilter.end) return transactions;
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date
      
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions, dateFilter]);

  const salesReport = useMemo(() => {
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = filteredTransactions.length;
    const totalItems = filteredTransactions.reduce((sum, t) => 
      sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Daily sales
    const dailySales = filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + transaction.total;
      return acc;
    }, {} as Record<string, number>);

    // Payment method breakdown
    const paymentMethods = filteredTransactions.reduce((acc, transaction) => {
      acc[transaction.paymentMethod] = (acc[transaction.paymentMethod] || 0) + transaction.total;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalTransactions,
      totalItems,
      averageTransaction,
      dailySales,
      paymentMethods
    };
  }, [filteredTransactions]);

  const productReport = useMemo(() => {
    // Product sales analysis
    const productSales = filteredTransactions.reduce((acc, transaction) => {
      transaction.items.forEach(item => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0
          };
        }
        acc[item.productId].quantity += item.quantity;
        acc[item.productId].revenue += item.total;
      });
      return acc;
    }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

    const topProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b.revenue - a.revenue)
      .slice(0, 10);

    const lowStockProducts = products.filter(p => p.stock <= 10);

    return {
      productSales,
      topProducts,
      lowStockProducts
    };
  }, [filteredTransactions, products]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const exportData = (type: 'sales' | 'products') => {
    let data: any[] = [];
    let filename = '';

    if (type === 'sales') {
      data = filteredTransactions.map(t => ({
        'ID Transaksi': t.id,
        'Tanggal': formatDate(t.createdAt),
        'Kasir': t.cashierName,
        'Pelanggan': t.customerName || '-',
        'Subtotal': t.subtotal,
        'Pajak': t.tax,
        'Total': t.total,
        'Metode Pembayaran': t.paymentMethod,
        'Jumlah Item': t.items.reduce((sum, item) => sum + item.quantity, 0)
      }));
      filename = `laporan-penjualan-${dateFilter.start}-${dateFilter.end}.csv`;
    } else {
      data = productReport.topProducts.map(([id, product]) => ({
        'Nama Produk': product.name,
        'Jumlah Terjual': product.quantity,
        'Total Pendapatan': product.revenue
      }));
      filename = `laporan-produk-${dateFilter.start}-${dateFilter.end}.csv`;
    }

    // Convert to CSV
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Laporan</h1>
        <p className="text-muted-foreground">Analisis penjualan dan inventori</p>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Filter Tanggal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Dari Tanggal</label>
              <Input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Sampai Tanggal</label>
              <Input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">Laporan Penjualan</TabsTrigger>
          <TabsTrigger value="products">Laporan Produk</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          {/* Sales Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(salesReport.totalRevenue)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesReport.totalTransactions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata Transaksi</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(salesReport.averageTransaction)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Item Terjual</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesReport.totalItems}</div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Metode Pembayaran</CardTitle>
              <Button onClick={() => exportData('sales')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(salesReport.paymentMethods).map(([method, amount]) => (
                  <div key={method} className="flex justify-between items-center">
                    <span className="capitalize">{method === 'cash' ? 'Tunai' : method === 'card' ? 'Kartu' : 'Digital'}</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Tren Penjualan Harian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={Object.entries(salesReport.dailySales).map(([date, sales]) => ({
                  date: new Date(date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
                  sales: sales
                })).slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Penjualan']} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Metode Pembayaran
              </CardTitle>
              <Button onClick={() => exportData('sales')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={Object.entries(salesReport.paymentMethods).map(([method, amount]) => ({
                        name: method === 'cash' ? 'Tunai' : method === 'card' ? 'Kartu' : 'Digital',
                        value: amount,
                        color: method === 'cash' ? '#22c55e' : method === 'card' ? '#3b82f6' : '#f59e0b'
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(salesReport.paymentMethods).map((entry, index) => {
                        const colors = ['#22c55e', '#3b82f6', '#f59e0b'];
                        return <Cell key={`cell-${index}`} fill={colors[index]} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {Object.entries(salesReport.paymentMethods).map(([method, amount], index) => {
                    const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500'];
                    const percentage = (amount / salesReport.totalRevenue * 100).toFixed(1);
                    return (
                      <div key={method} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                          <span className="capitalize">{method === 'cash' ? 'Tunai' : method === 'card' ? 'Kartu' : 'Digital'}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(amount)}</p>
                          <p className="text-sm text-muted-foreground">{percentage}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Transaksi Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTransactions.slice(0, 20).map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{formatDate(transaction.createdAt)}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.customerName || 'Guest'} • {transaction.items.length} item(s) • {transaction.cashierName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(transaction.total)}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {transaction.paymentMethod === 'cash' ? 'Tunai' : transaction.paymentMethod === 'card' ? 'Kartu' : 'Digital'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Product Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                  Total Produk Terjual
                </CardTitle>
                <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {Object.values(productReport.productSales).reduce((sum, product) => sum + product.quantity, 0)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">item terjual</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Produk Terlaris
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {productReport.topProducts[0]?.[1]?.name?.slice(0, 12) || 'N/A'}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {productReport.topProducts[0]?.[1]?.quantity || 0} terjual
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 border-red-200 dark:border-red-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
                  Stok Menipis
                </CardTitle>
                <Package className="h-4 w-4 text-red-600 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {productReport.lowStockProducts.length}
                </div>
                <p className="text-xs text-red-600 dark:text-red-400">produk</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Products Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Grafik Produk Terlaris
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={productReport.topProducts.slice(0, 10).map(([id, product]) => ({
                  name: product.name.length > 15 ? product.name.slice(0, 15) + '...' : product.name,
                  quantity: product.quantity,
                  revenue: product.revenue
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'quantity' ? value : formatCurrency(value as number),
                      name === 'quantity' ? 'Jumlah Terjual' : 'Pendapatan'
                    ]}
                  />
                  <Bar yAxisId="left" dataKey="quantity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="revenue" fill="hsl(142.1 76.2% 36.3%)" radius={[4, 4, 0, 0]} opacity={0.7} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Produk Terlaris</CardTitle>
              <Button onClick={() => exportData('products')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {productReport.topProducts.map(([id, product], index) => (
                  <div key={id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-medium ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-primary'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.quantity} terjual</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(product.revenue)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(product.revenue / product.quantity)} /item
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Package className="h-5 w-5" />
                Peringatan Stok Menipis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {productReport.lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {productReport.lowStockProducts.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-3 border border-destructive/50 rounded bg-destructive/5 hover:bg-destructive/10 transition-colors">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-destructive">Stok: {product.stock}</p>
                        <p className="text-sm">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">Semua produk memiliki stok yang cukup</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};