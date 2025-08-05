import { useState, useEffect } from 'react';
import { POSLayout } from '@/components/Layout/POSLayout';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { KasirDashboard } from '@/components/Dashboard/KasirDashboard';
import { SalesInterface } from '@/components/Sales/SalesInterface';
import { ProductManager } from '@/components/Products/ProductManager';
import { Reports } from '@/components/Reports/Reports';
import { LoginPage } from '@/components/Auth/LoginPage';
import { initializeDemoData } from '@/utils/localStorage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'kasir'>('kasir');

  useEffect(() => {
    // Initialize demo data on first load
    initializeDemoData();
    
    // Check if user is already logged in (from localStorage)
    const savedLogin = localStorage.getItem('pos_login');
    if (savedLogin) {
      const { isLoggedIn: savedIsLoggedIn, role } = JSON.parse(savedLogin);
      setIsLoggedIn(savedIsLoggedIn);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (role: 'admin' | 'kasir') => {
    setIsLoggedIn(true);
    setUserRole(role);
    
    // Save login state to localStorage
    localStorage.setItem('pos_login', JSON.stringify({
      isLoggedIn: true,
      role: role
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    localStorage.removeItem('pos_login');
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return userRole === 'admin' ? 
          <AdminDashboard onNavigate={setCurrentPage} /> : 
          <KasirDashboard onNavigate={setCurrentPage} />;
      case 'sales':
        return <SalesInterface />;
      case 'products':
        // Only admin can access product management
        return userRole === 'admin' ? <ProductManager /> : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-muted-foreground">Akses Ditolak</h2>
            <p className="text-muted-foreground">Hanya admin yang dapat mengakses manajemen produk</p>
          </div>
        );
      case 'reports':
        // Only admin can access reports
        return userRole === 'admin' ? <Reports /> : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-muted-foreground">Akses Ditolak</h2>
            <p className="text-muted-foreground">Hanya admin yang dapat mengakses laporan</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-muted-foreground">Pengaturan</h2>
            <p className="text-muted-foreground">Fitur pengaturan akan segera hadir</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <POSLayout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
      userRole={userRole}
      onLogout={handleLogout}
    >
      {renderPage()}
    </POSLayout>
  );
};

export default Index;
