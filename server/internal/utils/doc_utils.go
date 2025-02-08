package utils

import "os"

func SaveDocumentToFile(filePath string) error {
	err := os.MkdirAll("storage/documents", os.ModePerm)
	if err != nil {
		return err
	}

	file, err := os.Create("storage/documents/" + filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	return nil
}
