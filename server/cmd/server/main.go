package main

import (
	"docsCollab/internal/config"
	"docsCollab/internal/handlers"
	"docsCollab/internal/middlewares"
	"docsCollab/internal/realtime"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	router := chi.NewRouter()

	router.Use(middlewares.Logger)

	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
		Debug:            true,
	})

	router.Use(corsOptions.Handler)

	documentHub := realtime.NewDocumentHub()

	apiCfg := config.SetupDatabase()
	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World with middlewares"))
	})
	router.Post("/signup", handlers.SignupHandler(&apiCfg))
	router.Post("/login", handlers.LoginHandler(&apiCfg))

	router.With(middlewares.AuthMiddleware).Get("/get-user", handlers.GetUser(&apiCfg))
	router.With(middlewares.AuthMiddleware).Post("/create-doc", handlers.CreateDocumentHandler(&apiCfg))
	router.With(middlewares.AuthMiddleware).Get("/get-my-docs", handlers.GetMyDocumentsHandler(&apiCfg))
	router.With(middlewares.AuthMiddleware).Get("/get-my-collabs", handlers.GetMyCollabDocumentsHandler(&apiCfg))
	router.With(middlewares.AuthMiddleware).Post("/get-doc", handlers.GetDocumentFromId(&apiCfg))
	router.With(middlewares.AuthMiddleware).Post("/search-doc", handlers.SearchDocument(&apiCfg))
	router.With(middlewares.AuthMiddleware).Post("/search-user", handlers.SearchUser(&apiCfg))
	router.Post("/get-document-collabs", handlers.GetDocumentCollaborators(&apiCfg))
	router.With(middlewares.AuthMiddleware).Post("/add-collab", handlers.AddDocumentCollaborator(&apiCfg))
	router.Get("/ws", handlers.WebSocketHandler(documentHub, &apiCfg))
	router.Post("/get-document-operations", handlers.GetDocumentOperationsHandler(&apiCfg))
	http.ListenAndServe(":8000", router)
}
