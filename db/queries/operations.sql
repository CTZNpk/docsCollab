-- name: CreateOperation :one
INSERT INTO Operations(operation_type, document_id, operation_by, position, content, length)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING 1;
