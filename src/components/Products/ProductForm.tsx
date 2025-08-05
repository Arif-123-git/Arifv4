import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { addProduct, updateProduct, getCategories, addCategory, type Product } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    barcode: '',
    image: ''
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const categoryList = getCategories();
    setCategories(categoryList.map(c => c.name));

    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        barcode: product.barcode || '',
        image: product.image || ''
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      toast({
        title: "Error",
        description: "Harap isi semua field yang wajib",
        variant: "destructive"
      });
      return;
    }

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      barcode: formData.barcode,
      image: formData.image
    };

    try {
      if (product) {
        updateProduct(product.id, productData);
        toast({
          title: "Berhasil",
          description: "Produk berhasil diperbarui",
        });
      } else {
        addProduct(productData);
        toast({
          title: "Berhasil",
          description: "Produk berhasil ditambahkan",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan produk",
        variant: "destructive"
      });
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setCategories([...categories, newCategory.trim()]);
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {product ? 'Edit Produk' : 'Tambah Produk Baru'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama produk"
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Harga *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Masukkan harga"
                required
              />
            </div>

            <div>
              <Label htmlFor="stock">Stok *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="Masukkan jumlah stok"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori *</Label>
              <div className="space-y-2">
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                {!showNewCategory ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCategory(true)}
                    className="w-full"
                  >
                    Tambah Kategori Baru
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nama kategori baru"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button type="button" onClick={handleAddCategory} size="sm">
                      Tambah
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowNewCategory(false);
                        setNewCategory('');
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="Masukkan barcode (opsional)"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {product ? 'Perbarui' : 'Tambah'} Produk
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};