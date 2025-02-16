-- name: CreateUser :one
INSERT INTO users(username, email, password ,created_at, updated_at)
VALUES ($1, $2, $3, NOW(), NOW())
RETURNING id, username, email;


-- name: CheckIfUserExists :one
SELECT 1 FROM users WHERE email = $1 LIMIT 1;


-- name: GetUserFromEmail :one
SELECT id, username, email , password FROM users WHERE email= $1 LIMIT 1;

-- name: GetUserFromId :one
SELECT id, username, email FROM users WHERE id= $1;


-- name: SearchUserByName :many
SELECT *
FROM users u
WHERE u.username ILIKE $1|| '%';
