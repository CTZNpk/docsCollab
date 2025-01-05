package handlers

import (
	"docsCollab/internal/config"
	"docsCollab/internal/utils"
	"encoding/json"
	"net/http"
)

func GetMyCollabDocumentsHandler(apiCfg *config.APIConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := utils.GetUserIdFromContext(r.Context())

		documents, err := apiCfg.DB.GetMyCollaborations(r.Context(),
			utils.ConvertToUuid(id),
		)
		if err != nil {
			http.Error(w, "Error Retrieving User Collaboration Documents", http.StatusInternalServerError)
			return
		}
		if documents == nil {
			utils.RespondWithJson(w, 200, struct{}{})
			return
		}
		utils.RespondWithJson(w, 200, documents)
	}
}

func GetDocumentCollaborators(apiCfg *config.APIConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var params struct {
			DocumentId string `json:"document_id"`
		}

		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			http.Error(w, "Wrong Input Format", http.StatusBadRequest)
			return
		}

		collaborators, err := apiCfg.DB.GetDocumentCollaborators(r.Context(), utils.ConvertToUuid(params.DocumentId))
		if err != nil {
			http.Error(w, "Error Retrieving Document", http.StatusBadRequest)
			return
		}

		if collaborators == nil {
			utils.RespondWithJson(w, 200, struct{}{})
			return
		}
		utils.RespondWithJson(w, 200, collaborators)

	}
}
