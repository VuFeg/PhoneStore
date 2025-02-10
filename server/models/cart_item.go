package models

import (
	"time"

	"github.com/google/uuid"
)

// CartItem đại diện cho một mặt hàng trong giỏ hàng.
type CartItem struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	CartID    uuid.UUID      `gorm:"type:uuid;not null" json:"cart_id"`       // Liên kết với Cart
	VariantID uuid.UUID      `gorm:"type:uuid;not null" json:"variant_id"`    // Liên kết với ProductVariant
	Quantity  int            `json:"quantity"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	// Preload thông tin Variant nếu cần.
	Variant   ProductVariant `gorm:"foreignKey:VariantID;references:ID" json:"variant,omitempty"`
}

type AddCartItemInput struct {
	VariantID string `json:"variant_id" binding:"required,uuid"`
	Quantity  int    `json:"quantity" binding:"required,gt=0"`
}

type UpdateCartItemInput struct {
	Quantity *int `json:"quantity" binding:"omitempty,gt=0"`
}
