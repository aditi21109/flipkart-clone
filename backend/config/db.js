const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }, // required for Railway's public proxy
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    process.exit(1);
  }
  console.log('MySQL connected to Railway');
  connection.release();
});

module.exports = pool.promise();
