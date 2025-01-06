package handlers

import (
	"docsCollab/internal/config"
	"docsCollab/internal/database"
	"docsCollab/internal/realtime"
	"docsCollab/internal/services"
	"docsCollab/internal/utils"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func WebSocketHandler(hub *realtime.DocumentHub, apiCfg *config.APIConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("Failed to upgrade to WebSocket:", err)
			return
		}
		defer conn.Close()

		var payload struct {
			DocumentId string `json:"document_id"`
			UserId     string `json:"user_id"`
		}
		if err := conn.ReadJSON(&payload); err != nil {
			log.Println("Invalid initial payload:", err)
			return
		}

		documentID := payload.DocumentId
		userID := payload.UserId

		ver, err := apiCfg.DB.GetCurrentDocumentVersion(r.Context(), utils.ConvertToUuid(documentID))
		if err != nil {
			http.Error(w, "Error Retrieving Current Document Version", http.StatusInternalServerError)
			return
		}

		hub.InitVectorClock(documentID, userID, int(ver))
		hub.AddConnection(documentID, conn)
		defer hub.RemoveConnection(documentID, conn)

		for {
			message := realtime.MessagePayload{}
			if err := conn.ReadJSON(&message); err != nil {
				log.Println("Error reading message:", err)
				break
			}
			log.Print("WE HERE THASASASA")

			message.CurrentClock, _ = hub.UpdateVectorClock(documentID, userID)
			_, err := apiCfg.DB.CreateOperation(
				r.Context(),
				database.CreateOperationParams{
					Position:      message.Position,
					DocumentID:    utils.ConvertToUuid(documentID),
					OperationBy:   utils.ConvertToUuid(userID),
					OperationType: database.OperationType(message.OperationType),
					Content:       message.Content,
				},
			)

			if err != nil {
				log.Println("Unable to save operation In the Database:", err)
				break
			}

			log.Println("WE SHOULD UPDATE VERSION NOW")
			err = apiCfg.DB.UpdateDocumentVersion(
				r.Context(),
				database.UpdateDocumentVersionParams{
					ID:             utils.ConvertToUuid(documentID),
					CurrentVersion: message.CurrentClock,
				},
			)

			log.Print("We HEREH THO")
			services.UpdateDocumentContent(documentID, message, hub.DocumentsContent[documentID])

			hub.Broadcast(documentID, message)
		}

	}
}
