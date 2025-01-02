-- +goose Up

CREATE TABLE USERS(
id UUID PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL
);

-- +goose Down

DROP TABLE USERS;
