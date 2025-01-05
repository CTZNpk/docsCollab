-- name: CreateDocument :one 
INSERT INTO Documents(title, author_id)
VALUES ($1, $2)
RETURNING id, title, number_of_collaborators, current_version, author_id;



-- name: GetMyDocuments :many
SELECT id, title
FROM Documents 
WHERE author_id = $1;




-- name: GetMyCollaborations :many
SELECT d.id , d.title
FROM Documents d
JOIN DocumentCollaborators dc ON d.id = dc.document_id
WHERE dc.collaborator_id = $1;
