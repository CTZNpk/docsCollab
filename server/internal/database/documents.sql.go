// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: documents.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const createDocument = `-- name: CreateDocument :one
INSERT INTO Documents(title, author_id)
VALUES ($1, $2)
RETURNING id, title, number_of_collaborators, current_version, author_id
`

type CreateDocumentParams struct {
	Title    string
	AuthorID uuid.UUID
}

type CreateDocumentRow struct {
	ID                    uuid.UUID
	Title                 string
	NumberOfCollaborators int32
	CurrentVersion        int32
	AuthorID              uuid.UUID
}

func (q *Queries) CreateDocument(ctx context.Context, arg CreateDocumentParams) (CreateDocumentRow, error) {
	row := q.db.QueryRowContext(ctx, createDocument, arg.Title, arg.AuthorID)
	var i CreateDocumentRow
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.NumberOfCollaborators,
		&i.CurrentVersion,
		&i.AuthorID,
	)
	return i, err
}

const getCurrentDocumentVersion = `-- name: GetCurrentDocumentVersion :one
SELECT current_version
FROM Documents
WHERE id = $1
`

func (q *Queries) GetCurrentDocumentVersion(ctx context.Context, id uuid.UUID) (int32, error) {
	row := q.db.QueryRowContext(ctx, getCurrentDocumentVersion, id)
	var current_version int32
	err := row.Scan(&current_version)
	return current_version, err
}

const getDocument = `-- name: GetDocument :one
SELECT id, created_at, updated_at, title, number_of_collaborators, current_version, author_id
FROM Documents
WHERE id = $1
`

func (q *Queries) GetDocument(ctx context.Context, id uuid.UUID) (Document, error) {
	row := q.db.QueryRowContext(ctx, getDocument, id)
	var i Document
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Title,
		&i.NumberOfCollaborators,
		&i.CurrentVersion,
		&i.AuthorID,
	)
	return i, err
}

const getMyCollaborations = `-- name: GetMyCollaborations :many
SELECT d.id , d.title
FROM Documents d
JOIN DocumentCollaborators dc ON d.id = dc.document_id
WHERE dc.collaborator_id = $1
`

type GetMyCollaborationsRow struct {
	ID    uuid.UUID
	Title string
}

func (q *Queries) GetMyCollaborations(ctx context.Context, collaboratorID uuid.UUID) ([]GetMyCollaborationsRow, error) {
	rows, err := q.db.QueryContext(ctx, getMyCollaborations, collaboratorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMyCollaborationsRow
	for rows.Next() {
		var i GetMyCollaborationsRow
		if err := rows.Scan(&i.ID, &i.Title); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getMyDocuments = `-- name: GetMyDocuments :many
SELECT id, title
FROM Documents 
WHERE author_id = $1
`

type GetMyDocumentsRow struct {
	ID    uuid.UUID
	Title string
}

func (q *Queries) GetMyDocuments(ctx context.Context, authorID uuid.UUID) ([]GetMyDocumentsRow, error) {
	rows, err := q.db.QueryContext(ctx, getMyDocuments, authorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMyDocumentsRow
	for rows.Next() {
		var i GetMyDocumentsRow
		if err := rows.Scan(&i.ID, &i.Title); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const searchDocumentByName = `-- name: SearchDocumentByName :many
SELECT id, created_at, updated_at, title, number_of_collaborators, current_version, author_id
FROM Documents d
WHERE d.title ILIKE $1|| '%'
`

func (q *Queries) SearchDocumentByName(ctx context.Context, dollar_1 sql.NullString) ([]Document, error) {
	rows, err := q.db.QueryContext(ctx, searchDocumentByName, dollar_1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Document
	for rows.Next() {
		var i Document
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Title,
			&i.NumberOfCollaborators,
			&i.CurrentVersion,
			&i.AuthorID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateDocumentVersion = `-- name: UpdateDocumentVersion :exec
UPDATE Documents
SET current_version = $1
WHERE id = $2
`

type UpdateDocumentVersionParams struct {
	CurrentVersion int32
	ID             uuid.UUID
}

func (q *Queries) UpdateDocumentVersion(ctx context.Context, arg UpdateDocumentVersionParams) error {
	_, err := q.db.ExecContext(ctx, updateDocumentVersion, arg.CurrentVersion, arg.ID)
	return err
}
