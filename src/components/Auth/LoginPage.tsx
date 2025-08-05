import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Lock, User } from 'lucide-react';
interface LoginPageProps {
  onLogin: (role: 'admin' | 'kasir') => void;
}
export const LoginPage = ({
  onLogin
}: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'kasir'>('kasir');
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi validasi login
    setTimeout(() => {
      if (username && password) {
        // Kredensial default untuk demo
        const validCredentials = {
          admin: {
            username: 'admin',
            password: 'admin123'
          },
          kasir: {
            username: 'kasir',
            password: 'kasir123'
          }
        };
        if (username === validCredentials[role].username && password === validCredentials[role].password) {
          toast({
            title: "Login Berhasil",
            description: `Selamat datang, ${role}!`
          });
          onLogin(role);
        } else {
          toast({
            title: "Login Gagal",
            description: "Username atau password salah",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Form Tidak Lengkap",
          description: "Mohon isi semua field",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };
  return <div className="min-h-screen bg-gradient-to-br from-primary/10 to-green-100 dark:from-primary/5 dark:to-green-950/20 flex items-center justify-center p-4 bg-lime-400">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6 bg-lime-950">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              Sistem POS
            </CardTitle>
            <p className="text-muted-foreground">Silakan login untuk melanjutkan</p>
          </CardHeader>
          
          <CardContent className="bg-lime-950">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                <Select value={role} onValueChange={(value: 'admin' | 'kasir') => setRole(value)}>
                  <SelectTrigger className="border-2 focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kasir">Kasir</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="pl-10 border-2 focus:border-primary" placeholder="Masukkan username" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 border-2 focus:border-primary" placeholder="Masukkan password" />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 transition-all duration-200 shadow-lg" disabled={isLoading}>
                {isLoading ? 'Sedang Login...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-slate-50">
              <p className="text-sm text-muted-foreground mb-2 font-medium">Kredensial Demo:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-medium text-primary">Admin:</p>
                  <p>admin / admin123</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Kasir:</p>
                  <p>kasir / kasir123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};