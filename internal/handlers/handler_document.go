package handlers

import (
	"docsCollab/internal/config"
	"docsCollab/internal/database"
	"docsCollab/internal/utils"
	"encoding/json"
	"net/http"
)

func CreateDocumentHandler(apiCfg *config.APIConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := utils.GetUserIdFromContext(r.Context())

		var params struct {
			Title string `json:"title"`
		}

		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		document, err := apiCfg.DB.CreateDocument(r.Context(),
			database.CreateDocumentParams{
				AuthorID: utils.ConvertToUuid(id),
				Title:    params.Title,
			},
		)
		if err != nil {
			http.Error(w, "Couldn't create user ", http.StatusInternalServerError)
			return
		}

		utils.RespondWithJson(w, 200, document)

	}

}
