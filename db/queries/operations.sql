-- name: CreateOperation :one
INSERT INTO Operations(operation_type, document_id, operation_by, position)
VALUES ($1, $2, $3, $4)
RETURNING 1;


