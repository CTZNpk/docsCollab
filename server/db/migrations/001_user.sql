-- +goose Up
CREATE TABLE USERS(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);
-- +goose Down
DROP TABLE USERS;
