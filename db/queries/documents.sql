-- name: CreateDocument :one 
INSERT INTO Documents(title, author_id)
VALUES ($1, $2)
RETURNING id, title;

-- name: AddCollaborator :one
INSERT INTO DocumentCollaborators(document_id, collaborator_id)
VALUES ($1, $2)
RETURNING 1;



