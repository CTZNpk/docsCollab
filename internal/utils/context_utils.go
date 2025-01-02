package utils

import "context"

type contextKey string

const UserContextKey = contextKey("user")

func GetUserFromContext(ctx context.Context) string {
	user, _ := ctx.Value(UserContextKey).(string)
	return user
}
