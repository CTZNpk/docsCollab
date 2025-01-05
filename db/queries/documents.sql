-- name: CreateDocument :one 
INSERT INTO Documents(title, author_id)
VALUES ($1, $2)
RETURNING id, title, number_of_collaborators, current_version, author_id;

-- name: AddCollaborator :one
INSERT INTO DocumentCollaborators(document_id, collaborator_id)
VALUES ($1, $2)
RETURNING 1;

-- name: GetMyDocuments :many
SELECT id, title
FROM Documents 
WHERE author_id = $1;


-- name: GetDocumentCollaborators :many 
SELECT u.id , u.username
FROM DocumentCollaborators dc
JOIN Users u ON dc.collaborator_id =  u.id
WHERE dc.document_id = $1;


-- name: GetMyCollaborations :many
SELECT d.id , d.title
FROM Documents d
JOIN DocumentCollaborators dc ON d.id = dc.document_id
WHERE dc.collaborator_id = $1;
