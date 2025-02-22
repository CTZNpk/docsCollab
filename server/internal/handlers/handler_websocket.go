package handlers

import (
	"docsCollab/internal/config"
	"docsCollab/internal/database"
	"docsCollab/internal/realtime"
	"docsCollab/internal/services"
	"docsCollab/internal/utils"
	"log"
	"net/http"
	"os"

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

		documentID := r.URL.Query().Get("document_id")
		userToken := r.URL.Query().Get("user_token")
		if documentID == "" || userToken == "" {
			http.Error(w, "Missing query parameters", http.StatusBadRequest)
			return
		}

		userID, err := services.ExtractIdFromToken(userToken)
		if err != nil {
			http.Error(w, "Error Extracting Id From the Token", http.StatusInternalServerError)
			return

		}

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

			latestClock := hub.GetLatestVectorClock(documentID)

			operations, err := apiCfg.DB.GetDocumentOperationsBetweenVersions(r.Context(),
				database.GetDocumentOperationsBetweenVersionsParams{
					DocumentID:        utils.ConvertToUuid(documentID),
					DocumentVersion:   message.CurrentClock,
					DocumentVersion_2: latestClock,
				},
			)
			skip := false
			for _, op := range operations {
				if op.OperationType == database.OperationType(message.OperationType) &&
					op.Position == message.Position &&
					op.Content == message.Content &&
					op.DocumentVersion == message.CurrentClock {
					skip = true
					break
				}
			}

			if skip {
				lastOp := operations[len(operations)-1]
				message.CurrentClock = latestClock
				message.Content = lastOp.Content
				message.Position = lastOp.Position
				message.OperationType = string(lastOp.OperationType)
				content := realtime.SendMessagePayload{}
				content.UserId = message.UserId
				content.CurrentClock = message.CurrentClock

				docContent, err := os.ReadFile("storage/documents/" + documentID)
				if err != nil {
					http.Error(w, "Error Reading File", http.StatusInternalServerError)
					return
				}

				content.Content = string(docContent)
				hub.Broadcast(documentID, content)
				continue
			}
			services.TransformOperation(latestClock, message.CurrentClock, operations, &message.Position)

			message.CurrentClock, _ = hub.UpdateVectorClock(documentID, userID)
			_, err = apiCfg.DB.CreateOperation(
				r.Context(),
				database.CreateOperationParams{
					Position:        message.Position,
					DocumentID:      utils.ConvertToUuid(documentID),
					OperationBy:     utils.ConvertToUuid(userID),
					OperationType:   database.OperationType(message.OperationType),
					Content:         message.Content,
					DocumentVersion: message.CurrentClock,
				},
			)

			if err != nil {
				log.Println("Unable to save operation In the Database:", err)
				break
			}

			services.UpdateDocumentContent(documentID, message, hub.DocumentsContent[documentID])
			err = apiCfg.DB.UpdateDocumentVersion(
				r.Context(),
				database.UpdateDocumentVersionParams{
					ID:             utils.ConvertToUuid(documentID),
					CurrentVersion: message.CurrentClock,
				},
			)

			content := realtime.SendMessagePayload{}
			content.UserId = message.UserId
			content.CurrentClock = message.CurrentClock

			docContent, err := os.ReadFile("storage/documents/" + documentID)
			if err != nil {
				http.Error(w, "Error Reading File", http.StatusInternalServerError)
				return
			}

			content.Content = string(docContent)

			hub.Broadcast(documentID, content)
		}

	}
}
