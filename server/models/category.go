package models

import (
	"time"

	"github.com/google/uuid"
)

type Category struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	ProductID   uuid.UUID `gorm:"type:uuid;not null" json:"product_id"`
	Name        string    `gorm:"size:100;not null" json:"name"`
	Description string    `json:"description"`
	Price       float64   `gorm:"type:numeric(10,2)" json:"price"`
	Stock       int       `json:"stock"`
	Public      bool      `gorm:"default:true" json:"public"`
	Active      bool      `gorm:"default:true" json:"active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}


type CreateCategoryInput struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" binding:"required"`
	Stock       int     `json:"stock" binding:"required"`
}

type UpdateCategoryInput struct {
	Name        *string  `json:"name"`
	Description *string  `json:"description"`
	Price       *float64 `json:"price"`
	Stock       *int     `json:"stock"`
	Public      *bool    `json:"public"`
	Active      *bool    `json:"active"`
}