-- name: CreateOperation :one
INSERT INTO Operations(operation_type, document_id, operation_by, position, content, document_version)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING 1;

-- name: GetDocumentOperations :many
SELECT * FROM Operations
WHERE document_id = $1;

-- name: GetDocumentOperationsBetweenVersions :many
SELECT * FROM Operations
WHERE document_id = $1
AND document_version > $2 
AND document_version <= $3
ORDER BY document_version ASC;

