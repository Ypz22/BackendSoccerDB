const { Pool } = require('pg');
const dotenv = require('dotenv');
const winston = require('winston');

dotenv.config();

const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

// ✅ Configuración del Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // Necesario para proveedores cloud (Render, Railway, Supabase, etc.)
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
});

const connectDB = async () => {
    try {
        logger.info('Connecting to the database...');
        await pool.query('SELECT 1');
        logger.info('Database connected successfully');
    } catch (error) {
        logger.error('Database connection failed', error);
        throw error;
    }
};

module.exports = {
    connect: connectDB,
    query: (...params) => pool.query(...params),
    end: () => pool.end()
};
