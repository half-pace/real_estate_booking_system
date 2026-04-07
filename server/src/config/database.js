import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'reales',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
    },
  }
);

const connectDB = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ MySQL Connected Successfully');

    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('📦 Database tables synchronized');
  } catch (error) {
    console.error(`❌ MySQL Connection Error: ${error.message}`);
    // Try to create the database if it doesn't exist
    try {
      const tempSequelize = new Sequelize('', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        dialect: 'mysql',
        logging: false,
      });
      await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'reales'}\`;`);
      await tempSequelize.close();
      console.log(`📂 Database '${process.env.DB_NAME || 'reales'}' created`);

      // Retry connection
      await sequelize.authenticate();
      console.log('✅ MySQL Connected Successfully');
      await sequelize.sync({ alter: true });
      console.log('📦 Database tables synchronized');
    } catch (retryError) {
      console.error(`❌ Could not create database: ${retryError.message}`);
      console.log('Make sure MySQL is running locally and accessible.');
      process.exit(1);
    }
  }
};

export { sequelize };
export default connectDB;
