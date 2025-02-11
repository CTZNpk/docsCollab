package handlers

import (
	"database/sql"
	"docsCollab/internal/config"
	"docsCollab/internal/database"
	"docsCollab/internal/utils"
	"encoding/json"
	"net/http"
	"os"
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

func GetDocumentFromId(apiCfg *config.APIConfig) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		var params struct {
			DocumentId string `json:"document_id"`
		}

		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		document, err := apiCfg.DB.GetDocument(r.Context(),
			utils.ConvertToUuid(params.DocumentId),
		)

		if err != nil {
			http.Error(w, "Cannot Fetch Document From Database", http.StatusInternalServerError)
			return
		}

		content, err := os.ReadFile("storage/documents/" + params.DocumentId)
		if err != nil {
			http.Error(w, "Error Reading File", http.StatusInternalServerError)
			return
		}

		documentFormat := struct {
			DocumentId            string `json:"document_id"`
			Content               string `json:"content"`
			Title                 string `json:"title"`
			CurrentVersion        int32  `json:"current_version"`
			NumberOfCollaborators int32  `json:"number_of_collaborators"`
			AuthorId              string `json:"author_id"`
		}{
			DocumentId:            document.ID.String(),
			Content:               string(content),
			Title:                 document.Title,
			CurrentVersion:        document.CurrentVersion,
			NumberOfCollaborators: document.NumberOfCollaborators,
			AuthorId:              document.AuthorID.String(),
		}
		utils.RespondWithJson(w, 200, documentFormat)

	}
}

func SearchDocument(apiCfg *config.APIConfig) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		var params struct {
			DocumentName string `json:"document_name"`
		}

		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		documents, err := apiCfg.DB.SearchDocumentByName(r.Context(),
			sql.NullString{String: params.DocumentName, Valid: true},
		)

		if err != nil {
			http.Error(w, "Cannot Fetch Document From Database", http.StatusInternalServerError)
			return
		}

		utils.RespondWithJson(w, 200, documents)

	}
}
