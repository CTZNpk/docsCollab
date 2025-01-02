package config

import (
	"database/sql"
	"docsCollab/internal/database"
	_ "github.com/lib/pq"
	"log"
	"os"
)

type APIConfig struct {
	DB *database.Queries
}

func SetupDatabase() APIConfig {

	dbUrl := os.Getenv("DB_URL")
	if dbUrl == "" {
		log.Fatal("Database Url Not Found in environment")
	}

	conn, err := sql.Open("postgres", dbUrl)
	if err != nil {
		log.Fatal("Error connecting to the database")
	}

	db := database.New(conn)
	apiCfg := APIConfig{
		DB: db,
	}

	return apiCfg
}
