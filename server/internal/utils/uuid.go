package utils

import (
	"github.com/google/uuid"
)

func ConvertToUuid(id string) uuid.UUID {
	uid, _ := uuid.Parse(id)
	return uid
}
