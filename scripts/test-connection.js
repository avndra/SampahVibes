const mongoose = require('mongoose');
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
            MONGODB_URI = match[1].trim().replace(/(^"|"$)/g, ''); // Remove quotes if any
        }
    }
} catch (e) {
    console.warn('⚠️ Could not read .env.local file');
}

async function testConnection() {
    console.log('🔄 Testing MongoDB Connection...');
    console.log(`📡 URI detected: ${MONGODB_URI ? 'Yes (Hidden)' : 'No (Missing!)'}`);

    if (!MONGODB_URI) {
        console.error('❌ Error: MONGODB_URI is undefined. Check your .env.local file.');
        process.exit(1);
    }

    try {
        // Attempt connection
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Success! Connected to MongoDB.');

        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📂 Collections found in database:');

        if (collections.length === 0) {
            console.log('   (Database is empty - no collections found)');
        } else {
            for (const col of collections) {
                // Count documents in each collection
                const count = await mongoose.connection.db.collection(col.name).countDocuments();
                console.log(`   - ${col.name}: ${count} documents`);
            }
        }

        // Check specifically for Users using the model definition style (simplified)
        if (collections.find(c => c.name === 'users')) {
            const users = await mongoose.connection.db.collection('users').find({}).limit(5).toArray();
            console.log('\n👤 First 5 Users:');
            users.forEach(u => console.log(`   - ${u.name} (${u.email}) [Role: ${u.role}]`));
        }

        console.log('\n🎉 Connection test passed!');
    } catch (error) {
        console.error('\n❌ Connection Failed!');
        console.error('Error details:', error.message);

        if (error.message.includes('bad auth')) {
            console.log('\n💡 Tip: Check your username and password in the connection string.');
        } else if (error.message.includes('ETIMEDOUT') || error.message.includes('querySrv')) {
            console.log('\n💡 Tip: Check your IP Whitelist in MongoDB Atlas (Network Access). Allow your current IP.');
        }
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(0);
    }
}

testConnection();
