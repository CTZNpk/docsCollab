package main

import (
	"docsCollab/internal/config"
	"docsCollab/internal/handlers"
	"docsCollab/internal/middlewares"
	"docsCollab/internal/realtime"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	router := chi.NewRouter()

	router.Use(middlewares.Logger)

	documentHub := realtime.NewDocumentHub()

	apiCfg := config.SetupDatabase()
	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World with middlewares"))
	})
	router.Post("/signup", handlers.SignupHandler(&apiCfg))
	router.Post("/login", handlers.LoginHandler(&apiCfg))
	router.With(middlewares.AuthMiddleware).Post("/create-doc", handlers.CreateDocumentHandler(&apiCfg))
	router.With(middlewares.AuthMiddleware).Get("/get-my-docs", handlers.GetMyDocumentsHandler(&apiCfg))
	router.With(middlewares.AuthMiddleware).Get("/get-my-collabs", handlers.GetMyCollabDocumentsHandler(&apiCfg))
	router.Post("/get-document-collabs", handlers.GetDocumentCollaborators(&apiCfg))
	router.With(middlewares.AuthMiddleware).Post("/add-collab", handlers.AddDocumentCollaborator(&apiCfg))
	router.With(middlewares.AuthMiddleware).Get("/ws", handlers.WebSocketHandler(documentHub, &apiCfg))
	http.ListenAndServe(":8000", router)
}
