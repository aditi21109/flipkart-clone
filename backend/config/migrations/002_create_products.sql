CREATE TABLE IF NOT EXISTS products (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(255)   NOT NULL,
  description    TEXT,
  price          DECIMAL(10,2)  NOT NULL,
  discount_price DECIMAL(10,2)  DEFAULT NULL,
  category       VARCHAR(100)   NOT NULL,
  brand          VARCHAR(100)   NOT NULL,
  stock          INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  image_url  VARCHAR(500) NOT NULL,
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Index for fast category filtering and name search
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);
