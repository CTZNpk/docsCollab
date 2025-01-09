
-- name: AddCollaborator :one
INSERT INTO DocumentCollaborators(document_id, collaborator_id)
VALUES ($1, $2)
RETURNING 1;

-- name: CheckDocumentAuthor :one
SELECT 1 FROM documents WHERE id = $1 AND author_id = $2;

-- name: GetDocumentCollaborators :many 
SELECT u.id , u.username
FROM DocumentCollaborators dc
JOIN Users u ON dc.collaborator_id =  u.id
WHERE dc.document_id = $1;
