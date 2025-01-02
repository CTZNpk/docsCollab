-- name: CreateUser :one
INSERT INTO users(username, email, password ,created_at, updated_at)
VALUES ($1, $2, $3, NOW(), NOW())
RETURNING id, username, email;


-- name: CheckIfUserExists :one
SELECT 1 FROM users WHERE email = $1 LIMIT 1;


-- name: GetUserFromEmail :one
SELECT username, email , password FROM users WHERE email= $1 LIMIT 1;
