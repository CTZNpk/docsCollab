package realtime

import (
	"sync"

	"github.com/gorilla/websocket"
)

type MessagePayload struct {
	Content       string `json:"content"`
	Position      int32  `json:"position"`
	OperationType string `json:"operation_type"`
	CurrentClock  int32  `json:"vector_clock"`
}

type VectorClock map[string]int32

type DocumentHub struct {
	mu           sync.Mutex
	connections  map[string][]*websocket.Conn
	vectorClocks map[string]VectorClock
}

func NewDocumentHub() *DocumentHub {
	return &DocumentHub{
		connections:  make(map[string][]*websocket.Conn),
		vectorClocks: make(map[string]VectorClock),
	}
}

func (hub *DocumentHub) AddConnection(documentId string, conn *websocket.Conn) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

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
}

func (hub *DocumentHub) Broadcast(documentID string, message MessagePayload) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	//this should also update document Version in database
	//this should also add an operation in the database
	conns := hub.connections[documentID]
	for _, conn := range conns {
		err := conn.WriteJSON(map[string]interface{}{
			"content":        message.Content,
			"vector_clock":   message.CurrentClock,
			"position":       message.Position,
			"operation_type": message.OperationType,
		})
		if err != nil {
			conn.Close()
		}
	}
}

func (hub *DocumentHub) InitVectorClock(documentID string, userID string) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	if _, exists := hub.vectorClocks[documentID]; !exists {
		hub.vectorClocks[documentID] = VectorClock{}
	}
	//Todo new user should have vectorClock= current Doc  version
	hub.vectorClocks[documentID][userID] = 0
}

func (hub *DocumentHub) UpdateVectorClock(documentID string, userID string) (int32, bool) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	if clock, exists := hub.vectorClocks[documentID]; exists {
		clock[userID]++
		return clock[userID], false
	}
	return 0, true
}
