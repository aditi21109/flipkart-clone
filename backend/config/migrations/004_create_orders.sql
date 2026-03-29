CREATE TABLE IF NOT EXISTS orders (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED   NOT NULL,
  total_amount    DECIMAL(10,2)  NOT NULL,
  status          ENUM('pending','confirmed','shipped','delivered','cancelled')
                  NOT NULL DEFAULT 'pending',
  shipping_name    VARCHAR(150)   NOT NULL,
  shipping_phone   VARCHAR(20)    NOT NULL,
  shipping_address VARCHAR(255)   NOT NULL,
  shipping_city    VARCHAR(100)   NOT NULL,
  shipping_pincode VARCHAR(10)    NOT NULL,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id         INT UNSIGNED  NOT NULL,
  product_id       INT UNSIGNED  NOT NULL,
  quantity         INT UNSIGNED  NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL,   -- snapshot, never changes
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
