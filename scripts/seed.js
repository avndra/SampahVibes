const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to avoid 'dotenv' dependency issues
let MONGODB_URI;
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    const match = envConfig.match(/MONGODB_URI=(.*)/);
    if (match && match[1]) {
      MONGODB_URI = match[1].trim().replace(/(^"|"$)/g, '');
    }
  }
} catch (e) {
  console.warn('⚠️ Could not read .env.local file');
}

if (!MONGODB_URI) {
  // Fallback to process.env if available
  MONGODB_URI = process.env.MONGODB_URI;
}

// Schemas (inline for seed script)
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  name: String,
  avatar: String,
  phone: String,
  address: String,
  totalPoints: { type: Number, default: 0 },
  totalWeight: { type: Number, default: 0 },
  totalDeposits: { type: Number, default: 0 },
  monthlyPoints: { type: Map, of: Number, default: new Map() },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  pointsCost: Number,
  stock: Number,
  image: String,
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      email: 'admin@erecycle.com',
      password: adminPassword,
      role: 'admin',
      name: 'Admin User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      totalPoints: 0,
      totalWeight: 0,
      totalDeposits: 0
    });
    console.log('👤 Created admin user');

    // Create test user
    const userPassword = await bcrypt.hash('user123', 12);
    const monthlyPoints = new Map();
    monthlyPoints.set('2024-01', 150);
    monthlyPoints.set('2024-02', 280);
    monthlyPoints.set('2024-03', 420);

    const testUser = await User.create({
      email: 'user@erecycle.com',
      password: userPassword,
      role: 'user',
      name: 'Test User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
      phone: '+62 812-3456-7890',
      address: 'Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta',
      totalPoints: 999999,
      totalWeight: 300.8,
      totalDeposits: 999,
      monthlyPoints
    });
    console.log('👤 Created test user');

    // Create sample products
    const products = [
      // Vouchers
      {
        name: 'Tokopedia Voucher Rp 50.000',
        description: 'Get Rp 50,000 discount for your next purchase on Tokopedia',
        category: 'voucher',
        pointsCost: 500,
        stock: 100,
        image: '/images/tokopedia50v.png',
        isActive: true,
        featured: true
      },
      {
        name: 'Shopee Voucher Rp 100.000',
        description: 'Shopee shopping voucher worth Rp 100,000',
        category: 'voucher',
        pointsCost: 950,
        stock: 50,
        image: '/images/shopeevoucher.jpg',
        isActive: true,
        featured: true
      },
      {
        name: 'Grab Food Voucher Rp 20.000',
        description: 'Free food delivery voucher from GrabFood',
        category: 'voucher',
        pointsCost: 200,
        stock: 200,
        image: '/images/grabvoucher20.jpg',
        isActive: true,
        featured: false
      },
      {
        name: 'GoJek Ride Voucher Rp 25.000',
        description: 'Free ride voucher for GoJek transportation',
        category: 'voucher',
        pointsCost: 250,
        stock: 150,
        image: '/images/gojekvch.webp',
        isActive: true,
        featured: false
      },

      // Electronics
      {
        name: 'Wireless Earbuds Pro',
        description: 'Premium wireless earbuds with active noise cancellation',
        category: 'electronics',
        pointsCost: 2500,
        stock: 20,
        image: '/images/wirlsearbud.png',
        isActive: true,
        featured: true
      },
      {
        name: 'Smart Watch Fitness Tracker',
        description: 'Track your health and fitness with this smart watch',
        category: 'electronics',
        pointsCost: 3000,
        stock: 15,
        image: 'https://placehold.co/400x300/8b5cf6/white?text=Smart+Watch',
        isActive: true,
        featured: false
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Waterproof portable speaker with 12-hour battery life',
        category: 'electronics',
        pointsCost: 1800,
        stock: 30,
        image: '/images/portableBspeaker.png',
        isActive: true,
        featured: true
      },
      {
        name: 'USB Power Bank 20000mAh',
        description: 'High capacity power bank with fast charging',
        category: 'electronics',
        pointsCost: 1200,
        stock: 40,
        image: 'https://placehold.co/400x300/f59e0b/white?text=Power+Bank',
        isActive: true,
        featured: false
      },

      // Lifestyle
      {
        name: 'Eco-Friendly Water Bottle',
        description: 'Stainless steel insulated water bottle - 750ml',
        category: 'lifestyle',
        pointsCost: 400,
        stock: 100,
        image: 'https://placehold.co/400x300/14b8a6/white?text=Water+Bottle',
        isActive: true,
        featured: false
      },
      {
        name: 'Organic Cotton Tote Bag',
        description: 'Reusable shopping bag made from 100% organic cotton',
        category: 'lifestyle',
        pointsCost: 200,
        stock: 200,
        image: 'https://placehold.co/400x300/84cc16/white?text=Tote+Bag',
        isActive: true,
        featured: false
      },
      {
        name: 'Bamboo Cutlery Set',
        description: 'Travel cutlery set made from sustainable bamboo',
        category: 'lifestyle',
        pointsCost: 350,
        stock: 80,
        image: 'https://placehold.co/400x300/65a30d/white?text=Cutlery+Set',
        isActive: true,
        featured: false
      },
      {
        name: 'Recycled Notebook Set',
        description: 'Set of 3 notebooks made from recycled paper',
        category: 'lifestyle',
        pointsCost: 180,
        stock: 150,
        image: 'https://placehold.co/400x300/ca8a04/white?text=Notebooks',
        isActive: true,
        featured: false
      },

      // Donations
      {
        name: 'Plant 10 Trees',
        description: 'Donate to plant 10 trees in Indonesian rainforests',
        category: 'donation',
        pointsCost: 500,
        stock: 999,
        image: 'https://placehold.co/400x300/059669/white?text=Plant+Trees',
        isActive: true,
        featured: false
      },
      {
        name: 'Ocean Cleanup Support',
        description: 'Support ocean cleanup initiatives in Indonesia',
        category: 'donation',
        pointsCost: 750,
        stock: 999,
        image: 'https://placehold.co/400x300/0284c7/white?text=Ocean+Cleanup',
        isActive: true,
        featured: false
      },
      {
        name: 'Recycling Education Program',
        description: 'Fund recycling education in local schools',
        category: 'donation',
        pointsCost: 1000,
        stock: 999,
        image: 'https://placehold.co/400x300/7c3aed/white?text=Education',
        isActive: true,
        featured: false
      }
    ];

    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products`);

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('   Admin: admin@erecycle.com / admin123');
    console.log('   User: user@erecycle.com / user123');

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
