package main

import (
	"docsCollab/internal/middlewares"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()

	r.Use(middlewares.Logger)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World with middlewares"))
	})

	http.ListenAndServe(":8000", r)
}
