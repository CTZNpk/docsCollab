-- +goose Up
CREATE TABLE Operations(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  operation_type OPERATION_TYPE NOT NULL,
  document_id UUID REFERENCES documents(id) NOT NULL,
  operation_by UUID REFERENCES users(id) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  document_version INT DEFAULT 0 NOT NULL,
  position INT NOT NULL,
  content TEXT NOT NULL
);

-- +goose Down
DROP TABLE Operations;
