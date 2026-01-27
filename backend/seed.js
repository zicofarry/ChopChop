const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const User = require('./models/User');
const Category = require('./models/Category');
const Menu = require('./models/Menu');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Create Admin User
        const existingAdmin = await User.findOne({ email: 'admin@chopchop.coffee' });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'Admin ChopChop',
                email: 'admin@chopchop.coffee',
                password: hashedPassword,
                role: 'admin',
                phone: '081234567890'
            });
            console.log('✅ Admin user created');
            console.log('   Email: admin@chopchop.coffee');
            console.log('   Password: admin123');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Create Categories
        const categories = [
            { name: 'Coffee', description: 'Hot and iced coffee drinks', icon: '☕' },
            { name: 'Non-Coffee', description: 'Tea, chocolate, and other beverages', icon: '🍵' },
            { name: 'Pastry', description: 'Fresh baked goods', icon: '🥐' },
            { name: 'Dessert', description: 'Sweet treats', icon: '🍰' },
        ];

        for (const cat of categories) {
            const existing = await Category.findOne({ name: cat.name });
            if (!existing) {
                await Category.create(cat);
                console.log(`✅ Category created: ${cat.name}`);
            }
        }

        // Get category IDs
        const coffeeCategory = await Category.findOne({ name: 'Coffee' });
        const nonCoffeeCategory = await Category.findOne({ name: 'Non-Coffee' });
        const pastryCategory = await Category.findOne({ name: 'Pastry' });
        const dessertCategory = await Category.findOne({ name: 'Dessert' });

        // Create Menu Items
        const menuItems = [
            { name: 'Signature Latte', description: 'Our house special with caramel and vanilla notes', price: 42000, category: coffeeCategory._id, image: '/images/signature_latte.png', featured: true, available: true },
            { name: 'Cold Brew', description: 'Smooth, bold coffee steeped for 20 hours', price: 38000, category: coffeeCategory._id, image: '/images/cold_brew.png', featured: true, available: true },
            { name: 'Cappuccino', description: 'Perfect balance of espresso and steamed milk', price: 35000, category: coffeeCategory._id, image: '/images/cappuccino.png', featured: false, available: true },
            { name: 'Espresso', description: 'Pure, intense coffee shot', price: 25000, category: coffeeCategory._id, image: '/images/espresso.png', featured: false, available: true },
            { name: 'Affogato', description: 'Espresso over vanilla gelato', price: 48000, category: coffeeCategory._id, image: '/images/affogato.png', featured: true, available: true },
            { name: 'Matcha Latte', description: 'Premium Japanese matcha with creamy milk', price: 45000, category: nonCoffeeCategory._id, image: '/images/matcha_latte.png', featured: true, available: true },
            { name: 'Chai Latte', description: 'Spiced tea with steamed milk', price: 40000, category: nonCoffeeCategory._id, image: '/images/chai_latte.png', featured: false, available: true },
            { name: 'Hot Chocolate', description: 'Rich Belgian chocolate', price: 38000, category: nonCoffeeCategory._id, image: '/images/hot_chocolate.png', featured: true, available: true },
            { name: 'Croissant', description: 'Buttery, flaky French-style pastry', price: 28000, category: pastryCategory._id, image: '/images/croissant.png', featured: true, available: true },
            { name: 'Pain au Chocolat', description: 'Chocolate-filled croissant', price: 32000, category: pastryCategory._id, image: '/images/pain_au_chocolat.png', featured: false, available: true },
            { name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 52000, category: dessertCategory._id, image: '/images/tiramisu.png', featured: true, available: true },
            { name: 'Cheesecake', description: 'New York style creamy cheesecake', price: 48000, category: dessertCategory._id, image: '/images/cheesecake.png', featured: false, available: true },
        ];

        for (const item of menuItems) {
            const existing = await Menu.findOne({ name: item.name });
            if (!existing) {
                await Menu.create(item);
                console.log(`✅ Menu item created: ${item.name}`);
            }
        }

        console.log('\n🎉 Seed completed successfully!');
        console.log('\nYou can now login as admin:');
        console.log('   Email: admin@chopchop.coffee');
        console.log('   Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
