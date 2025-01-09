package handlers

import (
	"docsCollab/internal/config"
	"docsCollab/internal/utils"
	"encoding/json"
	"net/http"
)

func GetDocumentOperationsHandler(apiConfig *config.APIConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// id := utils.GetUserIdFromContext(r.Context())
		var params struct {
			DocumentId string `json:"document_id"`
		}

		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			http.Error(w, "Bad Input", http.StatusBadRequest)
			return
		}

		ops, err := apiConfig.DB.GetDocumentOperations(r.Context(), utils.ConvertToUuid(params.DocumentId))
		if err != nil {
			http.Error(w, "Could not retrieve Operatiosn", http.StatusInternalServerError)
			return
		}
		utils.RespondWithJson(w, 200, ops)
	}
}
