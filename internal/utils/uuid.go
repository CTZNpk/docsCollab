package utils

import (
	"github.com/google/uuid"
)

func ConvertToUuid(id string) uuid.NullUUID {
	uid, _ := uuid.Parse(id)
	nullUuid := uuid.NullUUID{
		UUID:  uid,
		Valid: true,
	}
	return nullUuid
}
