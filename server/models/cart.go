package models

import (
	"time"

	"github.com/google/uuid"
)

// Cart đại diện cho giỏ hàng của một người dùng.
type Cart struct {
	ID        uuid.UUID  `gorm:"type:uuid;primary_key" json:"id"`
	UserID    uuid.UUID  `gorm:"type:uuid;unique;not null" json:"user_id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	// Quan hệ 1 - N: Một Cart có nhiều CartItem.
	CartItems []CartItem `gorm:"foreignKey:CartID" json:"cart_items"`
}
