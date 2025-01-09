-- +goose Up
CREATE TABLE Documents(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  number_of_collaborators INT NOT NULL DEFAULT 0,
  current_version INT DEFAULT 1 NOT NULL,
  author_id UUID REFERENCES users(id) NOT NULL
);

-- +goose Down
DROP TABLE Documents;
