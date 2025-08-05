import { useState } from 'react';
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings, 
  Home,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface POSLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  userRole?: 'admin' | 'kasir';
  onLogout?: () => void;
}

export const POSLayout = ({ children, currentPage, onPageChange, userRole, onLogout }: POSLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'sales', label: 'Kasir', icon: ShoppingCart },
    { id: 'products', label: 'Produk', icon: Package, adminOnly: true },
    { id: 'reports', label: 'Laporan', icon: BarChart3, adminOnly: true },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && userRole === 'kasir') {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-teal-500">
        <h1 className="text-xl font-bold text-foreground">POS Kasir</h1>
        <div className="flex items-center gap-2">
          {userRole && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              <User className="h-3 w-3" />
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-foreground hidden lg:block">POS Kasir</h1>
            {userRole && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground bg-gradient-to-r from-primary/10 to-green-600/10 px-3 py-2 rounded-lg">
                <User className="h-4 w-4" />
                <span className="font-medium">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              </div>
            )}
          </div>
          
          <nav className="mt-4 flex-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center px-6 py-3 text-left transition-colors",
                    currentPage === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          {onLogout && (
            <div className="p-4 border-t">
              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full flex items-center gap-2 text-muted-foreground hover:text-destructive hover:border-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <main className="h-full overflow-auto p-4 lg:p-6 bg-teal-500">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};