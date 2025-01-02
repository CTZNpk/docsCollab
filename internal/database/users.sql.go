// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: users.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const checkIfUserExists = `-- name: CheckIfUserExists :one
SELECT 1 FROM users WHERE email = $1 LIMIT 1
`

func (q *Queries) CheckIfUserExists(ctx context.Context, email string) (int32, error) {
	row := q.db.QueryRowContext(ctx, checkIfUserExists, email)
	var column_1 int32
	err := row.Scan(&column_1)
	return column_1, err
}

const createUser = `-- name: CreateUser :one
INSERT INTO users(username, email, password)
VALUES ($1, $2, $3)
RETURNING id, username, email
`

type CreateUserParams struct {
	Username string
	Email    string
	Password string
}

type CreateUserRow struct {
	ID       uuid.UUID
	Username string
	Email    string
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (CreateUserRow, error) {
	row := q.db.QueryRowContext(ctx, createUser, arg.Username, arg.Email, arg.Password)
	var i CreateUserRow
	err := row.Scan(&i.ID, &i.Username, &i.Email)
	return i, err
}

const getUserFromEmail = `-- name: GetUserFromEmail :one
SELECT username, email , password FROM users WHERE email= $1 LIMIT 1
`

type GetUserFromEmailRow struct {
	Username string
	Email    string
	Password string
}

func (q *Queries) GetUserFromEmail(ctx context.Context, email string) (GetUserFromEmailRow, error) {
	row := q.db.QueryRowContext(ctx, getUserFromEmail, email)
	var i GetUserFromEmailRow
	err := row.Scan(&i.Username, &i.Email, &i.Password)
	return i, err
}