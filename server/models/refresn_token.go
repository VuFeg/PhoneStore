package models

import (
	"time"

	"github.com/google/uuid"
)

type RefreshToken struct {
    ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    UserID    uuid.UUID `gorm:"type:uuid;not null"`
    Token     string    `gorm:"type:text;unique;not null"`
    ExpiresAt time.Time `gorm:"not null"`
    CreatedAt time.Time `gorm:"default:now()"`
}