require('../config/env');
const pool = require('../config/db');

async function reset() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE product_images');
    await conn.query('TRUNCATE TABLE products');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    await conn.commit();
    console.log('Products and images cleared.');
  } catch (err) {
    await conn.rollback();
    console.error('Reset failed:', err.message);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
}

reset();
