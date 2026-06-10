import app from './app.js';
import connectDB from './config/db.js';
import { seedDatabase } from './config/seed.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Seed initial mock data (Hotels, Rooms, Admin, Customer) if empty
    await seedDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log('Server Running');
    });
  } catch (error) {
    console.error(`Fatal server error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
