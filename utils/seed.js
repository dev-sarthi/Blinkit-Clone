require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

const categories = [
  { name: 'Fruits & Vegetables', slug: 'fruits-vegetables', image: '🥦' },
  { name: 'Dairy & Breakfast', slug: 'dairy-breakfast', image: '🥛' },
  { name: 'Snacks & Munchies', slug: 'snacks-munchies', image: '🍿' },
  { name: 'Beverages', slug: 'beverages', image: '🥤' },
  { name: 'Staples & Cooking', slug: 'staples-cooking', image: '🍚' },
  { name: 'Personal Care', slug: 'personal-care', image: '🧴' },
];

const seedProducts = [
  // Fruits & Vegetables
  { name: 'Fresh Bananas', description: 'Ripe yellow bananas, perfect for smoothies or snacking.', price: 45, discountPrice: 39, slug: 'fruits-vegetables', image: '', stock: 100, unit: '1 dozen' },
  { name: 'Organic Tomatoes', description: 'Juicy and firm tomatoes for everyday cooking.', price: 40, discountPrice: 35, slug: 'fruits-vegetables', image: '', stock: 80, unit: '500g' },
  { name: 'Green Capsicum', description: 'Fresh green bell peppers.', price: 30, slug: 'fruits-vegetables', image: '', stock: 50, unit: '250g' },
  { name: 'Onions', description: 'Premium quality onions for your kitchen.', price: 35, slug: 'fruits-vegetables', image: '', stock: 120, unit: '1 kg' },
  { name: 'Red Apples', description: 'Sweet and crunchy Shimla apples.', price: 180, discountPrice: 149, slug: 'fruits-vegetables', image: '', stock: 60, unit: '1 kg' },
  { name: 'Potatoes', description: 'Fresh farm potatoes.', price: 30, slug: 'fruits-vegetables', image: '', stock: 150, unit: '1 kg' },

  // Dairy & Breakfast
  { name: 'Amul Toned Milk', description: 'Fresh pasteurized toned milk.', price: 30, slug: 'dairy-breakfast', image: '', stock: 200, unit: '500 ml' },
  { name: 'Amul Butter', description: 'Pasteurized butter, salted.', price: 56, discountPrice: 52, slug: 'dairy-breakfast', image: '', stock: 80, unit: '100g' },
  { name: 'Britannia Bread', description: 'Soft white bread for sandwiches and toast.', price: 45, slug: 'dairy-breakfast', image: '', stock: 60, unit: '400g' },
  { name: 'Mother Dairy Curd', description: 'Creamy and fresh dahi.', price: 35, slug: 'dairy-breakfast', image: '', stock: 70, unit: '400g' },
  { name: 'Kellogg\'s Corn Flakes', description: 'Crunchy breakfast cereal.', price: 165, discountPrice: 145, slug: 'dairy-breakfast', image: '', stock: 40, unit: '475g' },

  // Snacks & Munchies
  { name: 'Lay\'s Classic Salted', description: 'Crispy potato chips, classic salted flavour.', price: 20, slug: 'snacks-munchies', image: '', stock: 100, unit: '52g' },
  { name: 'Kurkure Masala Munch', description: 'Crunchy namkeen snack.', price: 20, slug: 'snacks-munchies', image: '', stock: 90, unit: '75g' },
  { name: 'Haldiram\'s Aloo Bhujia', description: 'Traditional namkeen snack.', price: 85, discountPrice: 75, slug: 'snacks-munchies', image: '', stock: 55, unit: '400g' },
  { name: 'Dark Fantasy Choco Fills', description: 'Chocolate filled biscuits.', price: 40, slug: 'snacks-munchies', image: '', stock: 80, unit: '75g' },
  { name: 'Oreo Biscuits', description: 'Cream-filled chocolate sandwich cookies.', price: 30, slug: 'snacks-munchies', image: '', stock: 100, unit: '120g' },

  // Beverages
  { name: 'Coca-Cola', description: 'Classic refreshing cola drink.', price: 40, slug: 'beverages', image: '', stock: 120, unit: '750 ml' },
  { name: 'Tata Tea Gold', description: 'Premium blend of Assam tea.', price: 220, discountPrice: 199, slug: 'beverages', image: '', stock: 50, unit: '500g' },
  { name: 'Nescafé Classic', description: 'Instant coffee, 100% pure.', price: 275, discountPrice: 249, slug: 'beverages', image: '', stock: 40, unit: '200g' },
  { name: 'Real Mixed Fruit Juice', description: 'No added preservatives fruit juice.', price: 99, discountPrice: 89, slug: 'beverages', image: '', stock: 65, unit: '1L' },
  { name: 'Paper Boat Aam Panna', description: 'Traditional raw mango drink.', price: 30, slug: 'beverages', image: '', stock: 80, unit: '250 ml' },

  // Staples & Cooking
  { name: 'Aashirvaad Atta', description: 'Whole wheat flour for soft rotis.', price: 305, discountPrice: 280, slug: 'staples-cooking', image: '', stock: 70, unit: '5 kg' },
  { name: 'Fortune Sunflower Oil', description: 'Light and healthy cooking oil.', price: 155, discountPrice: 142, slug: 'staples-cooking', image: '', stock: 45, unit: '1L' },
  { name: 'India Gate Basmati Rice', description: 'Premium long grain basmati rice.', price: 450, discountPrice: 399, slug: 'staples-cooking', image: '', stock: 35, unit: '5 kg' },
  { name: 'Tata Salt', description: 'Iodised vacuum evaporated salt.', price: 24, slug: 'staples-cooking', image: '', stock: 120, unit: '1 kg' },
  { name: 'MDH Chana Masala', description: 'Authentic Indian spice mix.', price: 65, slug: 'staples-cooking', image: '', stock: 60, unit: '100g' },

  // Personal Care
  { name: 'Colgate MaxFresh', description: 'Cooling crystal toothpaste for fresh breath.', price: 95, discountPrice: 85, slug: 'personal-care', image: '', stock: 90, unit: '150g' },
  { name: 'Dove Shampoo', description: 'Intensive repair shampoo for damaged hair.', price: 210, discountPrice: 189, slug: 'personal-care', image: '', stock: 50, unit: '340 ml' },
  { name: 'Dettol Handwash', description: 'Antibacterial liquid handwash.', price: 99, slug: 'personal-care', image: '', stock: 75, unit: '200 ml' },
  { name: 'Nivea Body Lotion', description: 'Nourishing body lotion for smooth skin.', price: 250, discountPrice: 220, slug: 'personal-care', image: '', stock: 40, unit: '400 ml' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing categories and products');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`📂 Created ${createdCategories.length} categories`);

    // Build slug → _id map
    const catMap = {};
    createdCategories.forEach(cat => { catMap[cat.slug] = cat._id; });

    // Create products
    const products = seedProducts.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice || null,
      category: catMap[p.slug],
      image: p.image || '',
      stock: p.stock,
      unit: p.unit,
      isActive: true,
    }));

    const createdProducts = await Product.insertMany(products);
    console.log(`📦 Created ${createdProducts.length} products`);

    // Create admin user (if not exists)
    const existingAdmin = await User.findOne({ email: 'admin@quickkart.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@quickkart.com',
        password: 'admin123',
        phone: '+91 9999999999',
        role: 'admin',
      });
      console.log('👤 Created admin user: admin@quickkart.com / admin123');
    } else {
      console.log('👤 Admin user already exists');
    }

    console.log('\n🎉 Seed complete! You can now start the app with `npm start`.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
