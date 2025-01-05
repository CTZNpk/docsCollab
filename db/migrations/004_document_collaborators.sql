-- +goose Up
CREATE TABLE DocumentCollaborators(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  document_id UUID REFERENCES documents(id) NOT NULL ,
  collaborator_id UUID REFERENCES users(id) NOT NULL
);

-- +goose Down
DROP TABLE DocumentCollaborators;
