import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  Package,
  TrendingUp,
  Receipt,
  Zap,
  Calculator
} from 'lucide-react';

interface KasirDashboardProps {
  onNavigate: (page: string) => void;
}

export const KasirDashboard = ({ onNavigate }: KasirDashboardProps) => {
  // Sample data - in real app, this would come from API
  const todayStats = {
    transactions: 12,
    sales: 'Rp 450.000',
    avgTransaction: 'Rp 37.500',
    lastTransaction: '14:30'
  };

  const quickActions = [
    {
      title: 'Mulai Transaksi',
      description: 'Buka interface kasir',
      icon: ShoppingCart,
      action: () => onNavigate('sales'),
      color: 'bg-green-500',
      featured: true
    },
    {
      title: 'Lihat Produk',
      description: 'Cek stok dan harga',
      icon: Package,
      action: () => onNavigate('products'),
      color: 'bg-blue-500'
    },
    {
      title: 'Riwayat Penjualan',
      description: 'Transaksi hari ini',
      icon: Receipt,
      action: () => onNavigate('reports'),
      color: 'bg-purple-500'
    }
  ];

  const recentTransactions = [
    { id: '#001', amount: 'Rp 25.000', items: 2, time: '14:30' },
    { id: '#002', amount: 'Rp 75.000', items: 5, time: '14:15' },
    { id: '#003', amount: 'Rp 15.000', items: 1, time: '13:45' },
    { id: '#004', amount: 'Rp 50.000', items: 3, time: '13:20' }
  ];

  return (
    <div className="space-y-6 bg-teal-500 min-h-screen p-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Kasir</h1>
          <p className="text-muted-foreground">Siap melayani pelanggan hari ini</p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-green-600/10 to-blue-600/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
          Kasir Aktif
        </Badge>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Transaksi Hari Ini
            </CardTitle>
            <Receipt className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{todayStats.transactions}</div>
            <p className="text-xs text-green-600 dark:text-green-400">transaksi</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Penjualan Hari Ini
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{todayStats.sales}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">total penjualan</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Rata-rata Transaksi
            </CardTitle>
            <Calculator className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{todayStats.avgTransaction}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">per transaksi</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Transaksi Terakhir
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{todayStats.lastTransaction}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">waktu terakhir</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Menu Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index} 
                className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${
                  action.featured ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                }`} 
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`${action.color} p-4 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    {action.featured && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <Zap className="w-3 h-3 mr-1" />
                        Populer
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Transaksi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-green-600/10 rounded-lg flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.id}</p>
                    <p className="text-sm text-muted-foreground">{transaction.items} item</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{transaction.amount}</p>
                  <p className="text-sm text-muted-foreground">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Tip */}
      <Card className="bg-gradient-to-r from-primary/5 to-green-600/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Siap untuk transaksi baru?</h3>
              <p className="text-sm text-muted-foreground">Klik "Mulai Transaksi" untuk memulai penjualan</p>
            </div>
            <Button 
              onClick={() => onNavigate('sales')} 
              className="bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90"
            >
              Mulai Sekarang
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};