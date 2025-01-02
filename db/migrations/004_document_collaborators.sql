-- +goose Up
CREATE TABLE DocumentCollaborators(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id),
  collaborator_id UUID REFERENCES users(id)
);

-- +goose Down
DROP TABLE DocumentCollaborators;
