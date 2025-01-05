-- name: CreateOperation :one
INSERT INTO Operations(operation_type, document_id, operation_by, position, content)
VALUES ($1, $2, $3, $4, $5)
RETURNING 1;


