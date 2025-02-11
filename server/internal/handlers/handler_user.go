package handlers

import (
	"database/sql"
	"docsCollab/internal/config"
	"docsCollab/internal/utils"
	"encoding/json"
	"net/http"
)

func SearchUser(apiCfg *config.APIConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var params struct {
			UserName string `json:"user_name"`
		}

		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		users, err := apiCfg.DB.SearchUserByName(r.Context(),
			sql.NullString{String: params.UserName, Valid: true},
		)

		if err != nil {
			http.Error(w, "Cannot Fetch User From Database", http.StatusInternalServerError)
			return
		}

		utils.RespondWithJson(w, 200, users)

	}
}
