import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const parsePositiveInt = (value, fallback) => {
    const parsedValue = Number.parseInt(value, 10);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    connectionTimeout: parsePositiveInt(process.env.DB_CONNECTION_TIMEOUT_MS, 30000),
    requestTimeout: parsePositiveInt(process.env.DB_REQUEST_TIMEOUT_MS, 60000),
    options: {
        encrypt: true,
        trustServerCertificate: true,   
    },
    pool: {
        max: 50,
        min: 1,
        idleTimeoutMillis: 30000,
    }
};

let poolPromise;

async function connectToDatabase() {
    try {
        if (!poolPromise) {
            poolPromise = sql.connect(config);
            await poolPromise;
            console.log('Connected to MSSQL database');
        }
    } catch (err) {
        console.error('Database connection failed: ', err);
        throw err;
    }
}

export { sql, poolPromise, connectToDatabase };
