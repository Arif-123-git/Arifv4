import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Settings,
  FileText,
  PlusCircle
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard = ({ onNavigate }: AdminDashboardProps) => {
  // Sample data - in real app, this would come from API
  const stats = {
    totalProducts: 45,
    totalSales: 'Rp 2.500.000',
    todaySales: 'Rp 450.000',
    activeUsers: 3
  };

  const quickActions = [
    {
      title: 'Kelola Produk',
      description: 'Tambah, edit, atau hapus produk',
      icon: Package,
      action: () => onNavigate('products'),
      color: 'bg-gradient-to-r from-red-500 to-pink-500'
    },
    {
      title: 'Lihat Laporan',
      description: 'Analisis penjualan dan kinerja',
      icon: BarChart3,
      action: () => onNavigate('reports'),
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    },
    {
      title: 'Manajemen User',
      description: 'Kelola akses kasir dan admin',
      icon: Users,
      action: () => onNavigate('settings'),
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      title: 'Sistem Kasir',
      description: 'Akses antarmuka penjualan',
      icon: DollarSign,
      action: () => onNavigate('sales'),
      color: 'bg-gradient-to-r from-blue-500 to-purple-500'
    }
  ];

  return (
    <div className="space-y-6 bg-teal-500 min-h-screen p-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
          <p className="text-muted-foreground">Selamat datang di panel kontrol admin</p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white border-0 shadow-lg">
          Administrator
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-100 via-pink-50 to-red-200 dark:from-red-950/50 dark:to-pink-900/30 border-red-300 dark:border-red-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Total Produk
            </CardTitle>
            <Package className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.totalProducts}</div>
            <p className="text-xs text-red-600 dark:text-red-400">produk terdaftar</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-200 dark:from-yellow-950/50 dark:to-orange-900/30 border-yellow-300 dark:border-yellow-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Total Penjualan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.totalSales}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">keseluruhan</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 dark:from-green-950/50 dark:to-emerald-900/30 border-green-300 dark:border-green-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Penjualan Hari Ini
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.todaySales}</div>
            <p className="text-xs text-green-600 dark:text-green-400">hari ini</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-200 dark:from-blue-950/50 dark:to-purple-900/30 border-blue-300 dark:border-purple-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Pengguna Aktif
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.activeUsers}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">kasir & admin</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={action.action}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`${action.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <FileText className="h-5 w-5 text-indigo-600" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"></div>
                <span className="text-sm">Produk "Kopi Arabica" ditambahkan</span>
              </div>
              <span className="text-xs text-muted-foreground">2 jam lalu</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg"></div>
                <span className="text-sm">Penjualan sebesar Rp 125.000</span>
              </div>
              <span className="text-xs text-muted-foreground">3 jam lalu</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg"></div>
                <span className="text-sm">Stok "Teh Hijau" hampir habis</span>
              </div>
              <span className="text-xs text-muted-foreground">5 jam lalu</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};