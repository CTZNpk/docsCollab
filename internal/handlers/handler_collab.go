package handlers

import (
	"docsCollab/internal/config"
	"docsCollab/internal/utils"
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
		utils.RespondWithJson(w, 200, documents)
	}
}
