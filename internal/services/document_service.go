package services

import (
	"docsCollab/internal/realtime"
	"fmt"
	"os"
)

func UpdateDocumentContent(documentID string, message realtime.MessagePayload, documentContent *string) error {
	filePath := fmt.Sprintf("./storage/documents/%s", documentID)
	switch message.OperationType {
	case "INSERT":
		if err := insertContent(documentContent, message.Content, message.Position); err != nil {
			return err
		}
	case "DELETE":
		if err := deleteContent(documentContent, message.Position); err != nil {
			return err
		}
	case "UPDATE":
		if err := updateContent(documentContent, message.Content, message.Position); err != nil {
			return err
		}
	default:
		return fmt.Errorf("unsupported operation type: %s", message.OperationType)
	}

	if err := os.WriteFile(filePath, []byte(*documentContent), 0644); err != nil {
		return fmt.Errorf("error writing document content to file: %w", err)
	}

	return nil
}
func insertContent(documentContent *string, content string, position int32) error {
	if position < 0 || position > int32(len(*documentContent)) {
		return fmt.Errorf("invalid position: %d", position)
	}

	*documentContent = (*documentContent)[:position] + content + (*documentContent)[position:]
	return nil
}

func deleteContent(documentContent *string, position int32) error {
	if position < 0 || position >= int32(len(*documentContent)) {
		return fmt.Errorf("invalid position: %d", position)
	}

	end := int(position) + 1
	if end > len(*documentContent) {
		end = len(*documentContent)
	}

	*documentContent = (*documentContent)[:position] + (*documentContent)[end:]
	return nil
}

func updateContent(documentContent *string, content string, position int32) error {
	if position < 0 || position >= int32(len(*documentContent)) {
		return fmt.Errorf("invalid position: %d", position)
	}

	*documentContent = (*documentContent)[:position] + content + (*documentContent)[position+1:]
	return nil
}
