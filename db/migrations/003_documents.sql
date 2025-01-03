-- +goose Up
CREATE TABLE Documents(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  number_of_collaborators INT NOT NULL DEFAULT 0,
  current_version INT DEFAULT 1,
  author_id UUID REFERENCES users(id)
);

-- +goose Down
DROP TABLE Documents;
