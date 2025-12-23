const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
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

if (!MONGODB_URI) { console.error("❌ MONGODB_URI not found"); process.exit(1); }

const UserSchema = new mongoose.Schema({
    email: String,
    monthlyPoints: { type: Map, of: Number }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function updateChartData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const email = 'user@erecycle.com'; // User yang akan diupdate

        // --- 📝 EDIT DATA GRAFIK DI DATABASE DI SINI ---
        // Format: 'YYYY-MM' : Total Poin
        // Sesuaikan bulan dengan 6 bulan terakhir yang tampil di web
        const newMonthlyPoints = {
            '2025-07': 1500, // Juli
            '2025-08': 3200, // Agustus
            '2025-09': 2800, // September
            '2025-10': 4500, // Oktober
            '2025-11': 5100, // November
            '2025-12': 7500, // Desember (Bulan ini)
        };
        // -----------------------------------------------

        const user = await User.findOne({ email });
        if (!user) {
            console.error('❌ User not found!');
            return;
        }

        user.monthlyPoints = newMonthlyPoints;
        await user.save();

        console.log(`\n✅ Berhasil update data poin bulanan untuk ${email}!`);
        console.log('📊 Data baru:', newMonthlyPoints);
        console.log('\n👉 Silakan refresh halaman web untuk melihat perubahan grafik.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateChartData();
