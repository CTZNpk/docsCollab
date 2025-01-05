package handlers

import (
	"docsCollab/internal/realtime"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func WebSocketHandler(hub *realtime.DocumentHub) http.HandlerFunc {
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

		hub.InitVectorClock(documentID, userID)
		hub.AddConnection(documentID, conn)
		defer hub.RemoveConnection(documentID, conn)

		for {
			message := realtime.MessagePayload{}
			if err := conn.ReadJSON(&message); err != nil {
				log.Println("Error reading message:", err)
				break
			}

			message.VectorClock = hub.UpdateVectorClock(documentID, userID)

			hub.Broadcast(documentID, message)
		}

	}
}
