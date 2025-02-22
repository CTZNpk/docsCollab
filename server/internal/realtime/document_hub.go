package realtime

import (
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/gorilla/websocket"
)

type MessagePayload struct {
	UserId        string `json:"user_id"`
	Content       string `json:"content"`
	Position      int32  `json:"position"`
	OperationType string `json:"operation_type"`
	CurrentClock  int32  `json:"vector_clock"`
}

type SendMessagePayload struct {
	UserId       string `json:"user_id"`
	Content      string `json:"content"`
	CurrentClock int32  `json:"vector_clock"`
}

type VectorClock map[string]int32
type DocumentHub struct {
	mu               sync.Mutex
	connections      map[string][]*websocket.Conn
	DocumentsContent map[string]*string
	vectorClocks     map[string]VectorClock
}

func NewDocumentHub() *DocumentHub {
	return &DocumentHub{
		connections:      make(map[string][]*websocket.Conn),
		vectorClocks:     make(map[string]VectorClock),
		DocumentsContent: make(map[string]*string),
	}
}

func (hub *DocumentHub) AddConnection(documentId string, conn *websocket.Conn) {
	hub.mu.Lock()
	defer hub.mu.Unlock()
	if _, exists := hub.DocumentsContent[documentId]; !exists {
		documentContent, err := os.ReadFile(fmt.Sprintf("./storage/documents/%s", documentId))
		if err != nil {
			log.Println("Error reading document file:", err)
			return
		}
		stringContent := string(documentContent)
		hub.DocumentsContent[documentId] = &stringContent
	}

	hub.connections[documentId] = append(hub.connections[documentId], conn)

}

func (hub *DocumentHub) RemoveConnection(documentId string, conn *websocket.Conn) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	conns := hub.connections[documentId]
	for i, c := range conns {
		if c == conn {
			hub.connections[documentId] = append(conns[:i], conns[i+1:]...)
			break
		}
	}
	delete(hub.DocumentsContent, documentId)
}

func (hub *DocumentHub) Broadcast(documentID string, message SendMessagePayload) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	var activeConns []*websocket.Conn
	conns := hub.connections[documentID]
	for _, conn := range conns {
		err := conn.WriteJSON(map[string]interface{}{
			"user_id":      message.UserId,
			"content":      message.Content,
			"vector_clock": message.CurrentClock,
		})
		if err != nil {
			conn.Close()
			continue // Skip adding it to active connections
		}
		activeConns = append(activeConns, conn)
	}
	hub.connections[documentID] = activeConns
}

func (hub *DocumentHub) InitVectorClock(documentID string, userID string, currentVersion int) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	if _, exists := hub.vectorClocks[documentID]; !exists {
		hub.vectorClocks[documentID] = VectorClock{}
		hub.vectorClocks[documentID]["latest"] = int32(currentVersion)
	}
	hub.vectorClocks[documentID][userID] = int32(currentVersion)
}

func (hub *DocumentHub) UpdateVectorClock(documentID string, userID string) (int32, bool) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	if clock, exists := hub.vectorClocks[documentID]; exists {
		clock["latest"]++
		clock[userID] = clock["latest"]
		return clock[userID], false
	}
	return 0, true
}

func (hub *DocumentHub) GetLatestVectorClock(documentId string) int32 {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	return hub.vectorClocks[documentId]["latest"]
}
