CREATE TABLE private_account_data (
  create_transaction_id TEXT NULL,
  username TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_by TEXT NULL DEFAULT CURRENT_USER,
  created_dt TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
  last_updated_by TEXT NULL DEFAULT CURRENT_USER,
  last_update_date TIMESTAMP WITHOUT TIME ZONE  DEFAULT CURRENT_TIMESTAMP,
  account_id INT NULL,
  address TEXT NOT NULL
);