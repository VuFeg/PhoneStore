package models

import (
	"time"

	"github.com/google/uuid"
)

// Category represents a product category
type Category struct {
    ID        uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    Name      string    `gorm:"size:100;not null" json:"name"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}