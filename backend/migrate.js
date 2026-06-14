const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const Cafe = require('./models/Cafe');
const User = require('./models/User');
const Table = require('./models/Table');
const Menu = require('./models/Menu');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Testimonial = require('./models/Testimonial');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
};

const migrate = async () => {
    try {
        await connectDB();

        // 1. Buat default cafe kalo belum ada
        let cafe = await Cafe.findOne({ slug: 'chopchop' });
        if (!cafe) {
            cafe = await Cafe.create({
                name: 'ChopChop Coffee',
                slug: 'chopchop',
                address: 'Jl. Coffee No. 1',
                phone: '081234567890'
            });
            console.log('✅ Cafe default dibuat:', cafe.name);
        } else {
            console.log('ℹ️  Cafe already exists');
        }

        const cafeId = cafe._id;

        // 2. Update User — tambah cafe, ubah role customer → admin
        const userResult = await User.updateMany(
            { cafe: { $exists: false } },
            { $set: { cafe: cafeId, role: 'admin' } }
        );
        console.log(`✅ ${userResult.modifiedCount} users updated (cafe + role admin)`);

        // 3. Update Menu — tambah cafe
        const menuResult = await Menu.updateMany(
            { cafe: { $exists: false } },
            { $set: { cafe: cafeId } }
        );
        console.log(`✅ ${menuResult.modifiedCount} menu items updated`);

        // 4. Update Category — tambah cafe
        const catResult = await Category.updateMany(
            { cafe: { $exists: false } },
            { $set: { cafe: cafeId } }
        );
        console.log(`✅ ${catResult.modifiedCount} categories updated`);

        // 5. Update Order — tambah cafe, ubah user jadi optional
        const orderResult = await Order.updateMany(
            { cafe: { $exists: false } },
            { $set: { cafe: cafeId, paymentStatus: 'pending' } }
        );
        console.log(`✅ ${orderResult.modifiedCount} orders updated`);

        // 6. Update Testimonial — tambah cafe
        const testResult = await Testimonial.updateMany(
            { cafe: { $exists: false } },
            { $set: { cafe: cafeId } }
        );
        console.log(`✅ ${testResult.modifiedCount} testimonials updated`);

        // 8. Buat Tables (1-10) kalo belum ada
        const existingTables = await Table.countDocuments({ cafe: cafeId });
        if (existingTables === 0) {
            for (let i = 1; i <= 10; i++) {
                await Table.create({ cafe: cafeId, tableNumber: i });
            }
            console.log('✅ 10 tables created with QR tokens');
        } else {
            console.log(`ℹ️  ${existingTables} tables already exist`);
        }

        console.log('\n🎉 Migrasi selesai! Data aman.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error);
        process.exit(1);
    }
};

migrate();
