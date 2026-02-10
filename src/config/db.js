const { Pool } = require('pg');
const winston = require('winston');

// ⚠️ En Render NO necesitas dotenv si usas Environment Variables
// dotenv.config();

const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()]
});

// Render / producción suele usar DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
});

// Test de conexión
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
    query: (text, params) => pool.query(text, params),
    end: () => pool.end()
};
