// Local Storage utilities for POS system
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Transaction {
  id: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  customerName?: string;
  cashierName: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  PRODUCTS: 'pos_products',
  TRANSACTIONS: 'pos_transactions',
  CATEGORIES: 'pos_categories',
  SETTINGS: 'pos_settings'
};

// Generic storage functions
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Product management
export const getProducts = (): Product[] => {
  return getFromStorage(STORAGE_KEYS.PRODUCTS, []);
};

export const saveProducts = (products: Product[]): void => {
  saveToStorage(STORAGE_KEYS.PRODUCTS, products);
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveProducts(products);
  return products[index];
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  if (filteredProducts.length === products.length) return false;
  saveProducts(filteredProducts);
  return true;
};

// Transaction management
export const getTransactions = (): Transaction[] => {
  return getFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
};

export const saveTransactions = (transactions: Transaction[]): void => {
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  transactions.push(newTransaction);
  saveTransactions(transactions);
  
  // Update product stock
  const products = getProducts();
  transaction.items.forEach(item => {
    const productIndex = products.findIndex(p => p.id === item.productId);
    if (productIndex !== -1) {
      products[productIndex].stock -= item.quantity;
    }
  });
  saveProducts(products);
  
  return newTransaction;
};

// Category management
export const getCategories = (): Category[] => {
  return getFromStorage(STORAGE_KEYS.CATEGORIES, []);
};

export const saveCategories = (categories: Category[]): void => {
  saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
};

export const addCategory = (name: string): Category => {
  const categories = getCategories();
  const newCategory: Category = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString()
  };
  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
};

// Helper function to generate ID
const generateId = () => crypto.randomUUID();

// Initialize demo data with comprehensive transactions and products
export const initializeDemoData = () => {
  // Check if data already exists
  if (localStorage.getItem('pos_products') && localStorage.getItem('pos_transactions')) {
    return;
  }

  // Demo products with more variety
  const demoProducts = [
    {
      id: generateId(),
      name: 'Kopi Arabica Premium',
      category: 'Minuman',
      price: 25000,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Teh Hijau Organik',
      category: 'Minuman',
      price: 15000,
      stock: 8, // Low stock for demo
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Croissant Butter',
      category: 'Makanan',
      price: 12000,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1555507036-ab794f1eb0f4?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Sandwich Club',
      category: 'Makanan',
      price: 35000,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Cappuccino',
      category: 'Minuman',
      price: 28000,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Muffin Blueberry',
      category: 'Makanan',
      price: 18000,
      stock: 5, // Low stock for demo
      image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Latte Vanilla',
      category: 'Minuman',
      price: 32000,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Pasta Carbonara',
      category: 'Makanan',
      price: 45000,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Jus Jeruk Fresh',
      category: 'Minuman',
      price: 22000,
      stock: 35,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Caesar Salad',
      category: 'Makanan',
      price: 38000,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Smoothie Mangga',
      category: 'Minuman',
      price: 26000,
      stock: 3, // Low stock for demo
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Pizza Margherita',
      category: 'Makanan',
      price: 55000,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Generate demo transactions for the last 30 days
  const demoTransactions = [];
  const today = new Date();
  const productIds = demoProducts.map(p => p.id);
  const productMap = demoProducts.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {} as Record<string, any>);

  // Create transactions for last 30 days
  for (let i = 0; i < 30; i++) {
    const transactionDate = new Date(today);
    transactionDate.setDate(today.getDate() - i);
    
    // Generate 2-8 transactions per day
    const dailyTransactions = Math.floor(Math.random() * 7) + 2;
    
    for (let j = 0; j < dailyTransactions; j++) {
      const transactionTime = new Date(transactionDate);
      transactionTime.setHours(
        Math.floor(Math.random() * 12) + 8, // 8 AM to 8 PM
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60)
      );

      // Select random products for this transaction (1-4 items)
      const numItems = Math.floor(Math.random() * 4) + 1;
      const selectedProducts = [];
      
      for (let k = 0; k < numItems; k++) {
        const randomProductId = productIds[Math.floor(Math.random() * productIds.length)];
        const product = productMap[randomProductId];
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        // Check if product already in this transaction
        const existingItem = selectedProducts.find(item => item.productId === randomProductId);
        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.total = existingItem.quantity * product.price;
        } else {
          selectedProducts.push({
            productId: randomProductId,
            productName: product.name,
            price: product.price,
            quantity: quantity,
            total: quantity * product.price
          });
        }
      }

      const subtotal = selectedProducts.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;

      const transaction = {
        id: generateId(),
        items: selectedProducts,
        subtotal: subtotal,
        tax: tax,
        total: total,
        paymentMethod: ['cash', 'card', 'digital'][Math.floor(Math.random() * 3)] as 'cash' | 'card' | 'digital',
        customerName: ['Andi Wijaya', 'Sari Dewi', 'Budi Santoso', 'Maya Putri', 'Rudi Hakim', ''][Math.floor(Math.random() * 6)],
        cashierName: ['Admin', 'Kasir'][Math.floor(Math.random() * 2)],
        notes: '',
        createdAt: transactionTime.toISOString()
      };

      demoTransactions.push(transaction);
    }
  }

  // Sort transactions by date (newest first)
  demoTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  localStorage.setItem('pos_products', JSON.stringify(demoProducts));
  localStorage.setItem('pos_transactions', JSON.stringify(demoTransactions));
  
  // Initialize demo categories
  const demoCategories = [
    {
      id: generateId(),
      name: 'Makanan',
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Minuman',
      createdAt: new Date().toISOString()
    },
    {
      id: generateId(),
      name: 'Snack',
      createdAt: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('pos_categories', JSON.stringify(demoCategories));
};