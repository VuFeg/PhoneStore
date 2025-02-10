package models

import (
	"time"

	"github.com/google/uuid"
)

// Product lưu thông tin chung của sản phẩm
type Product struct {
	ID          uuid.UUID         `gorm:"type:uuid;primary_key" json:"id"`
	Name        string            `gorm:"size:200;not null" json:"name"`
	Description string            `json:"description"`
	ImageURL    string            `json:"image_url"`
	// Trường Public để xác định sản phẩm có được hiển thị hay không
	Public      bool              `gorm:"default:true" json:"public"`
	// Một sản phẩm có thể có nhiều variant (phiên bản)
	Variants    []ProductVariant  `gorm:"foreignKey:ProductID;references:ID" json:"variants"`
	CreatedAt   time.Time         `json:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at"`
}

// CreateProductInput chỉ chứa các trường thông tin chung của sản phẩm
type CreateProductInput struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url" binding:"omitempty,url"`
}

// UpdateProductInput chỉ cho phép cập nhật thông tin chung của sản phẩm
type UpdateProductInput struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	ImageURL    *string `json:"image_url"`
	Public      *bool   `json:"public"`
}
