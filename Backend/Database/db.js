import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
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
