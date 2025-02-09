package models

import (
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID          uuid.UUID  `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	Name        string     `gorm:"size:200;not null" json:"name"`
	Description string     `gorm:"type:text" json:"description"`
	Price       float64    `gorm:"type:numeric(10,2);not null" json:"price"`
	Stock       int        `gorm:"not null" json:"stock"`
	CategoryID  *uuid.UUID `gorm:"type:uuid" json:"category_id"` // Có thể là null nếu sản phẩm chưa phân loại
	ImageURL    string     `gorm:"type:text" json:"image_url"`
	CreatedAt   time.Time  `gorm:"default:now()" json:"created_at"`
	UpdatedAt   time.Time  `gorm:"default:now()" json:"updated_at"`
}
