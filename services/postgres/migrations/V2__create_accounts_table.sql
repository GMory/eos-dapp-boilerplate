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
  deleted_at TIMESTAMP NULL,
  _dmx_created_at TIMESTAMP DEFAULT current_timestamp NOT NULL
);
