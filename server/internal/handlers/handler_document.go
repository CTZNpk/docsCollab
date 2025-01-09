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
			http.Error(w, "Couldn't create document", http.StatusInternalServerError)
			return
		}

		err = utils.SaveDocumentToFile(document.ID.String())
		if err != nil {
			http.Error(w, "Couldn't Save Document File", http.StatusInternalServerError)
			return
		}
		utils.RespondWithJson(w, 200, document)
	}
}

func GetMyDocumentsHandler(apiCfg *config.APIConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := utils.GetUserIdFromContext(r.Context())

		documents, err := apiCfg.DB.GetMyDocuments(r.Context(),
			utils.ConvertToUuid(id),
		)
		if err != nil {
			http.Error(w, "Error Retrieving User Documents", http.StatusInternalServerError)
			return
		}
		utils.RespondWithJson(w, 200, documents)
	}
}
