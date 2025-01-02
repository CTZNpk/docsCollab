package middlewares

import (
	"context"
	"docsCollab/internal/services"
	"net/http"
	"strings"
)

type contextKey string

const UserContextKey = contextKey("user")

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer")
		claims, err := services.ValidateToken(tokenStr)
		if err != nil {
			http.Error(w, "Invalid or expired Token", http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), UserContextKey, claims.Email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
