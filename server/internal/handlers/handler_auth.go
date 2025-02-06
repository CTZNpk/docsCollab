package handlers

import (
	"docsCollab/internal/config"
	"docsCollab/internal/database"
	"docsCollab/internal/services"
	"docsCollab/internal/utils"
	"encoding/json"
	"log"
	"net/http"
)

type UserResponse struct {
	Id       string `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
}

type RespondWithToken struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

func LoginHandler(apiCfg *config.APIConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var creds struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		if creds.Email == "" || creds.Password == "" {
			http.Error(w, "Missing required fields", http.StatusBadRequest)
			return
		}

		//Validate user from DB
		user, err := apiCfg.DB.GetUserFromEmail(r.Context(), creds.Email)
		if err != nil {
			http.Error(w, "Error Fetching User From Database", http.StatusBadRequest)
			return
		}

		if !services.VerifyPassword(user.Password, creds.Password) {
			http.Error(w, "Invalid Password", http.StatusUnauthorized)
			return
		}

		token, err := services.GenerateJwtToken(user.ID.String())
		if err != nil {
			http.Error(w, "Error Generating Token", http.StatusInternalServerError)
			return
		}

		response := RespondWithToken{
			Token: token,
			User: UserResponse{
				Id:       user.ID.String(),
				Username: user.Username,
				Email:    user.Email,
			},
		}

		utils.RespondWithJson(w, 200, response)

	}
}

func SignupHandler(apiCfg *config.APIConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var creds struct {
			Username string `json:"username"`
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		if creds.Username == "" || creds.Email == "" || creds.Password == "" {
			http.Error(w, "Missing required fields", http.StatusBadRequest)
			return
		}

		userExists, err := apiCfg.DB.CheckIfUserExists(r.Context(), creds.Email)
		if userExists == 1 {
			http.Error(w, "User With this email already exists", http.StatusConflict)
			return
		}

		hashedPassword, err := services.HashPassword(creds.Password)
		if err != nil {
			http.Error(w, "Error Generating Hashed Password", http.StatusInternalServerError)
			return

		}
		//Create user in DB
		user, err := apiCfg.DB.CreateUser(r.Context(),
			database.CreateUserParams{
				Username: creds.Username,
				Email:    creds.Email,
				Password: hashedPassword,
			},
		)
		if err != nil {
      log.Print(err)
			http.Error(w, "Error Creating User", http.StatusInternalServerError)
			return
		}

		token, err := services.GenerateJwtToken(user.ID.String())
		if err != nil {
			http.Error(w, "Error Generating Token", http.StatusInternalServerError)
			return
		}

		response := RespondWithToken{
			Token: token,
			User: UserResponse{
				Id:       user.ID.String(),
				Email:    user.Email,
				Username: user.Username,
			},
		}

		utils.RespondWithJson(w, 200, response)
	}

}
