CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  address TEXT NULL,
  avatar TEXT NULL,
  city TEXT NULL,
  country TEXT NULL,
  first_name TEXT NULL,
  last_name TEXT NULL,
  state TEXT NULL,
  username TEXT NULL,
  zip TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE conditions (
  id SERIAL PRIMARY KEY,
  name TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  account_id INT NOT NULL,
  stuff_id INT NOT NULL,
  created_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE wants (
  id SERIAL PRIMARY KEY,
  account_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE stuff (
  id SERIAL PRIMARY KEY,
  account_id INT NOT NULL,
  category_id INT NOT NULL,
  condition_id INT NOT NULL,
  description TEXT NOT NULL,
  media VARCHAR(256) NULL,
  min_trade_value FLOAT(8) NOT NULL,
  name VARCHAR(256) NOT NULL,
  status INT NOT NULL,
  value FLOAT(8) NOT NULL,
  inactive_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL
);