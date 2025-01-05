-- +goose Up
CREATE TABLE Operations(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  operation_type OPERATION_TYPE NOT NULL,
  document_id UUID REFERENCES documents(id),
  operation_by UUID REFERENCES users(id),
  timestamp TIMESTAMP DEFAULT NOW(),
  position INT NOT NULL
);

-- +goose Down
DROP TABLE Operations;
