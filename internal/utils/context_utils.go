package utils

import (
	"context"
	"docsCollab/internal/middlewares"
)

func GetUserIdFromContext(ctx context.Context) string {
	id, _ := ctx.Value(middlewares.UserContextKey).(string)

	return id
}
