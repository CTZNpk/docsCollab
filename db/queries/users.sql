-- name: CreateUser :one
INSERT INTO users(username, email, password)
VALUES ($1, $2, $3)
RETURNING id, username, email;


-- name: CheckIfUserExists :one
SELECT 1 FROM users WHERE email = $1 LIMIT 1;


-- name: GetUserFromEmail :one
SELECT username, email , password FROM users WHERE email= $1 LIMIT 1;
