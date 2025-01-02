package main

import (
	"docsCollab/internal/config"
	"docsCollab/internal/handlers"
	"docsCollab/internal/middlewares"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	router := chi.NewRouter()

	router.Use(middlewares.Logger)

	apiCfg := config.SetupDatabase()
	router.Post("/signup", handlers.SignupHandler(&apiCfg))
	router.Post("/login", handlers.LoginHandler(&apiCfg))

	http.ListenAndServe(":8000", router)
}
