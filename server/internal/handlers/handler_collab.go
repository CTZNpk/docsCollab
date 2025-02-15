package handlers

import (
	"docsCollab/internal/config"
	"docsCollab/internal/database"
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
			http.Error(w, "Error Retrieving Document", http.StatusInternalServerError)
			return
		}

		if collaborators == nil {
			utils.RespondWithJson(w, 200, struct{}{})
			return
		}
		utils.RespondWithJson(w, 200, collaborators)

	}
}
func AddDocumentCollaborator(apiCfg *config.APIConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := utils.GetUserIdFromContext(r.Context())

		var params struct {
			DocumentId     string `json:"document_id"`
			CollaboratorId string `json:"collaborator_id"`
		}

		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			http.Error(w, "Wrong Input Format", http.StatusBadRequest)
			return
		}

		valid, _ := apiCfg.DB.CheckDocumentAuthor(r.Context(),
			database.CheckDocumentAuthorParams{
				AuthorID: utils.ConvertToUuid(id),
				ID:       utils.ConvertToUuid(params.DocumentId),
			},
		)
		if valid != 1 {
			http.Error(w, "Only Authors Can Add Collaborators", http.StatusBadRequest)
			return

		}

		ctx := r.Context()
		tx, err := apiCfg.DBConn.BeginTx(ctx, nil) // Start a transaction
		if err != nil {
			http.Error(w, "Failed to begin transaction", http.StatusInternalServerError)
			return
		}

		qtx := apiCfg.DB.WithTx(tx)

		valid, _ = qtx.AddCollaborator(ctx,
			database.AddCollaboratorParams{
				DocumentID:     utils.ConvertToUuid(params.DocumentId),
				CollaboratorID: utils.ConvertToUuid(params.CollaboratorId),
			},
		)

		if valid != 1 {
			tx.Rollback()
			http.Error(w, "Error Adding Collaborator", http.StatusInternalServerError)
			return
		}

		err = qtx.IncrementNumberOfCollaborators(ctx,
			utils.ConvertToUuid(params.DocumentId),
		)
		if err != nil {
			tx.Rollback()

			http.Error(w, "Error Incrementing Number Of Collaborator", http.StatusInternalServerError)
			return
		}

		// Commit transaction
		err = tx.Commit()
		if err != nil {
			http.Error(w, "Error Commiting Transaction", http.StatusInternalServerError)
			return
		}

		utils.RespondWithJson(w, 200, struct {
			Message string `json:"message"`
		}{
			Message: "Successfully Added The Collaborator",
		})

	}
}
