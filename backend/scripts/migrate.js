require('../config/env');
const pool = require('../config/db');

// All DDL statements in dependency order
const migrations = [
  {
    name: '001_create_users',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name          VARCHAR(100)         NOT NULL,
        email         VARCHAR(150)         NOT NULL UNIQUE,
        password_hash VARCHAR(255)         NOT NULL,
        role          ENUM('user','admin') NOT NULL DEFAULT 'user',
        created_at    TIMESTAMP            NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
  },
  {
    name: '002_create_products',
    sql: `
      CREATE TABLE IF NOT EXISTS products (
        id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name           VARCHAR(255)  NOT NULL,
        description    TEXT,
        price          DECIMAL(10,2) NOT NULL,
        discount_price DECIMAL(10,2) DEFAULT NULL,
        category       VARCHAR(100)  NOT NULL,
        brand          VARCHAR(100)  NOT NULL,
        stock          INT UNSIGNED  NOT NULL DEFAULT 0,
        created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
  },
  {
    name: '002b_create_product_images',
    sql: `
      CREATE TABLE IF NOT EXISTS product_images (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id INT UNSIGNED NOT NULL,
        image_url  VARCHAR(500) NOT NULL,
        sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )`,
  },
  {
    name: '002c_index_products_category',
    sql: `
      CREATE INDEX idx_products_category ON products(category)`,
  },
  {
    name: '003_create_cart_items',
    sql: `
      CREATE TABLE IF NOT EXISTS cart_items (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id    INT UNSIGNED NOT NULL,
        product_id INT UNSIGNED NOT NULL,
        quantity   INT UNSIGNED NOT NULL DEFAULT 1,
        created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_product (user_id, product_id),
        FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )`,
  },
  {
    name: '004_create_orders',
    sql: `
      CREATE TABLE IF NOT EXISTS orders (
        id               INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
        user_id          INT UNSIGNED  NOT NULL,
        total_amount     DECIMAL(10,2) NOT NULL,
        status           ENUM('pending','confirmed','shipped','delivered','cancelled')
                         NOT NULL DEFAULT 'pending',
        shipping_name    VARCHAR(150)  NOT NULL,
        shipping_phone   VARCHAR(20)   NOT NULL,
        shipping_address VARCHAR(255)  NOT NULL,
        shipping_city    VARCHAR(100)  NOT NULL,
        shipping_pincode VARCHAR(10)   NOT NULL,
        created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
  },
  {
    name: '004b_create_order_items',
    sql: `
      CREATE TABLE IF NOT EXISTS order_items (
        id                INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
        order_id          INT UNSIGNED  NOT NULL,
        product_id        INT UNSIGNED  NOT NULL,
        quantity          INT UNSIGNED  NOT NULL,
        price_at_purchase DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      )`,
  },
];

async function migrate() {
  const conn = await pool.getConnection();
  try {
    console.log('\nRunning migrations...\n');
    for (const { name, sql } of migrations) {
      try {
        await conn.query(sql);
        console.log(`  ✓  ${name}`);
      } catch (err) {
        // Index already exists is not fatal — skip it
        if (err.code === 'ER_DUP_KEYNAME' || err.message.includes('Duplicate key name')) {
          console.log(`  ~  ${name} (index already exists, skipped)`);
        } else {
          throw err;
        }
      }
    }
    console.log('\nAll migrations completed.\n');

    // Show final table list
    const [tables] = await conn.query('SHOW TABLES');
    console.log('Tables in database:');
    tables.forEach((t) => console.log('  -', Object.values(t)[0]));
  } catch (err) {
    console.error('\nMigration failed:', err.message);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
}

migrate();
